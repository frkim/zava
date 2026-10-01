using System.ComponentModel;
using System.Text.Json;
using Microsoft.Extensions.Options;
using ModelContextProtocol.Protocol;
using ModelContextProtocol.Server;
using Zava.Api.Models;

namespace Zava.Api.Services;

/// <summary>
/// MCP tools exposing the demo store (catalogue, basket, orders) to AI agents at <c>/mcp</c>.
/// Results use the same JSON shape as the REST API and are serialized while holding
/// <see cref="DataStore.Gate"/>, because <c>/mcp</c> is outside the <c>/api</c> gate middleware.
/// </summary>
[McpServerToolType]
public sealed class ZavaMcpTools(DataStore store, SearchService searchService, IOptions<Microsoft.AspNetCore.Http.Json.JsonOptions> jsonOptions)
{
    private const int MaxPageSize = 50;

    [McpServerTool(Name = "get_store_info", Title = "Get store info", ReadOnly = true, OpenWorld = false)]
    [Description("Returns the active store type (Electronics, Grocery, ...), its description and catalogue size.")]
    public Task<CallToolResult> GetStoreInfo(CancellationToken cancellationToken) => Read(() =>
    {
        var config = store.GetSiteConfig();
        return new
        {
            config.CurrentSiteType,
            Store = config.AvailableSiteTypes.FirstOrDefault(s => s.Type == config.CurrentSiteType),
            ProductCount = store.Products.Count,
            CategoryCount = store.Categories.Count
        };
    }, cancellationToken);

    [McpServerTool(Name = "list_categories", Title = "List categories", ReadOnly = true, OpenWorld = false)]
    [Description("Lists the product categories of the active store with their id and product count.")]
    public Task<CallToolResult> ListCategories(CancellationToken cancellationToken) =>
        Read(() => store.Categories, cancellationToken);

    [McpServerTool(Name = "search_products", Title = "Search products", ReadOnly = true, OpenWorld = false)]
    [Description("Searches the catalogue with full-text and filters. Returns a page of product summaries; use get_product for details and variants.")]
    public Task<CallToolResult> SearchProducts(
        [Description("Free-text query matched against name, description, brand and tags.")] string? query = null,
        [Description("Restrict to a category id (see list_categories).")] int? categoryId = null,
        [Description("Exact brand name.")] string? brand = null,
        [Description("Minimum effective price in euros.")] decimal? minPrice = null,
        [Description("Maximum effective price in euros.")] decimal? maxPrice = null,
        [Description("Only return products currently in stock.")] bool inStockOnly = false,
        [Description("Sort order: relevance (default), price, rating, bestseller, name or newest.")] string? sortBy = null,
        [Description("Sort descending (price and name only).")] bool sortDescending = false,
        [Description("1-based page number.")] int page = 1,
        [Description("Results per page (1-50).")] int pageSize = 10,
        CancellationToken cancellationToken = default) => Read(() =>
    {
        var result = searchService.Search(new SearchRequest
        {
            Query = query,
            CategoryId = categoryId,
            Brand = brand,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            InStock = inStockOnly ? true : null,
            SortBy = sortBy,
            SortDescending = sortDescending,
            Page = page,
            PageSize = Math.Clamp(pageSize, 1, MaxPageSize)
        });
        return new
        {
            result.TotalCount,
            result.Page,
            result.PageSize,
            result.TotalPages,
            Products = result.Products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Brand,
                p.CategoryId,
                p.Price,
                p.PromoPrice,
                p.Stock,
                p.Rating,
                p.ReviewCount,
                HasVariants = p.Variants.Count > 0
            })
        };
    }, cancellationToken);

    [McpServerTool(Name = "get_product", Title = "Get product details", ReadOnly = true, OpenWorld = false)]
    [Description("Returns full product details (price, stock, variants, related product ids), its category and its most recent reviews.")]
    public Task<CallToolResult> GetProduct(
        [Description("Product id.")] int productId,
        CancellationToken cancellationToken) => Read(() =>
    {
        var product = store.Products.FirstOrDefault(p => p.Id == productId);
        if (product is null) return new Refusal("Produit introuvable");
        return new
        {
            Product = product,
            Category = store.Categories.FirstOrDefault(c => c.Id == product.CategoryId),
            RecentReviews = store.Reviews
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .Take(5)
        };
    }, cancellationToken);

    [McpServerTool(Name = "get_cart", Title = "Get basket", ReadOnly = true, OpenWorld = false)]
    [Description("Returns the current shopping basket: lines, quantities, unit prices, total and item count.")]
    public Task<CallToolResult> GetCart(CancellationToken cancellationToken) =>
        Read(() => store.Cart, cancellationToken);

    [McpServerTool(Name = "add_to_cart", Title = "Add to basket", Destructive = false, OpenWorld = false)]
    [Description("Adds a product (optionally a specific variant) to the basket, enforcing product and variant stock. Returns the updated basket.")]
    public Task<CallToolResult> AddToCart(
        [Description("Product id.")] int productId,
        [Description("Quantity to add (positive).")] int quantity = 1,
        [Description("Variant id, when the product has variants (see get_product).")] int? variantId = null,
        CancellationToken cancellationToken = default) => Mutate(() =>
        CartOperations.AddItem(store, new AddToCartRequest { ProductId = productId, VariantId = variantId, Quantity = quantity }),
        cancellationToken);

    [McpServerTool(Name = "update_cart_item", Title = "Update basket line", Idempotent = true, OpenWorld = false)]
    [Description("Sets the quantity of a basket line identified by (productId, variantId, offerTriggerProductId). A quantity of 0 removes the line. Returns the updated basket.")]
    public Task<CallToolResult> UpdateCartItem(
        [Description("Product id of the basket line (negative for a warranty line).")] int productId,
        [Description("New quantity (0 removes the line).")] int quantity,
        [Description("Variant id of the line; omit for the line without variant.")] int? variantId = null,
        [Description("Trigger product id for a discounted cross-sell line; omit for regular lines.")] int? offerTriggerProductId = null,
        CancellationToken cancellationToken = default) => Mutate(() =>
        CartOperations.UpdateItem(store, productId, new UpdateCartItemRequest
        {
            Quantity = quantity,
            VariantId = variantId,
            OfferTriggerProductId = offerTriggerProductId
        }), cancellationToken);

    [McpServerTool(Name = "remove_from_cart", Title = "Remove basket line", Idempotent = true, OpenWorld = false)]
    [Description("Removes the basket line identified by (productId, variantId, offerTriggerProductId); other variants are kept. Returns the updated basket.")]
    public Task<CallToolResult> RemoveFromCart(
        [Description("Product id of the basket line (negative for a warranty line).")] int productId,
        [Description("Variant id of the line; omit for the line without variant.")] int? variantId = null,
        [Description("Trigger product id for a discounted cross-sell line; omit for regular lines.")] int? offerTriggerProductId = null,
        CancellationToken cancellationToken = default) => Mutate(() =>
    {
        CartOperations.RemoveItem(store, productId, variantId, offerTriggerProductId);
        return CartOperationResult.Ok;
    }, cancellationToken);

    [McpServerTool(Name = "clear_cart", Title = "Empty basket", Idempotent = true, OpenWorld = false)]
    [Description("Removes every line from the basket. Returns the empty basket.")]
    public Task<CallToolResult> ClearCart(CancellationToken cancellationToken) => Mutate(() =>
    {
        store.Cart.Items.Clear();
        return CartOperationResult.Ok;
    }, cancellationToken);

    [McpServerTool(Name = "list_orders", Title = "List orders", ReadOnly = true, OpenWorld = false)]
    [Description("Lists orders, most recent first, as summaries (id, date, status, total, item count, tracking number). Use get_order for details.")]
    public Task<CallToolResult> ListOrders(
        [Description("Maximum number of orders to return (1-50).")] int limit = 20,
        CancellationToken cancellationToken = default) => Read(() => store.Orders
        .OrderByDescending(o => o.CreatedAt)
        .Take(Math.Clamp(limit, 1, MaxPageSize))
        .Select(o => new
        {
            o.Id,
            o.CreatedAt,
            o.Status,
            o.Total,
            ItemCount = o.Items.Sum(i => i.Quantity),
            o.TrackingNumber
        }), cancellationToken);

    [McpServerTool(Name = "get_order", Title = "Get order details", ReadOnly = true, OpenWorld = false)]
    [Description("Returns an order with its lines, total, status, shipping address, payment method and tracking number.")]
    public Task<CallToolResult> GetOrder(
        [Description("Order id.")] int orderId,
        CancellationToken cancellationToken) => Read(() =>
        (object?)store.Orders.FirstOrDefault(o => o.Id == orderId) ?? new Refusal("Commande introuvable"),
        cancellationToken);

    private Task<CallToolResult> Mutate(Func<CartOperationResult> operation, CancellationToken cancellationToken) => Read(() =>
    {
        var result = operation();
        return result.Status == CartOperationStatus.Ok
            ? store.Cart
            : new Refusal(result.Message ?? "Ligne de panier introuvable");
    }, cancellationToken);

    // Expected refusals (unknown id, stock, ...) become tool errors the agent can read, without logging an exception.
    private async Task<CallToolResult> Read(Func<object> read, CancellationToken cancellationToken)
    {
        await store.Gate.WaitAsync(cancellationToken);
        try
        {
            var value = read();
            return value is Refusal refusal
                ? new CallToolResult { IsError = true, Content = [new TextContentBlock { Text = refusal.Message }] }
                : new CallToolResult { Content = [new TextContentBlock { Text = JsonSerializer.Serialize(value, jsonOptions.Value.SerializerOptions) }] };
        }
        finally { store.Gate.Release(); }
    }

    private sealed record Refusal(string Message);
}
