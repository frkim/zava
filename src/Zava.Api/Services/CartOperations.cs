namespace Zava.Api.Services;

using Zava.Api.Models;

public enum CartOperationStatus { Ok, BadRequest, NotFound }

/// <summary>Outcome of a cart mutation; <see cref="Message"/> explains every refusal except an unknown PUT line.</summary>
public readonly record struct CartOperationResult(CartOperationStatus Status, string? Message = null)
{
    public static CartOperationResult Ok => new(CartOperationStatus.Ok);
    public static CartOperationResult BadRequest(string message) => new(CartOperationStatus.BadRequest, message);
    public static CartOperationResult NotFound(string? message = null) => new(CartOperationStatus.NotFound, message);
}

/// <summary>
/// Cart rules shared by the HTTP API and the MCP server. Callers must hold <see cref="DataStore.Gate"/>.
/// </summary>
public static class CartOperations
{
    public static CartOperationResult AddItem(DataStore store, AddToCartRequest req)
    {
        if (req.Quantity <= 0)
            return CartOperationResult.BadRequest("La quantité doit être positive");

        var product = store.Products.FirstOrDefault(p => p.Id == req.ProductId);
        if (product is null) return CartOperationResult.NotFound("Produit introuvable");

        decimal unitPrice = product.PromoPrice ?? product.Price;
        string? variantName = null;

        if (req.VariantId.HasValue)
        {
            var variant = product.Variants.FirstOrDefault(v => v.Id == req.VariantId.Value);
            if (variant is null)
                return CartOperationResult.BadRequest("Variante introuvable");
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
            return CartOperationResult.BadRequest("Stock insuffisant");

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

        return CartOperationResult.Ok;
    }

    public static CartOperationResult UpdateItem(DataStore store, int productId, UpdateCartItemRequest req)
    {
        if (req.Quantity < 0)
            return CartOperationResult.BadRequest("La quantité ne peut pas être négative");

        var item = store.Cart.Items.FirstOrDefault(i =>
            i.ProductId == productId
            && i.VariantId == req.VariantId
            && i.OfferTriggerProductId == req.OfferTriggerProductId);
        if (item is null) return CartOperationResult.NotFound();

        if (req.Quantity == 0)
        {
            RemoveCartLine(store, item);
        }
        else
        {
            if (productId < 0 && req.Quantity != 1)
                return CartOperationResult.BadRequest("Une seule garantie par produit");

            if (item.OfferTriggerProductId is int offerTriggerId && req.Quantity > FullPriceQuantity(store.Cart, offerTriggerId))
                return CartOperationResult.BadRequest("L'offre est limitée à une unité par produit déclencheur acheté au prix normal");

            if (productId > 0)
            {
                var product = store.Products.FirstOrDefault(p => p.Id == productId);
                if (product is null || !HasAvailableStock(store.Cart, product, req.VariantId, req.Quantity, item))
                    return CartOperationResult.BadRequest("Stock insuffisant");
            }
            item.Quantity = req.Quantity;
            if (productId > 0 && item.OfferTriggerProductId is null && item.DiscountPercent is null)
            {
                var offerQuantity = store.Cart.Items.Where(i => i.OfferTriggerProductId == productId).Sum(i => i.Quantity);
                if (offerQuantity > FullPriceQuantity(store.Cart, productId))
                    RevertCrossSellLinesForTrigger(store, productId);
            }
        }

        return CartOperationResult.Ok;
    }

    public static void RemoveItem(DataStore store, int productId, int? variantId, int? offerTriggerProductId)
    {
        var item = store.Cart.Items.FirstOrDefault(i =>
            i.ProductId == productId
            && i.VariantId == variantId
            && i.OfferTriggerProductId == offerTriggerProductId);
        if (item is not null) RemoveCartLine(store, item);
    }

    public static bool HasAvailableStock(Cart cart, Product product, int? variantId, long quantity, CartItem? currentItem = null)
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

    public static void RemoveCartLine(DataStore store, CartItem item)
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

    public static int FullPriceQuantity(Cart cart, int productId) => cart.Items
        .Where(i => i.ProductId == productId && i.OfferTriggerProductId is null && i.DiscountPercent is null)
        .Sum(i => i.Quantity);

    public static void RevertCrossSellLinesForTrigger(DataStore store, int triggerProductId)
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
}
