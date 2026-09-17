using System.Diagnostics;
using System.Text.Json;
using Azure.Identity;
using Microsoft.ApplicationInsights;
using Zava.Api.Models;

namespace Zava.Api.Services;

public static class RecipeBasketEndpoints
{
    public static void MapRecipeBasket(this WebApplication app)
    {
        app.MapGet("/api/recipe-basket/options", (RecipeBasketService service, DataStore store) =>
            Results.Ok(new
            {
                available = service.Available,
                suggestions = store.CurrentSiteType == SiteType.Grocery ? RecipeBasketService.Suggestions : []
            }));

        app.MapPost("/api/recipe-basket/plan", async (
            RecipeBasketRequest request, RecipeBasketService service, IConfiguration configuration,
            HttpContext context, TelemetryClient telemetry, ILogger<RecipeBasketService> logger) =>
        {
            if (!RecipeBasketService.ValidRequest(request))
                return Results.BadRequest(new { message = "Indiquez une recette (200 caractères maximum), 1 à 20 personnes et une préférence valide." });
            var started = Stopwatch.GetTimestamp();
            var outcome = "unavailable";
            using var timeout = CancellationTokenSource.CreateLinkedTokenSource(context.RequestAborted);
            timeout.CancelAfter(TimeSpan.FromSeconds(Math.Clamp(configuration.GetValue("Foundry:TimeoutSeconds", 45), 5, 60)));
            try
            {
                var plan = await service.PlanAsync(request, timeout.Token);
                outcome = "success";
                return Results.Ok(plan);
            }
            catch (RecipeBasketException exception)
            {
                outcome = $"rejected_{exception.StatusCode}";
                if (exception.StatusCode == 429) context.Response.Headers.RetryAfter = "60";
                return Results.Json(new { message = exception.Message }, statusCode: exception.StatusCode);
            }
            catch (OperationCanceledException)
            {
                outcome = context.RequestAborted.IsCancellationRequested ? "cancelled" : "timeout";
                return Results.Json(new { message = "L’assistant recettes a dépassé le délai. Réessayez." }, statusCode: 504);
            }
            catch (Exception exception) when (exception is RecipeProviderException or HttpRequestException
                or AuthenticationFailedException or JsonException or InvalidOperationException
                or KeyNotFoundException or FormatException or OverflowException)
            {
                return Results.Json(new { message = "L’assistant recettes est temporairement indisponible. Réessayez plus tard." }, statusCode: 503);
            }
            finally
            {
                var duration = Stopwatch.GetElapsedTime(started).TotalMilliseconds;
                telemetry.TrackEvent("RecipeBasketPlan", new Dictionary<string, string> { ["outcome"] = outcome },
                    new Dictionary<string, double> { ["durationMs"] = duration });
                logger.LogInformation("Recipe basket plan {Outcome} in {DurationMs}ms", outcome, duration);
            }
        });

        app.MapPost("/api/recipe-basket/commit", (
            CommitRecipeBasketRequest request, RecipeBasketService service, TelemetryClient telemetry) =>
        {
            if (request.PlanId is null || !Guid.TryParseExact(request.PlanId, "N", out _))
                return Results.BadRequest(new { message = "Identifiant de panier recette invalide." });
            try
            {
                var cart = service.Commit(request.PlanId);
                telemetry.TrackEvent("RecipeBasketCommit", new Dictionary<string, string> { ["outcome"] = "success" });
                return Results.Ok(cart);
            }
            catch (RecipeBasketException exception)
            {
                telemetry.TrackEvent("RecipeBasketCommit", new Dictionary<string, string> { ["outcome"] = $"rejected_{exception.StatusCode}" });
                return Results.Json(new { message = exception.Message }, statusCode: exception.StatusCode);
            }
        });
    }
}
