namespace Zava.Api.Services;

using Zava.Api.Models;

public static class ElectronicsSeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Téléviseurs", NameEn = "TVs", Description = "Téléviseurs LED, OLED et QLED", DescriptionEn = "LED, OLED and QLED TVs", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Tv" },
            new() { Id = 2, Name = "Ordinateurs portables", NameEn = "Laptops", Description = "PC portables et ultrabooks", DescriptionEn = "Laptops and ultrabooks", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Laptop" },
            new() { Id = 3, Name = "Smartphones", NameEn = "Smartphones", Description = "Téléphones mobiles et accessoires", DescriptionEn = "Mobile phones and accessories", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Smartphone" },
            new() { Id = 4, Name = "Casques & Écouteurs", NameEn = "Headphones", Description = "Casques audio et écouteurs sans fil", DescriptionEn = "Headphones and wireless earbuds", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Headphones" },
            new() { Id = 5, Name = "Appareils photo", NameEn = "Cameras", Description = "Appareils photo reflex et hybrides", DescriptionEn = "DSLR and mirrorless cameras", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "CameraAlt" },
            new() { Id = 6, Name = "Gaming", NameEn = "Gaming", Description = "Consoles, jeux et accessoires gaming", DescriptionEn = "Consoles, games and gaming accessories", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "SportsEsports" },
            new() { Id = 7, Name = "Tablettes", NameEn = "Tablets", Description = "Tablettes tactiles et accessoires", DescriptionEn = "Tablets and accessories", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Tablet" },
            new() { Id = 8, Name = "Enceintes & Son", NameEn = "Speakers", Description = "Enceintes Bluetooth et systèmes audio", DescriptionEn = "Bluetooth speakers and audio systems", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Speaker" },
            new() { Id = 9, Name = "Montres connectées", NameEn = "Smartwatches", Description = "Montres et bracelets connectés", DescriptionEn = "Smartwatches and fitness trackers", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "Watch" },
            new() { Id = 10, Name = "Livres", NameEn = "Books", Description = "Romans, BD, mangas et livres pratiques", DescriptionEn = "Novels, comics, manga and practical books", ProductCount = 10, SiteType = SiteType.Electronics, Icon = "MenuBook" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        return DataSeeder.LoadProductsFromJson("electronics-products.json", SiteType.Electronics);
    }
}
