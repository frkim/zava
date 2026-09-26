namespace Zava.Api.Services;

using Zava.Api.Models;

public static class SportsSeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Running", NameEn = "Running", Description = "Chaussures, textile et montres de running", DescriptionEn = "Running shoes, clothing and watches", ProductCount = 10, SiteType = SiteType.Sports, Icon = "DirectionsRun" },
            new() { Id = 2, Name = "Fitness & Musculation", NameEn = "Fitness & Strength Training", Description = "Cardio, poids libres et accessoires", DescriptionEn = "Cardio machines, free weights and accessories", ProductCount = 10, SiteType = SiteType.Sports, Icon = "FitnessCenter" },
            new() { Id = 3, Name = "Football", NameEn = "Football", Description = "Ballons, chaussures, maillots et protections", DescriptionEn = "Balls, boots, shirts and protection", ProductCount = 10, SiteType = SiteType.Sports, Icon = "SportsSoccer" },
            new() { Id = 4, Name = "Randonnée & Camping", NameEn = "Hiking & Camping", Description = "Tentes, sacs à dos, chaussures et bivouac", DescriptionEn = "Tents, backpacks, shoes and camping gear", ProductCount = 10, SiteType = SiteType.Sports, Icon = "Hiking" },
            new() { Id = 5, Name = "Vélo", NameEn = "Cycling", Description = "VTT, vélos de ville, casques et accessoires", DescriptionEn = "Mountain bikes, city bikes, helmets and accessories", ProductCount = 10, SiteType = SiteType.Sports, Icon = "DirectionsBike" },
            new() { Id = 6, Name = "Natation", NameEn = "Swimming", Description = "Maillots, lunettes et matériel d'entraînement", DescriptionEn = "Swimsuits, goggles and training equipment", ProductCount = 10, SiteType = SiteType.Sports, Icon = "Pool" },
            new() { Id = 7, Name = "Tennis & Raquettes", NameEn = "Racket Sports", Description = "Tennis, badminton, padel et ping-pong", DescriptionEn = "Tennis, badminton, padel and table tennis", ProductCount = 10, SiteType = SiteType.Sports, Icon = "SportsTennis" },
            new() { Id = 8, Name = "Sports d'Hiver", NameEn = "Winter Sports", Description = "Ski, snowboard, casques et vêtements chauds", DescriptionEn = "Skis, snowboards, helmets and warm clothing", ProductCount = 10, SiteType = SiteType.Sports, Icon = "DownhillSkiing" },
            new() { Id = 9, Name = "Basket & Sports Co", NameEn = "Basketball & Team Sports", Description = "Basket, handball, volley et rugby", DescriptionEn = "Basketball, handball, volleyball and rugby", ProductCount = 10, SiteType = SiteType.Sports, Icon = "SportsBasketball" },
            new() { Id = 10, Name = "Yoga & Bien-être", NameEn = "Yoga & Wellness", Description = "Tapis, accessoires de yoga et récupération", DescriptionEn = "Mats, yoga accessories and recovery gear", ProductCount = 10, SiteType = SiteType.Sports, Icon = "SelfImprovement" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        return DataSeeder.LoadProductsFromJson("sports-products.json", SiteType.Sports);
    }
}
