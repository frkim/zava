using System.Text.Json;
using System.Text.Json.Serialization;
using Zava.Api.Models;
using Zava.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<DataStore>();
builder.Services.AddScoped<SearchService>();
builder.Services.AddScoped<AnalyticsService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
            ?? ["http://localhost:5173", "http://localhost:5174"];
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var app = builder.Build();

// Initialize DataStore
var dataStore = app.Services.GetRequiredService<DataStore>();
dataStore.Initialize(SiteType.Electronics);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseStaticFiles(); // Serves wwwroot/ (images, etc.)

// ─── Config ──────────────────────────────────────────────────────────────────

app.MapGet("/api/config", (DataStore store) => Results.Ok(store.GetSiteConfig()));

app.MapPut("/api/config/site-type", (SiteSettings settings, DataStore store) =>
{
    store.ChangeSiteType(settings.SiteType);
    return Results.Ok(store.GetSiteConfig());
});

app.MapPost("/api/config/reset", (DataStore store) =>
{
    store.Reset();
    return Results.Ok(new { message = "Données réinitialisées" });
});

// ─── Homepage ────────────────────────────────────────────────────────────────

app.MapGet("/api/homepage", (DataStore store) =>
{
    var products = store.Products;
    var categories = store.Categories;

    var homepage = new HomepageData
    {
        FeaturedProducts = products.Where(p => p.IsFeatured).Take(8).ToList(),
        BestSellers = products.Where(p => p.IsBestSeller).Take(8).ToList(),
        NewProducts = products.Where(p => p.IsNew).Take(8).ToList(),
        PromoProducts = products.Where(p => p.IsPromo).Take(8).ToList(),
        SelectionProducts = products.OrderByDescending(p => p.Rating).Take(8).ToList(),
        TopCategories = categories.OrderByDescending(c => c.ProductCount).Take(6).ToList(),
        Brands = products.Select(p => p.Brand).Distinct().OrderBy(b => b).ToList()
    };
    return Results.Ok(homepage);
});

// ─── Products ────────────────────────────────────────────────────────────────

app.MapGet("/api/products", (DataStore store) => Results.Ok(store.Products));

app.MapGet("/api/products/{id:int}", (int id, DataStore store, IWebHostEnvironment env) =>
{
    var product = store.Products.FirstOrDefault(p => p.Id == id);
    if (product is null) return Results.NotFound();

    var reviews = store.Reviews.Where(r => r.ProductId == id).ToList();
    var related = store.Products
        .Where(p => product.RelatedProductIds.Contains(p.Id))
        .ToList();
    var category = store.Categories.FirstOrDefault(c => c.Id == product.CategoryId);

    // Discover product images from filesystem
    var images = new List<object>();
    var imgDir = Path.Combine(env.WebRootPath ?? "", "images", "products", store.CurrentSiteType.ToString(), id.ToString());
    if (Directory.Exists(imgDir))
    {
        var mainFiles = Directory.GetFiles(imgDir, "*_main.jpg").OrderBy(f => f).ToArray();
        foreach (var f in mainFiles)
        {
            var fileName = Path.GetFileName(f);
            var idx = fileName.Split('_')[0];
            var basePath = $"/images/products/{store.CurrentSiteType}/{id}";
            images.Add(new { index = int.Parse(idx), main = $"{basePath}/{idx}_main.jpg", medium = $"{basePath}/{idx}_medium.jpg", thumb = $"{basePath}/{idx}_thumb.jpg" });
        }
    }

    return Results.Ok(new { product, reviews, relatedProducts = related, category, images });
});

app.MapPost("/api/products", (CreateProductRequest req, DataStore store) =>
{
    var maxId = store.Products.Count > 0 ? store.Products.Max(p => p.Id) : 0;
    var product = new Product
    {
        Id = maxId + 1,
        Name = req.Name,
        NameEn = req.Name,
        Description = req.Description,
        DescriptionEn = req.Description,
        Price = req.Price,
        CategoryId = req.CategoryId,
        Brand = req.Brand,
        Sku = $"CUSTOM-{maxId + 1:D4}",
        Stock = req.Stock,
        Rating = 0,
        ReviewCount = 0,
        IsNew = true,
        SiteType = store.CurrentSiteType,
        CreatedAt = DateTime.Now
    };
    store.Products.Add(product);

    // Update category product count
    var cat = store.Categories.FirstOrDefault(c => c.Id == req.CategoryId);
    if (cat is not null) cat.ProductCount++;

    return Results.Created($"/api/products/{product.Id}", product);
});

// ─── Categories ──────────────────────────────────────────────────────────────

app.MapGet("/api/categories", (DataStore store) => Results.Ok(store.Categories));

app.MapGet("/api/categories/{id:int}", (int id, DataStore store) =>
{
    var category = store.Categories.FirstOrDefault(c => c.Id == id);
    if (category is null) return Results.NotFound();

    var products = store.Products.Where(p => p.CategoryId == id).ToList();
    return Results.Ok(new { category, products });
});

// ─── Search ──────────────────────────────────────────────────────────────────

app.MapPost("/api/search", (SearchRequest request, SearchService searchService) =>
    Results.Ok(searchService.Search(request)));

app.MapGet("/api/search/suggestions", (string q, SearchService searchService) =>
    Results.Ok(searchService.GetSuggestions(q)));

// ─── Cart ────────────────────────────────────────────────────────────────────

app.MapGet("/api/cart", (DataStore store) => Results.Ok(store.Cart));

app.MapPost("/api/cart/items", (AddToCartRequest req, DataStore store) =>
{
    var product = store.Products.FirstOrDefault(p => p.Id == req.ProductId);
    if (product is null) return Results.NotFound(new { message = "Produit introuvable" });

    decimal unitPrice = product.PromoPrice ?? product.Price;
    string? variantName = null;

    if (req.VariantId.HasValue)
    {
        var variant = product.Variants.FirstOrDefault(v => v.Id == req.VariantId.Value);
        if (variant is not null)
        {
            unitPrice += variant.PriceAdjustment;
            variantName = variant.Name;
        }
    }

    var existingItem = store.Cart.Items.FirstOrDefault(i =>
        i.ProductId == req.ProductId && i.VariantId == req.VariantId);

    if (existingItem is not null)
    {
        existingItem.Quantity += req.Quantity;
    }
    else
    {
        store.Cart.Items.Add(new CartItem
        {
            ProductId = product.Id,
            ProductName = product.Name,
            VariantId = req.VariantId,
            VariantName = variantName,
            UnitPrice = unitPrice,
            Quantity = req.Quantity
        });
    }

    return Results.Ok(store.Cart);
});

app.MapPut("/api/cart/items/{productId:int}", (int productId, UpdateCartItemRequest req, DataStore store) =>
{
    var item = store.Cart.Items.FirstOrDefault(i => i.ProductId == productId);
    if (item is null) return Results.NotFound();

    if (req.Quantity <= 0)
    {
        store.Cart.Items.Remove(item);
    }
    else
    {
        item.Quantity = req.Quantity;
    }

    return Results.Ok(store.Cart);
});

app.MapDelete("/api/cart/items/{productId:int}", (int productId, DataStore store) =>
{
    var item = store.Cart.Items.FirstOrDefault(i => i.ProductId == productId);
    if (item is not null) store.Cart.Items.Remove(item);
    return Results.Ok(store.Cart);
});

app.MapDelete("/api/cart", (DataStore store) =>
{
    store.Cart.Items.Clear();
    return Results.Ok(store.Cart);
});

// ─── Checkout ────────────────────────────────────────────────────────────────

app.MapPost("/api/checkout", (CheckoutRequest req, DataStore store) =>
{
    if (store.Cart.Items.Count == 0)
        return Results.BadRequest(new PaymentResult
        {
            Success = false,
            Status = PaymentStatus.Failed,
            Message = "Le panier est vide"
        });

    // Payment simulation
    bool paymentSuccess;
    string message;

    if (req.CardNumber is not null && req.CardNumber.EndsWith("0000"))
    {
        paymentSuccess = false;
        message = "Paiement refusé : carte invalide";
    }
    else if (Random.Shared.NextDouble() < 0.10)
    {
        paymentSuccess = false;
        message = "Paiement refusé : erreur de traitement bancaire";
    }
    else
    {
        paymentSuccess = true;
        message = "Paiement accepté";
    }

    if (!paymentSuccess)
    {
        return Results.Ok(new PaymentResult
        {
            Success = false,
            Status = PaymentStatus.Failed,
            Message = message
        });
    }

    var maxOrderId = store.Orders.Count > 0 ? store.Orders.Max(o => o.Id) : 0;
    var order = new Order
    {
        Id = maxOrderId + 1,
        UserId = store.Users.FirstOrDefault()?.Id ?? 1,
        Items = store.Cart.Items.Select(i => new CartItem
        {
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            VariantId = i.VariantId,
            VariantName = i.VariantName,
            UnitPrice = i.UnitPrice,
            Quantity = i.Quantity
        }).ToList(),
        Total = store.Cart.Total,
        Status = OrderStatus.Pending,
        ShippingAddress = req.ShippingAddress,
        PaymentMethod = req.PaymentMethod,
        CreatedAt = DateTime.Now,
        TrackingNumber = $"ZV{DateTime.Now:yyyyMMdd}{maxOrderId + 1:D5}"
    };

    store.Orders.Add(order);
    store.Cart.Items.Clear();

    return Results.Ok(new PaymentResult
    {
        Success = true,
        Status = PaymentStatus.Success,
        Message = message,
        OrderId = order.Id,
        TransactionId = $"TXN-{Guid.NewGuid().ToString()[..8].ToUpperInvariant()}"
    });
});

// ─── Orders ──────────────────────────────────────────────────────────────────

app.MapGet("/api/orders", (DataStore store) => Results.Ok(store.Orders.OrderByDescending(o => o.CreatedAt)));

app.MapGet("/api/orders/{id:int}", (int id, DataStore store) =>
{
    var order = store.Orders.FirstOrDefault(o => o.Id == id);
    return order is not null ? Results.Ok(order) : Results.NotFound();
});

// ─── User ────────────────────────────────────────────────────────────────────

app.MapGet("/api/user", (DataStore store) =>
{
    var user = store.Users.FirstOrDefault();
    return user is not null ? Results.Ok(user) : Results.NotFound();
});

app.MapPut("/api/user", (User updatedUser, DataStore store) =>
{
    var user = store.Users.FirstOrDefault();
    if (user is null) return Results.NotFound();

    user.FirstName = updatedUser.FirstName;
    user.LastName = updatedUser.LastName;
    user.Email = updatedUser.Email;
    user.Phone = updatedUser.Phone;
    user.ShippingAddress = updatedUser.ShippingAddress;
    user.BillingAddress = updatedUser.BillingAddress;
    user.PaymentInfo = updatedUser.PaymentInfo;
    user.IsPremium = updatedUser.IsPremium;

    return Results.Ok(user);
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

app.MapGet("/api/products/{productId:int}/reviews", (int productId, DataStore store) =>
{
    var reviews = store.Reviews
        .Where(r => r.ProductId == productId)
        .OrderByDescending(r => r.CreatedAt)
        .ToList();
    return Results.Ok(reviews);
});

// ─── Analytics ───────────────────────────────────────────────────────────────

app.MapGet("/api/analytics", (AnalyticsService analyticsService) =>
    Results.Ok(analyticsService.GetDashboard()));

// ─── SPA fallback for production ─────────────────────────────────────────────

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
