namespace Zava.Api.Services;

using Zava.Api.Models;

public static class GrocerySeeder
{
    private const int SmallApplianceCategoryId = 11;

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
        ("Riz long", "Long grain rice", "1kg", 6, "Taureau Ailé", 2.99m),
        // Carbonade
        ("Bière brune de dégustation", "Brown ale", "33cl", 8, "Ch'ti", 1.79m),
        ("Pain d'épices", "Gingerbread", "300g", 7, "Brossard", 2.59m),
        ("Moutarde de Dijon", "Dijon mustard", "350g", 6, "Amora", 1.99m),
        ("Cassonade", "Brown sugar", "750g", 7, "Daddy", 2.39m),
        ("Frites allumettes surgelées", "Frozen French fries", "1kg", 9, "McCain", 2.99m),
        // BBQ
        ("Merguez", "Merguez sausages", "6 pièces / 6 pieces", 4, "Charal", 4.99m),
        ("Chipolatas", "Chipolata sausages", "6 pièces / 6 pieces", 4, "Herta", 3.99m),
        ("Filets de poulet", "Chicken breasts", "500g", 4, "Le Gaulois", 7.49m),
        ("Sauce barbecue", "Barbecue sauce", "340g", 6, "Heinz", 2.79m),
        ("Ketchup", "Ketchup", "570g", 6, "Heinz", 3.29m),
        ("Pains à burger", "Burger buns", "4 pièces / 4 pieces", 3, "Harrys", 1.99m),
        ("Salade verte en sachet", "Bagged green salad", "125g", 1, "Florette", 1.79m),
        ("Tomates rondes", "Round tomatoes", "1kg", 1, "Prince de Bretagne", 2.99m),
        // Repas végétarien
        ("Lentilles vertes", "Green lentils", "500g", 6, "Sabarot", 3.19m),
        ("Pois chiches", "Chickpeas", "400g", 6, "Cassegrain", 1.89m),
        ("Tofu nature", "Plain tofu", "400g", 10, "Bjorg", 3.49m),
        ("Courgettes", "Courgettes", "1kg", 1, "Prince de Bretagne", 2.79m),
        ("Poivrons", "Bell peppers", "3 pièces / 3 pieces", 1, "Prince de Bretagne", 2.99m),
        ("Semoule de couscous", "Couscous semolina", "500g", 6, "Tipiak", 2.19m),
        // Pizza
        ("Pâte à pizza", "Pizza dough", "260g", 3, "Herta", 2.49m),
        ("Mozzarella", "Mozzarella", "125g", 2, "Galbani", 1.59m),
        ("Jambon blanc", "Cooked ham", "4 tranches / 4 slices", 4, "Herta", 3.29m),
        ("Olives noires dénoyautées", "Pitted black olives", "200g", 6, "Tramier", 2.29m),
        ("Herbes de Provence", "Herbes de Provence", "30g", 6, "Ducros", 2.19m)
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
            new() { Id = 10, Name = "Bio & Bien-être", NameEn = "Organic & Wellness", Description = "Produits bio, sans gluten et compléments alimentaires", DescriptionEn = "Organic, gluten-free products and food supplements", ProductCount = 10, SiteType = SiteType.Grocery, Icon = "Eco" },
            new() { Id = SmallApplianceCategoryId, Name = "Petit électroménager", NameEn = "Small Appliances", Description = "Cafetières, hachoirs électriques, bouilloires et barbecues", DescriptionEn = "Coffee makers, electric meat grinders, kettles and barbecues", ProductCount = 7, SiteType = SiteType.Grocery, Icon = "CoffeeMaker" }
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
        AddSmallApplianceProducts(products);
        return products;
    }

    private static void AddSmallApplianceProducts(List<Product> products)
    {
        products.AddRange([
            CreateSmallApplianceProduct(
                260,
                "De'Longhi Magnifica Start ECAM220.22.GB",
                "De'Longhi Magnifica Start ECAM220.22.GB",
                "Machine expresso avec broyeur à grains, panneau tactile et buse vapeur pour cappuccino.",
                "Bean-to-cup espresso machine with touch controls and a steam wand for cappuccino.",
                399.99m,
                null,
                "De'Longhi",
                "GROCERY-SMALL-DEL-ECAM22022GB",
                14,
                isNew: true,
                isBestSeller: true,
                isFeatured: true,
                isPromo: false,
                "Coloris",
                "Color",
                "Noir",
                1010),
            CreateSmallApplianceProduct(
                261,
                "Bosch TKA6A041 ComfortLine",
                "Bosch TKA6A041 ComfortLine",
                "Cafetière filtre 15 tasses avec réservoir amovible, système anti-goutte et maintien au chaud.",
                "15-cup filter coffee maker with removable tank, drip stop and keep-warm plate.",
                69.99m,
                null,
                "Bosch",
                "GROCERY-SMALL-BOS-TKA6A041",
                27,
                isNew: false,
                isBestSeller: true,
                isFeatured: false,
                isPromo: false,
                "Coloris",
                "Color",
                "Blanc",
                1020),
            CreateSmallApplianceProduct(
                262,
                "Moulinex HV4 ME452839",
                "Moulinex HV4 ME452839",
                "Hachoir à viande électrique 2000 W, capacité jusqu'à 2,3 kg/min avec trois grilles inox.",
                "2,000 W electric meat grinder processing up to 2.3 kg/min with three stainless-steel plates.",
                119.99m,
                null,
                "Moulinex",
                "GROCERY-SMALL-MOU-ME452839",
                19,
                isNew: false,
                isBestSeller: false,
                isFeatured: false,
                isPromo: false,
                "Standard",
                "Standard",
                "Standard",
                1030),
            CreateSmallApplianceProduct(
                263,
                "Bosch TWK3P420 DesignLine",
                "Bosch TWK3P420 DesignLine",
                "Bouilloire électrique inox 1,7 L, 2400 W, socle 360° et arrêt automatique.",
                "1.7 L stainless-steel electric kettle with 2,400 W output, 360° base and auto shut-off.",
                44.99m,
                null,
                "Bosch",
                "GROCERY-SMALL-BOS-TWK3P420",
                34,
                isNew: false,
                isBestSeller: true,
                isFeatured: false,
                isPromo: false,
                "Coloris",
                "Color",
                "Inox",
                1040),
            CreateSmallApplianceProduct(
                264,
                "Weber Compact Kettle 47 cm",
                "Weber Compact Kettle 47 cm",
                "Barbecue à charbon compact avec cuve et couvercle émaillés, grille de cuisson de 47 cm.",
                "Compact charcoal barbecue with porcelain-enamelled bowl and lid, plus a 47 cm cooking grate.",
                159.99m,
                129.99m,
                "Weber",
                "GROCERY-SMALL-WEB-COMPACT47",
                22,
                isNew: false,
                isBestSeller: true,
                isFeatured: true,
                isPromo: true,
                "Diamètre",
                "Diameter",
                "47 cm",
                1050),
            CreateSmallApplianceProduct(
                265,
                "Campingaz 3 Series Classic LS Plus",
                "Campingaz 3 Series Classic LS Plus",
                "Barbecue à gaz 3 brûleurs en acier inoxydable, plancha réversible et surface de cuisson 2 800 cm².",
                "Three-burner stainless-steel gas barbecue with reversible griddle and 2,800 cm² cooking surface.",
                499.99m,
                null,
                "Campingaz",
                "GROCERY-SMALL-CAM-3SCLSPLUS",
                8,
                isNew: true,
                isBestSeller: false,
                isFeatured: true,
                isPromo: false,
                "Standard",
                "Standard",
                "Standard",
                1060),
            CreateSmallApplianceProduct(
                266,
                "Weber Spirit II E-310",
                "Weber Spirit II E-310",
                "Barbecue à gaz 3 brûleurs avec système GS4, grille Gourmet BBQ System et tablettes latérales.",
                "Three-burner gas barbecue with the GS4 system, Gourmet BBQ System grate and side tables.",
                699.99m,
                null,
                "Weber",
                "GROCERY-SMALL-WEB-SPIRIT2E310",
                11,
                isNew: false,
                isBestSeller: true,
                isFeatured: false,
                isPromo: false,
                "Coloris",
                "Color",
                "Noir",
                1070)
        ]);
    }

    private static Product CreateSmallApplianceProduct(
        int id,
        string name,
        string nameEn,
        string description,
        string descriptionEn,
        decimal price,
        decimal? promoPrice,
        string brand,
        string sku,
        int stock,
        bool isNew,
        bool isBestSeller,
        bool isFeatured,
        bool isPromo,
        string variantName,
        string variantNameEn,
        string variantValue,
        int variantId)
    {
        return new Product
        {
            Id = id,
            CategoryId = SmallApplianceCategoryId,
            Name = name,
            NameEn = nameEn,
            Description = description,
            DescriptionEn = descriptionEn,
            Price = price,
            PromoPrice = promoPrice,
            Brand = brand,
            Sku = sku,
            Stock = stock,
            IsNew = isNew,
            IsBestSeller = isBestSeller,
            IsFeatured = isFeatured,
            IsPromo = isPromo,
            SiteType = SiteType.Grocery,
            CreatedAt = new DateTime(2026, 1, 1),
            Tags = [brand, "petit électroménager", "barbecue"],
            Variants = [new ProductVariant
            {
                Id = variantId,
                Name = variantName,
                NameEn = variantNameEn,
                Value = variantValue,
                Stock = stock
            }]
        };
    }
}
