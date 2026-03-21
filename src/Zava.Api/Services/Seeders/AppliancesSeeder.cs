namespace Zava.Api.Services;

using Zava.Api.Models;

public static class AppliancesSeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Réfrigérateurs", NameEn = "Refrigerators", Description = "Réfrigérateurs, congélateurs et combinés", DescriptionEn = "Refrigerators, freezers and combis", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Kitchen" },
            new() { Id = 2, Name = "Lave-linge", NameEn = "Washing Machines", Description = "Lave-linge et sèche-linge", DescriptionEn = "Washing machines and dryers", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "LocalLaundryService" },
            new() { Id = 3, Name = "Lave-vaisselle", NameEn = "Dishwashers", Description = "Lave-vaisselle encastrables et pose libre", DescriptionEn = "Built-in and freestanding dishwashers", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Countertops" },
            new() { Id = 4, Name = "Aspirateurs", NameEn = "Vacuum Cleaners", Description = "Aspirateurs traîneaux, balais et robots", DescriptionEn = "Canister, stick and robot vacuums", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "CleaningServices" },
            new() { Id = 5, Name = "Fours & Cuisinières", NameEn = "Ovens & Cookers", Description = "Fours encastrables, cuisinières et plaques", DescriptionEn = "Built-in ovens, cookers and hobs", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Microwave" },
            new() { Id = 6, Name = "Micro-ondes", NameEn = "Microwaves", Description = "Micro-ondes, combinés et grill", DescriptionEn = "Microwaves, combis and grills", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Microwave" },
            new() { Id = 7, Name = "Cafetières & Expresso", NameEn = "Coffee Machines", Description = "Machines à café, expresso et capsules", DescriptionEn = "Coffee machines, espresso and capsules", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "CoffeeMaker" },
            new() { Id = 8, Name = "Robots cuiseurs", NameEn = "Food Processors", Description = "Robots cuiseurs multifonctions et mixeurs", DescriptionEn = "Multi-function food processors and blenders", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Blender" },
            new() { Id = 9, Name = "Climatisation", NameEn = "Air Conditioning", Description = "Climatiseurs, ventilateurs et purificateurs", DescriptionEn = "Air conditioners, fans and purifiers", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "AcUnit" },
            new() { Id = 10, Name = "Soin du linge", NameEn = "Laundry Care", Description = "Centrales vapeur, fers et défroisseurs", DescriptionEn = "Steam generators, irons and steamers", ProductCount = 10, SiteType = SiteType.Appliances, Icon = "Iron" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        return DataSeeder.LoadProductsFromJson("appliances-products.json", SiteType.Appliances);
    }
}
