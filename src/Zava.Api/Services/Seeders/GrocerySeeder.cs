namespace Zava.Api.Services;

using Zava.Api.Models;

public static class GrocerySeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Fruits & Légumes", NameEn = "Fruits & Vegetables", Description = "Fruits frais, légumes de saison et salades", DescriptionEn = "Fresh fruits, seasonal vegetables and salads", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "Apple" },
            new() { Id = 2, Name = "Produits Laitiers", NameEn = "Dairy", Description = "Lait, yaourts, fromages et beurre", DescriptionEn = "Milk, yogurts, cheeses and butter", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "EggAlt" },
            new() { Id = 3, Name = "Boulangerie & Pâtisserie", NameEn = "Bakery & Pastry", Description = "Pains, viennoiseries et pâtisseries", DescriptionEn = "Breads, pastries and cakes", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "BakeryDining" },
            new() { Id = 4, Name = "Viandes & Charcuterie", NameEn = "Meat & Deli", Description = "Bœuf, volaille, porc et charcuterie", DescriptionEn = "Beef, poultry, pork and deli meats", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "LunchDining" },
            new() { Id = 5, Name = "Poissonnerie", NameEn = "Seafood", Description = "Poissons frais, crustacés et sushi", DescriptionEn = "Fresh fish, shellfish and sushi", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "SetMeal" },
            new() { Id = 6, Name = "Épicerie Salée", NameEn = "Savory Grocery", Description = "Pâtes, riz, conserves et sauces", DescriptionEn = "Pasta, rice, canned goods and sauces", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "RiceBowl" },
            new() { Id = 7, Name = "Épicerie Sucrée", NameEn = "Sweet Grocery", Description = "Biscuits, chocolat, céréales et confitures", DescriptionEn = "Cookies, chocolate, cereals and jams", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "Cookie" },
            new() { Id = 8, Name = "Boissons", NameEn = "Beverages", Description = "Eaux, jus, sodas et boissons chaudes", DescriptionEn = "Water, juices, sodas and hot drinks", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "LocalDrink" },
            new() { Id = 9, Name = "Surgelés", NameEn = "Frozen Foods", Description = "Plats cuisinés, glaces et légumes surgelés", DescriptionEn = "Ready meals, ice cream and frozen vegetables", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "AcUnit" },
            new() { Id = 10, Name = "Bio & Bien-être", NameEn = "Organic & Wellness", Description = "Produits bio, sans gluten et compléments alimentaires", DescriptionEn = "Organic, gluten-free products and food supplements", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "Eco" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        return DataSeeder.LoadProductsFromJson("grocery-products.json", SiteType.Grocery);
    }
}
