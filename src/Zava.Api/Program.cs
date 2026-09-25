using System.Text.Json;
using System.Text.Json.Serialization;
using Azure.Core;
using Azure.Identity;
using Microsoft.AspNetCore.Http.Features;
using Zava.Api.Models;
using Zava.Api.Services;

const int RecipeRequestLimit = 4096;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<DataStore>();
builder.Services.AddScoped<SearchService>();
builder.Services.AddScoped<AnalyticsService>();
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddSingleton<TokenCredential>(_ => new DefaultAzureCredential());
builder.Services.AddHttpClient<FoundryRecipeClient>(client => client.Timeout = Timeout.InfiniteTimeSpan)
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { AllowAutoRedirect = false });
builder.Services.AddSingleton<RecipeBasketService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
            ?? ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"];
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

app.Use(async (context, next) =>
{
    var recipeBasket = context.Request.Path.StartsWithSegments("/api/recipe-basket");
    if (recipeBasket)
    {
        var bodySize = context.Features.Get<IHttpMaxRequestBodySizeFeature>();
        if (bodySize is { IsReadOnly: false }) bodySize.MaxRequestBodySize = RecipeRequestLimit;
    }
    // Serialize shared demo state through response serialization, but never hold the gate during AI calls.
    if (context.Request.Path.StartsWithSegments("/api")
        && !string.Equals(context.Request.Path.Value?.TrimEnd('/'), "/api/recipe-basket/plan", StringComparison.OrdinalIgnoreCase))
    {
        await dataStore.Gate.WaitAsync(context.RequestAborted);
        try { await next(context); }
        finally { dataStore.Gate.Release(); }
    }
    else await next(context);
    // The size limit is enforced while reading the body, and that rejection carries no body of
    // its own; every other recipe-basket error explains itself, so this one should too.
    if (recipeBasket && context.Response.StatusCode == StatusCodes.Status413PayloadTooLarge
        && !context.Response.HasStarted)
    {
        context.Response.Clear();
        context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
        var body = JsonSerializer.SerializeToUtf8Bytes(
            new { message = "La demande est trop volumineuse (4 Ko maximum)." });
        context.Response.ContentType = "application/json; charset=utf-8";
        context.Response.ContentLength = body.Length;
        await context.Response.Body.WriteAsync(body);
    }
});

app.MapRecipeBasket();

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
        SecondLifeProducts = store.CurrentSiteType is SiteType.Cosmetics or SiteType.Grocery
            ? []
            : products.Where(p => p.IsSecondLife).Take(8).ToList(),
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

// ─── Cross-sell ──────────────────────────────────────────────────────────────

app.MapGet("/api/products/{id:int}/cross-sell", (int id, DataStore store) =>
{
    // Only for Electronics and Appliances
    if (store.CurrentSiteType is not (SiteType.Electronics or SiteType.Appliances))
        return Results.Ok(new CrossSellOffer());

    var product = store.Products.FirstOrDefault(p => p.Id == id);
    if (product is null) return Results.NotFound();

    return Results.Ok(BuildCrossSellOffer(product, store));
});

app.MapPost("/api/cart/cross-sell", (AddCrossSellToCartRequest req, DataStore store) =>
{
    if (store.CurrentSiteType is not (SiteType.Electronics or SiteType.Appliances))
        return Results.BadRequest(new { message = "Offre complémentaire indisponible pour cette boutique" });

    var trigger = store.Products.FirstOrDefault(p => p.Id == req.TriggerProductId);
    if (trigger is null) return Results.NotFound(new { message = "Produit déclencheur introuvable" });

    var triggerQuantity = FullPriceQuantity(store.Cart, trigger.Id);
    if (triggerQuantity == 0)
        return Results.BadRequest(new { message = "Ajoutez le produit déclencheur au panier avant son offre complémentaire" });

    var offer = BuildCrossSellOffer(trigger, store);
    var complementary = offer.ComplementaryProduct;
    if (complementary is null)
        return Results.BadRequest(new { message = "Aucune offre complémentaire disponible" });

    var product = complementary.Product;
    var existingItem = store.Cart.Items.FirstOrDefault(i =>
        i.ProductId == product.Id
        && i.VariantId is null
        && i.OfferTriggerProductId == trigger.Id);
    var quantity = (long)(existingItem?.Quantity ?? 0) + 1;
    if (quantity > triggerQuantity)
        return Results.BadRequest(new { message = "L'offre est limitée à une unité par produit déclencheur acheté au prix normal" });
    if (!HasAvailableStock(store.Cart, product, null, quantity, existingItem))
        return Results.BadRequest(new { message = "Stock insuffisant" });

    if (existingItem is not null)
    {
        existingItem.Quantity++;
        existingItem.UnitPrice = complementary.DiscountedPrice;
        existingItem.RegularUnitPrice = product.PromoPrice ?? product.Price;
        existingItem.DiscountPercent = complementary.DiscountPercent;
    }
    else
    {
        store.Cart.Items.Add(new CartItem
        {
            ProductId = product.Id,
            ProductName = product.Name,
            VariantId = null,
            VariantName = null,
            UnitPrice = complementary.DiscountedPrice,
            RegularUnitPrice = product.PromoPrice ?? product.Price,
            OfferTriggerProductId = trigger.Id,
            DiscountPercent = complementary.DiscountPercent,
            Quantity = 1
        });
    }

    return Results.Ok(store.Cart);
});

app.MapPost("/api/cart/warranty", (AddWarrantyToCartRequest req, DataStore store) =>
{
    var product = store.Products.FirstOrDefault(p => p.Id == req.ProductId);
    if (product is null) return Results.NotFound(new { message = "Produit introuvable" });

    if (store.CurrentSiteType is not (SiteType.Electronics or SiteType.Appliances))
        return Results.BadRequest(new { message = "Garantie indisponible pour cette boutique" });
    if (!store.Cart.Items.Any(i => i.ProductId == product.Id))
        return Results.BadRequest(new { message = "Ajoutez le produit au panier avant sa garantie" });

    var warranty = GetWarrantyOffer(product);

    // Avoid adding duplicate warranty for same product
    var warrantyLabel = $"🛡️ {warranty.Name} — {product.Name}";
    var existing = store.Cart.Items.FirstOrDefault(i =>
        i.ProductId == -product.Id);

    if (existing is null)
    {
        store.Cart.Items.Add(new CartItem
        {
            ProductId = -req.ProductId, // Negative ID = warranty item
            ProductName = warrantyLabel,
            VariantId = null,
            VariantName = null,
            UnitPrice = warranty.Price,
            Quantity = 1
        });
    }

    return Results.Ok(store.Cart);
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
    if (req.Quantity <= 0)
        return Results.BadRequest(new { message = "La quantité doit être positive" });

    var product = store.Products.FirstOrDefault(p => p.Id == req.ProductId);
    if (product is null) return Results.NotFound(new { message = "Produit introuvable" });

    decimal unitPrice = product.PromoPrice ?? product.Price;
    string? variantName = null;

    if (req.VariantId.HasValue)
    {
        var variant = product.Variants.FirstOrDefault(v => v.Id == req.VariantId.Value);
        if (variant is null)
            return Results.BadRequest(new { message = "Variante introuvable" });
        unitPrice += variant.PriceAdjustment;
        variantName = variant.Name;
    }

    var existingItem = store.Cart.Items.FirstOrDefault(i =>
        i.ProductId == req.ProductId
        && i.VariantId == req.VariantId
        && i.OfferTriggerProductId is null
        && i.DiscountPercent is null);

    var quantity = (long)(existingItem?.Quantity ?? 0) + req.Quantity;
    if (!HasAvailableStock(store.Cart, product, req.VariantId, quantity, existingItem))
        return Results.BadRequest(new { message = "Stock insuffisant" });

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
    if (req.Quantity < 0)
        return Results.BadRequest(new { message = "La quantité ne peut pas être négative" });

    var item = store.Cart.Items.FirstOrDefault(i =>
        i.ProductId == productId
        && i.VariantId == req.VariantId
        && i.OfferTriggerProductId == req.OfferTriggerProductId);
    if (item is null) return Results.NotFound();

    if (req.Quantity == 0)
    {
        RemoveCartLine(store, item);
    }
    else
    {
        if (productId < 0 && req.Quantity != 1)
            return Results.BadRequest(new { message = "Une seule garantie par produit" });

        if (item.OfferTriggerProductId is int offerTriggerId && req.Quantity > FullPriceQuantity(store.Cart, offerTriggerId))
            return Results.BadRequest(new { message = "L'offre est limitée à une unité par produit déclencheur acheté au prix normal" });

        if (productId > 0)
        {
            var product = store.Products.FirstOrDefault(p => p.Id == productId);
            if (product is null || !HasAvailableStock(store.Cart, product, req.VariantId, req.Quantity, item))
                return Results.BadRequest(new { message = "Stock insuffisant" });
        }
        item.Quantity = req.Quantity;
        if (productId > 0 && item.OfferTriggerProductId is null && item.DiscountPercent is null)
        {
            var offerQuantity = store.Cart.Items.Where(i => i.OfferTriggerProductId == productId).Sum(i => i.Quantity);
            if (offerQuantity > FullPriceQuantity(store.Cart, productId))
                RevertCrossSellLinesForTrigger(store, productId);
        }
    }

    return Results.Ok(store.Cart);
});

app.MapDelete("/api/cart/items/{productId:int}", (int productId, int? variantId, int? offerTriggerProductId, DataStore store) =>
{
    var item = store.Cart.Items.FirstOrDefault(i =>
        i.ProductId == productId
        && i.VariantId == variantId
        && i.OfferTriggerProductId == offerTriggerProductId);
    if (item is not null) RemoveCartLine(store, item);
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
            RegularUnitPrice = i.RegularUnitPrice,
            OfferTriggerProductId = i.OfferTriggerProductId,
            DiscountPercent = i.DiscountPercent,
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

static bool HasAvailableStock(Cart cart, Product product, int? variantId, long quantity, CartItem? currentItem = null)
{
    var otherProductQuantity = cart.Items
        .Where(i => i.ProductId == product.Id && !ReferenceEquals(i, currentItem))
        .Sum(i => (long)i.Quantity);
    var variant = product.Variants.FirstOrDefault(v => v.Id == variantId);
    if (quantity <= 0 || quantity + otherProductQuantity > product.Stock) return false;
    if (!variantId.HasValue) return true;

    var otherVariantQuantity = cart.Items
        .Where(i => i.ProductId == product.Id && i.VariantId == variantId && !ReferenceEquals(i, currentItem))
        .Sum(i => (long)i.Quantity);
    return variant is not null && quantity + otherVariantQuantity <= variant.Stock;
}

static void RemoveCartLine(DataStore store, CartItem item)
{
    var cart = store.Cart;
    cart.Items.Remove(item);
    if (item.ProductId <= 0) return;
    if (!cart.Items.Any(i => i.ProductId == item.ProductId))
        cart.Items.RemoveAll(i => i.ProductId == -item.ProductId);
    // Offer lines only count as triggers when bought at full price, so offer chains cannot sustain each other.
    if (FullPriceQuantity(cart, item.ProductId) == 0)
        RevertCrossSellLinesForTrigger(store, item.ProductId);
}

static int FullPriceQuantity(Cart cart, int productId) => cart.Items
    .Where(i => i.ProductId == productId && i.OfferTriggerProductId is null && i.DiscountPercent is null)
    .Sum(i => i.Quantity);

static void RevertCrossSellLinesForTrigger(DataStore store, int triggerProductId)
{
    foreach (var offerLine in store.Cart.Items
        .Where(i => i.OfferTriggerProductId == triggerProductId)
        .ToList())
    {
        var product = store.Products.FirstOrDefault(p => p.Id == offerLine.ProductId);
        if (product is null)
        {
            offerLine.OfferTriggerProductId = null;
            offerLine.DiscountPercent = null;
            offerLine.RegularUnitPrice = null;
            continue;
        }

        var regularPrice = product.PromoPrice ?? product.Price;
        if (offerLine.VariantId.HasValue)
        {
            var variant = product.Variants.FirstOrDefault(v => v.Id == offerLine.VariantId.Value);
            if (variant is not null) regularPrice += variant.PriceAdjustment;
        }

        var existingRegular = store.Cart.Items.FirstOrDefault(i =>
            !ReferenceEquals(i, offerLine)
            && i.ProductId == offerLine.ProductId
            && i.VariantId == offerLine.VariantId
            && i.OfferTriggerProductId is null
            && i.DiscountPercent is null);
        if (existingRegular is not null)
        {
            existingRegular.Quantity += offerLine.Quantity;
            store.Cart.Items.Remove(offerLine);
        }
        else
        {
            offerLine.UnitPrice = regularPrice;
            offerLine.OfferTriggerProductId = null;
            offerLine.DiscountPercent = null;
            offerLine.RegularUnitPrice = null;
        }
    }
}

static CrossSellOffer BuildCrossSellOffer(Product product, DataStore store)
{
    var offer = new CrossSellOffer();

    if (product.RelatedProductIds.Count > 0)
    {
        var complementary = store.Products
            .Where(p => product.RelatedProductIds.Contains(p.Id) && p.Stock > 0 && p.Id != product.Id)
            .OrderByDescending(p => p.IsBestSeller)
            .ThenBy(p => p.Price)
            .FirstOrDefault();

        if (complementary is not null)
        {
            const int discountPercent = 10;
            var basePrice = complementary.PromoPrice ?? complementary.Price;
            var discountedPrice = Math.Round(basePrice * (1 - discountPercent / 100m), 2);

            offer.ComplementaryProduct = new CrossSellProduct
            {
                Product = complementary,
                DiscountPercent = discountPercent,
                DiscountedPrice = discountedPrice
            };
        }
    }

    offer.Warranty = GetWarrantyOffer(product);
    return offer;
}

static WarrantyOffer GetWarrantyOffer(Product product)
{
    return new WarrantyOffer
    {
        Name = "Garantie Réparation 3 ans / Casse 1 an",
        NameEn = "3-Year Repair / 1-Year Accidental Damage Warranty",
        Description = $"Protégez votre {product.Name} contre les pannes pendant 3 ans et la casse accidentelle pendant 1 an.",
        DescriptionEn = $"Protect your {product.NameEn} against breakdowns for 3 years and accidental damage for 1 year.",
        Price = (product.PromoPrice ?? product.Price) switch
        {
            < 100m => 9.99m,
            < 300m => 19.99m,
            < 500m => 29.99m,
            < 1000m => 49.99m,
            _ => 79.99m
        }
    };
}
