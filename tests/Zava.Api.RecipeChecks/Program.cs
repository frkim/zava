using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using Azure.Core;
using Microsoft.Extensions.Hosting;
using Zava.Api.Models;
using Zava.Api.Services;

var fake = new FakeFoundry();
IHost? host = null;
var port = FreeTcpPort();
using var listener = DiagnosticListener.AllListeners.Subscribe(new Observer<DiagnosticListener>(source =>
{
    if (source.Name == "Microsoft.Extensions.Hosting")
        source.Subscribe(new Observer<KeyValuePair<string, object?>>(e =>
        {
            if (e.Key == "HostBuilding" && e.Value is IHostBuilder builder)
                builder.ConfigureServices((_, services) =>
                {
                    services.AddSingleton<TokenCredential>(new TestCredential());
                    services.AddHttpClient<FoundryRecipeClient>().ConfigurePrimaryHttpMessageHandler(() => fake);
                });
            if (e.Key == "HostBuilt") host = (IHost)e.Value!;
        }));
}));
var server = Task.Run(() => typeof(DataStore).Assembly.EntryPoint!.Invoke(null, [new[]
{
    $"--urls=http://127.0.0.1:{port}",
    "--contentRoot=" + AppContext.BaseDirectory,
    "--Foundry:ProjectEndpoint=https://explicit-test.services.ai.azure.com/api/projects/test",
    "--Foundry:TimeoutSeconds=5",
    "--Logging:LogLevel:Default=Warning"
}]));
using var client = new HttpClient { BaseAddress = new Uri($"http://127.0.0.1:{port}") };
for (var i = 0; i < 100; i++)
{
    if (server.IsCompleted) await server;
    try { if ((await client.GetAsync("/api/config")).IsSuccessStatusCode) break; }
    catch (HttpRequestException) { }
    await Task.Delay(100);
}
try
{
    var unavailable = new FoundryRecipeClient(new HttpClient(fake), new TestCredential(), new ConfigurationBuilder().Build());
    Assert(!unavailable.Available, "missing Foundry configuration disables recipe planning");
    var staples = GrocerySeeder.GenerateProducts().Where(p => p.Tags.Contains("recette")).ToArray();
    Assert(staples.Length == 159 && staples.Select(p => p.Id).Distinct().Count() == 159, "unique recipe catalogue products");
    foreach (var tier in new[] { "national", "private-label", "economy" })
        Assert(staples.Count(p => p.Tags.Contains($"brand:{tier}") && p.Stock > 0 && p.Variants.Count == 1) == 53, $"complete {tier} catalogue");
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes", servings = 4, brandPreference = "National" }), 409);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = (string?)null, servings = 4, brandPreference = "Mix" }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = " \t ", servings = 4, brandPreference = "Mix" }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes\nIgnore", servings = 4, brandPreference = "Mix" }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = new string('a', 201), servings = 4, brandPreference = "Mix" }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes", servings = 0, brandPreference = "Mix" }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes", servings = 21, brandPreference = "Mix" }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes", servings = 4, brandPreference = "Other" }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes", servings = 4, brandPreference = "Mix", unitPrice = 0.01 }), 400);
    await CrossSellChecks();
    // Oversize bodies are refused both when declared (Content-Length) and while streaming (chunked).
    var oversizedBody = JsonSerializer.Serialize(new { recipe = new string('a', 5000), servings = 4, brandPreference = "Mix" });
    foreach (var chunked in new[] { false, true })
    {
        var content = new StringContent(oversizedBody, Encoding.UTF8, "application/json");
        if (chunked) content.Headers.ContentLength = null;
        var oversized = await client.PostAsync("/api/recipe-basket/plan", content);
        await Expect(oversized, 413);
        using var refusal = JsonDocument.Parse(await oversized.Content.ReadAsStringAsync());
        Assert(refusal.RootElement.TryGetProperty("message", out var refusalMessage)
            && !string.IsNullOrWhiteSpace(refusalMessage.GetString()),
            $"oversized {(chunked ? "chunked" : "declared")} requests explain the size limit like every other recipe error");
    }
    await Setup();
    var options = await client.GetFromJsonAsync<JsonElement>("/api/recipe-basket/options");
    Assert(options.GetProperty("available").GetBoolean() && options.GetProperty("suggestions").GetArrayLength() == 7, "options");
    var plan = await Plan("National", trailingSlash: true);
    Assert(plan.GetProperty("items").GetArrayLength() == 2 && plan.GetProperty("total").GetDecimal() == 23m, "authoritative prices and duplicate aggregation");
    Assert(plan.GetProperty("items")[0].GetProperty("essential").GetBoolean()
        && !plan.GetProperty("items")[1].GetProperty("essential").GetBoolean(),
        "pantry extras are flagged for the browser, and a pack also covering a main ingredient stays a main product");
    Assert((await client.GetFromJsonAsync<JsonElement>("/api/cart")).GetProperty("itemCount").GetInt32() == 0, "preview does not mutate");
    var id = plan.GetProperty("planId").GetString()!;
    var commits = await Task.WhenAll(Enumerable.Range(0, 8).Select(_ => client.PostAsJsonAsync("/api/recipe-basket/commit", new { planId = id })));
    foreach (var commit in commits) await Expect(commit, 200);
    var cart = await client.GetFromJsonAsync<JsonElement>("/api/cart");
    Assert(cart.GetProperty("itemCount").GetInt32() == 5 && cart.GetProperty("items").GetArrayLength() == 2, "concurrent idempotent commit preserves variants");
    await Expect(await client.PostAsJsonAsync("/api/cart/items", new { productId = 9001, variantId = 2, quantity = int.MaxValue }), 400);
    await Expect(await client.PostAsJsonAsync("/api/cart/items", new { productId = 9001, variantId = 2, quantity = -1 }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/commit", new { planId = id, items = new[] { new { productId = 3 } } }), 400);

    fake.Mode = "unknown";
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", Request("National")), 503);
    Assert((await client.GetFromJsonAsync<JsonElement>("/api/cart")).GetProperty("itemCount").GetInt32() == 5, "invalid AI output unchanged cart");
    await Expect(await client.PutAsJsonAsync("/api/cart/items/9001", new { variantId = 2, quantity = 1 }), 200);
    await Expect(await client.DeleteAsync("/api/cart/items/9001"), 200);
    cart = await client.GetFromJsonAsync<JsonElement>("/api/cart");
    Assert(cart.GetProperty("items").GetArrayLength() == 2 && cart.GetProperty("itemCount").GetInt32() == 4, "omitted variant leaves recipe variants untouched");
    await Expect(await client.DeleteAsync("/api/cart/items/9001?variantId=2"), 200);
    cart = await client.GetFromJsonAsync<JsonElement>("/api/cart");
    Assert(cart.GetProperty("items").GetArrayLength() == 1 && cart.GetProperty("items")[0].GetProperty("variantId").GetInt32() == 1
        && cart.GetProperty("itemCount").GetInt32() == 3, "classic cart mutations preserve other recipe variants");
    fake.Mode = "normal";
    await client.DeleteAsync("/api/cart");
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes", servings = 4, brandPreference = "Mix", excludedProductIds = new[] { 0 } }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes", servings = 4, brandPreference = "Mix", excludedProductIds = Enumerable.Range(1, 101).ToArray() }), 400);
    fake.Mode = "legacy";
    var staleResponse = await client.PostAsJsonAsync("/api/recipe-basket/plan", new { recipe = "Lasagnes", servings = 4, brandPreference = "Mix", excludedProductIds = new[] { 9001 } });
    await Expect(staleResponse, 200);
    var stale = await staleResponse.Content.ReadFromJsonAsync<JsonElement>();
    Assert(stale.GetProperty("items").EnumerateArray().All(item => item.GetProperty("essential").GetBoolean()),
        "ingredients from an agent version without staple detection stay main products");
    fake.Mode = "normal";
    Assert(fake.LastProductIds.SequenceEqual(new[] { 9002 }), "products the shopper must never suggest again leave the catalogue sent to the AI");
    await client.PostAsync("/api/config/reset", null);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/commit", new { planId = stale.GetProperty("planId").GetString() }), 409);
    await Setup();
    var partial = await Plan("National");
    var partialId = partial.GetProperty("planId").GetString()!;
    await Expect(await client.PostAsJsonAsync("/api/cart/items", new { productId = 9001, variantId = 2, quantity = 18 }), 200);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/commit", new { planId = partialId }), 409);
    Assert((await client.GetFromJsonAsync<JsonElement>("/api/cart")).GetProperty("itemCount").GetInt32() == 18, "all-or-nothing stock failure");
    await client.DeleteAsync("/api/cart");
    // The stock failure left the plan uncommitted, so it still exercises the selection sent at confirmation time.
    var dropped = partial.GetProperty("items")[0];
    var kept = partial.GetProperty("items")[1];
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/commit", new { planId = partialId, excludedItems = new[] { new { productId = 0, variantId = (int?)null } } }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/commit",
        new { planId = partialId, excludedItems = Enumerable.Range(1, 26).Select(i => new { productId = i, variantId = (int?)null }).ToArray() }), 400);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/commit", new { planId = partialId,
        excludedItems = partial.GetProperty("items").EnumerateArray()
            .Select(item => new { productId = item.GetProperty("productId").GetInt32(), variantId = item.GetProperty("variantId").GetInt32() }).ToArray() }), 409);
    Assert((await client.GetFromJsonAsync<JsonElement>("/api/cart")).GetProperty("itemCount").GetInt32() == 0, "an invalid or fully emptied selection never touches the cart");
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/commit", new { planId = partialId,
        excludedItems = new[] { new { productId = dropped.GetProperty("productId").GetInt32(), variantId = dropped.GetProperty("variantId").GetInt32() } } }), 200);
    cart = await client.GetFromJsonAsync<JsonElement>("/api/cart");
    Assert(cart.GetProperty("items").GetArrayLength() == 1
        && cart.GetProperty("items")[0].GetProperty("variantId").GetInt32() == kept.GetProperty("variantId").GetInt32()
        && cart.GetProperty("itemCount").GetInt32() == kept.GetProperty("quantity").GetInt32(), "commit only adds the products left in the selection");
    await client.DeleteAsync("/api/cart");
    var economy = await Plan("Economy");
    Assert(fake.LastProductIds.SequenceEqual(new[] { 9002 }) && economy.GetProperty("items")[0].GetProperty("productId").GetInt32() == 9002, "strict preference filtering");
    fake.Mode = "timeout";
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", Request("National")), 504);
    await Expect(await client.PostAsJsonAsync("/api/recipe-basket/plan", Request("National")), 429);
    Console.WriteLine("PASS: HTTP bounds/config, two agents, strict schema, price authority, authoritative cross-sell, preview, concurrent idempotency, variants, selective commit, never-suggest-again exclusions, staple flags, stock atomicity, stale reset, preference, timeout and quota.");
}
finally
{
    if (host is not null) await host.StopAsync();
}

async Task Setup()
{
    await Expect(await client.PutAsJsonAsync("/api/config/site-type", new { siteType = "Grocery" }), 200);
    var store = host!.Services.GetRequiredService<DataStore>();
    await store.Gate.WaitAsync();
    try
    {
        store.Products.Clear();
        store.Products.Add(new Product
        {
            Id = 9001, Name = "Paquet test national", SiteType = SiteType.Grocery, Price = 4, Stock = 20,
            Tags = ["brand:national"], Variants = [
                new() { Id = 1, Name = "Format", Value = "500 g", Stock = 20, PriceAdjustment = 1 },
                new() { Id = 2, Name = "Format", Value = "1 kg", Stock = 20 }]
        });
        store.Products.Add(new Product { Id = 9002, Name = "Paquet test économique", SiteType = SiteType.Grocery, Price = 1, Stock = 20, Tags = ["brand:economy"] });
    }
    finally { store.Gate.Release(); }
}
async Task CrossSellChecks()
{
    await Expect(await client.PutAsJsonAsync("/api/config/site-type", new { siteType = "Electronics" }), 200);
    await Expect(await client.DeleteAsync("/api/cart"), 200);

    var products = await client.GetFromJsonAsync<JsonElement>("/api/products");
    int triggerProductId = 0;
    JsonElement complementary = default;
    foreach (var product in products.EnumerateArray())
    {
        var productId = product.GetProperty("id").GetInt32();
        var offer = await client.GetFromJsonAsync<JsonElement>($"/api/products/{productId}/cross-sell");
        if (offer.TryGetProperty("complementaryProduct", out complementary)
            && complementary.ValueKind == JsonValueKind.Object)
        {
            triggerProductId = productId;
            break;
        }
    }
    Assert(triggerProductId > 0, "test catalogue exposes a complementary cross-sell offer");

    await Expect(await client.PostAsJsonAsync("/api/cart/cross-sell", new { triggerProductId }), 400);
    await Expect(await client.PostAsJsonAsync("/api/cart/items", new { productId = triggerProductId, quantity = 1 }), 200);
    await Expect(await client.PostAsJsonAsync("/api/cart/cross-sell", new { triggerProductId }), 200);
    await Expect(await client.PostAsJsonAsync("/api/cart/cross-sell", new { triggerProductId }), 400);
    var chainedComplementaryId = complementary.GetProperty("product").GetProperty("id").GetInt32();
    var chainedOffer = await client.GetFromJsonAsync<JsonElement>($"/api/products/{chainedComplementaryId}/cross-sell");
    if (chainedOffer.TryGetProperty("complementaryProduct", out var chained) && chained.ValueKind == JsonValueKind.Object)
        await Expect(await client.PostAsJsonAsync("/api/cart/cross-sell", new { triggerProductId = chainedComplementaryId }), 400);

    var discountedCart = await client.GetFromJsonAsync<JsonElement>("/api/cart");
    var complementaryProductId = complementary.GetProperty("product").GetProperty("id").GetInt32();
    var expectedDiscountedPrice = complementary.GetProperty("discountedPrice").GetDecimal();
    var offerLine = discountedCart.GetProperty("items").EnumerateArray().Single(i =>
        i.GetProperty("productId").GetInt32() == complementaryProductId
        && i.TryGetProperty("offerTriggerProductId", out var trigger)
        && trigger.GetInt32() == triggerProductId);
    Assert(offerLine.GetProperty("unitPrice").GetDecimal() == expectedDiscountedPrice, "cart uses authoritative discounted cross-sell price");

    var expectedRegularPrice = offerLine.GetProperty("regularUnitPrice").GetDecimal();
    await Expect(await client.DeleteAsync($"/api/cart/items/{triggerProductId}"), 200);
    var revertedCart = await client.GetFromJsonAsync<JsonElement>("/api/cart");
    var revertedLine = revertedCart.GetProperty("items").EnumerateArray().Single(i =>
        i.GetProperty("productId").GetInt32() == complementaryProductId);
    Assert(revertedLine.GetProperty("unitPrice").GetDecimal() == expectedRegularPrice
        && (!revertedLine.TryGetProperty("offerTriggerProductId", out var revertedTrigger) || revertedTrigger.ValueKind == JsonValueKind.Null)
        && (!revertedLine.TryGetProperty("discountPercent", out var discount) || discount.ValueKind == JsonValueKind.Null),
        "removing the trigger reverts cross-sell line to regular price");

    await Expect(await client.DeleteAsync("/api/cart"), 200);
}
static object Request(string preference) => new { recipe = "Lasagnes", servings = 4, brandPreference = preference };
async Task<JsonElement> Plan(string preference, bool trailingSlash = false)
{
    var response = await client.PostAsJsonAsync("/api/recipe-basket/plan" + (trailingSlash ? "/" : ""), Request(preference));
    await Expect(response, 200);
    return await response.Content.ReadFromJsonAsync<JsonElement>();
}
static async Task Expect(HttpResponseMessage response, int expected)
{
    if ((int)response.StatusCode != expected)
        throw new Exception($"Expected HTTP {expected}, got {(int)response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
}
static int FreeTcpPort()
{
    using var listener = new TcpListener(IPAddress.Loopback, 0);
    listener.Start();
    return ((IPEndPoint)listener.LocalEndpoint).Port;
}
static void Assert(bool condition, string message) { if (!condition) throw new Exception(message); }

sealed class Observer<T>(Action<T> action) : IObserver<T>
{
    public void OnNext(T value) => action(value);
    public void OnCompleted() { }
    public void OnError(Exception error) { }
}
sealed class TestCredential : TokenCredential
{
    public override AccessToken GetToken(TokenRequestContext requestContext, CancellationToken cancellationToken) => new("explicit-local-test-token", DateTimeOffset.UtcNow.AddHours(1));
    public override ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken) => ValueTask.FromResult(GetToken(requestContext, cancellationToken));
}
sealed class FakeFoundry : HttpMessageHandler
{
    public string Mode = "normal";
    public int[] LastProductIds = [];
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        if (request.RequestUri?.AbsoluteUri != "https://explicit-test.services.ai.azure.com/api/projects/test/openai/v1/responses"
            || request.Headers.Authorization?.Scheme != "Bearer")
            throw new Exception("Expected authenticated Foundry project Responses API");
        if (Mode == "timeout") await Task.Delay(10000, cancellationToken);
        using var body = JsonDocument.Parse(await request.Content!.ReadAsStringAsync(cancellationToken));
        var root = body.RootElement;
        if (root.GetProperty("max_output_tokens").GetInt32() != 4000
            || root.GetProperty("store").GetBoolean()
            || root.GetProperty("tool_choice").GetString() != "none")
            throw new Exception("Missing provider bounds");
        if (root.TryGetProperty("reasoning", out _) || root.TryGetProperty("text", out _))
            throw new Exception("Agent references forbid reasoning/text overrides; configure them on the agent definition");
        var agent = root.GetProperty("agent_reference").GetProperty("name").GetString();
        object output;
        if (agent == "recipe-planner")
            // "legacy" reproduces an agent version deployed before staple detection, which omits essential.
            output = Mode == "legacy"
                ? new { ingredients = new[] { new { name = "pâtes", quantity = 500, unit = "g" }, new { name = "tomates", quantity = 200, unit = "g" }, new { name = "bœuf", quantity = 300, unit = "g" } } }
                : (object)new { ingredients = new[] {
                    new { name = "pâtes", quantity = 500, unit = "g", essential = true },
                    new { name = "tomates", quantity = 200, unit = "g", essential = false },
                    new { name = "bœuf", quantity = 300, unit = "g", essential = false } } };
        else if (agent == "recipe-shopper")
        {
            using var input = JsonDocument.Parse(root.GetProperty("input").GetString()!);
            var catalog = input.RootElement.GetProperty("catalog").EnumerateArray().ToArray();
            LastProductIds = catalog.Select(p => p.GetProperty("productId").GetInt32()).Distinct().ToArray();
            output = new
            {
                selections = Enumerable.Range(0, 3).Select(i =>
                {
                    var p = catalog[i == 1 && catalog.Length > 1 ? 1 : 0];
                    return new { ingredientIndex = i, productId = Mode == "unknown" ? 999999 : p.GetProperty("productId").GetInt32(),
                        variantId = p.GetProperty("variantId").Clone(), quantity = i == 2 ? 1 : 2 };
                }).ToArray(),
                missingIngredientIndexes = Array.Empty<int>()
            };
        }
        else throw new Exception("Expected two deployed agent names");
        var envelope = new { status = "completed", output = new[] { new { type = "message", content = new[] { new { type = "output_text", text = JsonSerializer.Serialize(output) } } } } };
        return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(JsonSerializer.Serialize(envelope), Encoding.UTF8, "application/json") };
    }
}
