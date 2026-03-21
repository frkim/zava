namespace Zava.Api.Services;

using Zava.Api.Models;

public static class ElectricalSeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Câbles & Fils", NameEn = "Cables & Wires", Description = "Câbles électriques, fils et gaines", DescriptionEn = "Electrical cables, wires and conduits", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "Cable" },
            new() { Id = 2, Name = "Disjoncteurs & Protection", NameEn = "Circuit Breakers & Protection", Description = "Disjoncteurs, différentiels et fusibles", DescriptionEn = "Circuit breakers, RCDs and fuses", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "ElectricalServices" },
            new() { Id = 3, Name = "Prises & Interrupteurs", NameEn = "Outlets & Switches", Description = "Prises de courant, interrupteurs et enjoliveurs", DescriptionEn = "Power outlets, switches and faceplates", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "Power" },
            new() { Id = 4, Name = "Éclairage Intérieur", NameEn = "Indoor Lighting", Description = "Ampoules, spots, plafonniers et luminaires", DescriptionEn = "Bulbs, spots, ceiling lights and fixtures", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "Lightbulb" },
            new() { Id = 5, Name = "Éclairage Extérieur", NameEn = "Outdoor Lighting", Description = "Appliques, bornes et projecteurs extérieurs", DescriptionEn = "Wall lights, bollards and outdoor spotlights", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "LightMode" },
            new() { Id = 6, Name = "Tableaux Électriques", NameEn = "Electrical Panels", Description = "Coffrets, tableaux et accessoires de tableau", DescriptionEn = "Enclosures, panels and panel accessories", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "Dashboard" },
            new() { Id = 7, Name = "Domotique", NameEn = "Home Automation", Description = "Prises connectées, thermostats et volets roulants", DescriptionEn = "Smart plugs, thermostats and roller shutters", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "SmartToy" },
            new() { Id = 8, Name = "Outillage Électrique", NameEn = "Electrical Tools", Description = "Tournevis testeurs, pinces et outils de mesure", DescriptionEn = "Test screwdrivers, pliers and measuring tools", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "Build" },
            new() { Id = 9, Name = "Chauffage Électrique", NameEn = "Electric Heating", Description = "Radiateurs, convecteurs et sèche-serviettes", DescriptionEn = "Radiators, convectors and towel warmers", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "Thermostat" },
            new() { Id = 10, Name = "Ventilation & Climatisation", NameEn = "Ventilation & Air Conditioning", Description = "VMC, extracteurs et climatiseurs", DescriptionEn = "Mechanical ventilation, extractors and AC units", ProductCount = 10, SiteType = SiteType.Electrical, Icon = "AcUnit" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        return DataSeeder.LoadProductsFromJson("electrical-products.json", SiteType.Electrical);
    }
}
