namespace Zava.Api.Services;

using Zava.Api.Models;

public static class GrocerySeeder
{
    // Demo staples in three explicit ranges; quantities always refer to whole packs.
    private static readonly (string Name, string NameEn, string Pack, int CategoryId, string Brand, decimal Price)[] RecipeStaples =
    [
        ("Feuilles de lasagnes", "Lasagne sheets", "500g", 6, "Barilla", 2.89m),
        ("Bœuf haché", "Minced beef", "500g", 4, "Charal", 7.90m),
        ("Sauté de veau", "Diced veal", "500g", 4, "Tendriade", 9.90m),
        ("Bœuf à bourguignon", "Stewing beef", "500g", 4, "Charal", 8.50m),
        ("Lardons fumés", "Smoked bacon pieces", "200g", 4, "Herta", 2.49m),
        ("Lait demi-écrémé", "Semi-skimmed milk", "1L", 2, "Lactel", 1.49m),
        ("Beurre doux", "Unsalted butter", "250g", 2, "Président", 2.79m),
        ("Crème fraîche", "Crème fraîche", "200ml", 2, "Elle & Vire", 1.89m),
        ("Emmental râpé", "Grated Emmental", "200g", 2, "Entremont", 2.39m),
        ("Œufs", "Eggs", "6 pièces / 6 eggs", 2, "Matines", 2.69m),
        ("Farine de blé", "Wheat flour", "1kg", 7, "Francine", 1.89m),
        ("Purée de tomates", "Tomato passata", "700ml", 6, "Mutti", 2.49m),
        ("Oignons émincés surgelés", "Frozen chopped onions", "1kg", 9, "Bonduelle", 3.49m),
        ("Carottes en rondelles surgelées", "Frozen sliced carrots", "1kg", 9, "Bonduelle", 2.99m),
        ("Pommes de terre vapeur", "Steamed potatoes", "500g", 1, "Lunor", 2.49m),
        ("Champignons de Paris émincés", "Sliced button mushrooms", "400g", 6, "Bonduelle", 2.19m),
        ("Ail semoule", "Granulated garlic", "60g", 6, "Ducros", 2.29m),
        ("Bouquet garni thym et laurier", "Thyme and bay bouquet garni", "5 sachets", 6, "Ducros", 2.49m),
        ("Persil", "Parsley", "15g", 6, "Ducros", 1.99m),
        ("Bouillon de légumes", "Vegetable stock", "12 cubes", 6, "Knorr", 2.19m),
        ("Vin rouge de cuisson", "Red cooking wine", "750ml", 8, "La Villageoise", 3.49m),
        ("Vin blanc de cuisson", "White cooking wine", "750ml", 8, "La Villageoise", 3.49m),
        ("Sel fin", "Fine salt", "500g", 6, "La Baleine", 1.29m),
        ("Poivre noir moulu", "Ground black pepper", "50g", 6, "Ducros", 2.49m),
        ("Noix de muscade moulue", "Ground nutmeg", "30g", 6, "Ducros", 2.69m),
        ("Clous de girofle", "Cloves", "25g", 6, "Ducros", 2.29m),
        ("Huile d'olive", "Olive oil", "750ml", 6, "Puget", 7.49m),
        ("Jus de citron", "Lemon juice", "200ml", 6, "Sicilia", 1.49m),
        ("Riz long", "Long grain rice", "1kg", 6, "Taureau Ailé", 2.99m)
    ];

    public static List<Category> GenerateCategories()
    {
        var categories = new List<Category>
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
        foreach (var category in categories)
            category.ProductCount += RecipeStaples.Count(s => s.CategoryId == category.Id) * 3;
        return categories;
    }

    public static List<Product> GenerateProducts()
    {
        var products = DataSeeder.LoadProductsFromJson("grocery-products.json", SiteType.Grocery);
        var nextId = products.Max(p => p.Id) + 1;
        foreach (var staple in RecipeStaples)
        {
            foreach (var tier in new[] { "national", "private-label", "economy" })
            {
                var brand = tier switch
                {
                    "private-label" => "Zava",
                    "economy" => "Zava Essentiel",
                    _ => staple.Brand
                };
                var factor = tier switch { "private-label" => 0.8m, "economy" => 0.6m, _ => 1m };
                var id = nextId++;
                products.Add(new Product
                {
                    Id = id,
                    Name = $"{staple.Name} {staple.Pack} — {brand}",
                    NameEn = $"{staple.NameEn} {staple.Pack} — {brand}",
                    Description = $"Produit de démonstration pour cuisiner. Conditionnement : {staple.Pack}.",
                    DescriptionEn = $"Demo cooking ingredient. Pack size: {staple.Pack}.",
                    Price = Math.Round(staple.Price * factor, 2),
                    CategoryId = staple.CategoryId,
                    Brand = brand,
                    Sku = $"GROCERY-RECIPE-{id}",
                    Stock = 100,
                    SiteType = SiteType.Grocery,
                    CreatedAt = new DateTime(2026, 1, 1),
                    Tags = [brand, $"brand:{tier}", "recette"],
                    Variants = [new ProductVariant
                    {
                        Id = id,
                        Name = staple.Pack,
                        NameEn = staple.Pack,
                        Value = staple.Pack,
                        Stock = 100
                    }]
                });
            }
        }
        return products;
    }
}
