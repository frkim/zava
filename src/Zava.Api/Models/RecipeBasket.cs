using System.Text.Json.Serialization;

namespace Zava.Api.Models;

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record RecipeBasketRequest(string Recipe, int Servings, string BrandPreference);

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
public sealed record CommitRecipeBasketRequest(string PlanId);

public sealed record RecipeBasketItem(
    int ProductId, string ProductName, int? VariantId, string? VariantName,
    int Quantity, decimal UnitPrice, decimal Subtotal, string Ingredient);

public sealed record RecipeBasketPlan(
    string PlanId, string Recipe, int Servings, string BrandPreference,
    IReadOnlyList<RecipeBasketItem> Items, IReadOnlyList<string> MissingIngredients,
    IReadOnlyList<string> Warnings, decimal Total, DateTimeOffset ExpiresAt);
