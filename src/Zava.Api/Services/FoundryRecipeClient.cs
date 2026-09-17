using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Azure.Core;

namespace Zava.Api.Services;

public sealed class FoundryRecipeClient(
    HttpClient httpClient, TokenCredential credential, IConfiguration configuration)
{
    private const int MaxResponseBytes = 65_536;
    private static readonly string[] Scopes = ["https://ai.azure.com/.default"];
    private readonly string plannerName = configuration["Foundry:PlannerAgentName"] ?? "recipe-planner";
    private readonly string shopperName = configuration["Foundry:ShopperAgentName"] ?? "recipe-shopper";
    private readonly Uri? endpoint = ProjectEndpoint(configuration["Foundry:ProjectEndpoint"]);

    public bool Available => endpoint is not null
        && ValidAgentName(plannerName) && ValidAgentName(shopperName) && plannerName != shopperName;

    public Task<JsonDocument> PlanAsync(object input, CancellationToken cancellationToken) =>
        RespondAsync(plannerName, "recipe_ingredients", PlannerSchema, input, cancellationToken);

    public Task<JsonDocument> ShopAsync(object input, CancellationToken cancellationToken) =>
        RespondAsync(shopperName, "recipe_selection", ShopperSchema, input, cancellationToken);

    private async Task<JsonDocument> RespondAsync(
        string agent, string schemaName, string schema, object input, CancellationToken cancellationToken)
    {
        if (!Available) throw new RecipeProviderException();
        var token = await credential.GetTokenAsync(new TokenRequestContext(Scopes), cancellationToken);
        using var request = new HttpRequestMessage(HttpMethod.Post,
            $"{endpoint!.AbsoluteUri.TrimEnd('/')}/openai/v1/responses");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.Token);
        request.Content = new StringContent(JsonSerializer.Serialize(new
        {
            agent_reference = new { type = "agent_reference", name = agent },
            input = JsonSerializer.Serialize(input),
            store = false,
            tool_choice = "none",
            reasoning = new { effort = "low" },
            max_output_tokens = 4000,
            text = new
            {
                format = new
                {
                    type = "json_schema",
                    name = schemaName,
                    strict = true,
                    schema = JsonSerializer.Deserialize<JsonElement>(schema)
                }
            }
        }), Encoding.UTF8, "application/json");

        using var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        if (!response.IsSuccessStatusCode || response.Content.Headers.ContentLength > MaxResponseBytes)
            throw new RecipeProviderException();
        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var buffer = new MemoryStream();
        var chunk = new byte[4096];
        int read;
        while ((read = await stream.ReadAsync(chunk, cancellationToken)) > 0)
        {
            if (buffer.Length + read > MaxResponseBytes) throw new RecipeProviderException();
            buffer.Write(chunk, 0, read);
        }
        using var envelope = JsonDocument.Parse(buffer.ToArray(), new JsonDocumentOptions { MaxDepth = 32 });
        var root = envelope.RootElement;
        if (root.GetProperty("status").GetString() != "completed") throw new RecipeProviderException();
        string? output = null;
        foreach (var message in root.GetProperty("output").EnumerateArray())
        {
            if (message.GetProperty("type").GetString() != "message") continue;
            foreach (var part in message.GetProperty("content").EnumerateArray())
            {
                if (part.GetProperty("type").GetString() != "output_text" || output is not null)
                    throw new RecipeProviderException();
                output = part.GetProperty("text").GetString();
            }
        }
        if (string.IsNullOrWhiteSpace(output) || output.Length > 16_000) throw new RecipeProviderException();
        return JsonDocument.Parse(output, new JsonDocumentOptions { MaxDepth = 8 });
    }

    private static bool ValidAgentName(string name) =>
        name.Length is > 0 and <= 63 && name.All(c => char.IsAsciiLetterOrDigit(c) || c is '-' or '_');

    private static Uri? ProjectEndpoint(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri)
        && uri.Scheme == Uri.UriSchemeHttps && uri.IsDefaultPort
        && string.IsNullOrEmpty(uri.UserInfo) && string.IsNullOrEmpty(uri.Query) && string.IsNullOrEmpty(uri.Fragment)
        && System.Text.RegularExpressions.Regex.IsMatch(uri.AbsolutePath, @"^/api/projects/[^/]+/?$")
            ? uri : null;

    private const string PlannerSchema = """
        {"type":"object","additionalProperties":false,"required":["ingredients"],"properties":{
          "ingredients":{"type":"array","items":{"type":"object","additionalProperties":false,
            "required":["name","quantity","unit"],"properties":{
              "name":{"type":"string"},
              "quantity":{"type":"number"},
              "unit":{"type":"string","enum":["g","kg","ml","l","piece"]}}}}}}
        """;

    private const string ShopperSchema = """
        {"type":"object","additionalProperties":false,"required":["selections","missingIngredientIndexes"],"properties":{
          "selections":{"type":"array","items":{"type":"object","additionalProperties":false,
            "required":["ingredientIndex","productId","variantId","quantity"],"properties":{
              "ingredientIndex":{"type":"integer"},
              "productId":{"type":"integer"},
              "variantId":{"type":["integer","null"]},
              "quantity":{"type":"integer"}}}},
          "missingIngredientIndexes":{"type":"array","items":{"type":"integer"}}}}
        """;
}

public sealed class RecipeProviderException : Exception;
