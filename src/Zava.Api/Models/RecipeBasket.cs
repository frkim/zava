using System.Text.Json.Serialization;

namespace Zava.Api.Models;

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record RecipeBasketRequest(
    string Recipe, int Servings, string BrandPreference,
    // Products the customer asked never to be suggested again, for this session or permanently.
    IReadOnlyList<int>? ExcludedProductIds = null);

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record RecipeBasketItemKey(int ProductId, int? VariantId = null);

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CommitRecipeBasketRequest(
    string PlanId,
    // Previewed products the customer moved out of the selection before confirming.
    IReadOnlyList<RecipeBasketItemKey>? ExcludedItems = null);

public sealed record RecipeBasketItem(
    int ProductId, string ProductName, int? VariantId, string? VariantName,
    int Quantity, decimal UnitPrice, decimal Subtotal, string Ingredient);

public sealed record RecipeBasketPlan(
    string PlanId, string Recipe, int Servings, string BrandPreference,
    IReadOnlyList<RecipeBasketItem> Items, IReadOnlyList<string> MissingIngredients,
    IReadOnlyList<string> Warnings, decimal Total, DateTimeOffset ExpiresAt);
