namespace Zava.Api.Services;

using Zava.Api.Models;

public static class DiySeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Perceuses & Visseuses", NameEn = "Drills & Screwdrivers", Description = "Perceuses, visseuses sans fil et percussion", DescriptionEn = "Drills, cordless screwdrivers and hammer drills", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Hardware" },
            new() { Id = 2, Name = "Peinture & Enduits", NameEn = "Paint & Fillers", Description = "Peintures murales, lasures et enduits de rebouchage", DescriptionEn = "Wall paints, stains and filler compounds", ProductCount = 10, SiteType = SiteType.DIY, Icon = "FormatPaint" },
            new() { Id = 3, Name = "Outillage à Main", NameEn = "Hand Tools", Description = "Marteaux, tournevis, pinces et clés", DescriptionEn = "Hammers, screwdrivers, pliers and wrenches", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Build" },
            new() { Id = 4, Name = "Menuiserie & Bois", NameEn = "Woodwork & Timber", Description = "Scies, planches, tasseaux et panneaux", DescriptionEn = "Saws, boards, battens and panels", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Carpenter" },
            new() { Id = 5, Name = "Plomberie", NameEn = "Plumbing", Description = "Tuyaux, raccords, robinets et WC", DescriptionEn = "Pipes, fittings, taps and toilets", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Plumbing" },
            new() { Id = 6, Name = "Quincaillerie", NameEn = "Hardware", Description = "Vis, chevilles, boulons et fixations", DescriptionEn = "Screws, wall plugs, bolts and fixings", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Settings" },
            new() { Id = 7, Name = "Revêtement Sol & Mur", NameEn = "Floor & Wall Covering", Description = "Carrelage, parquet et papier peint", DescriptionEn = "Tiles, parquet and wallpaper", ProductCount = 10, SiteType = SiteType.DIY, Icon = "GridView" },
            new() { Id = 8, Name = "Jardin & Extérieur", NameEn = "Garden & Outdoor", Description = "Tondeuses, outils de jardin et mobilier extérieur", DescriptionEn = "Mowers, garden tools and outdoor furniture", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Grass" },
            new() { Id = 9, Name = "Rangement & Organisation", NameEn = "Storage & Organization", Description = "Étagères, caissons et systèmes de rangement", DescriptionEn = "Shelves, cabinets and storage systems", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Inventory" },
            new() { Id = 10, Name = "Sécurité & Protection", NameEn = "Safety & Protection", Description = "Serrures, alarmes et EPI", DescriptionEn = "Locks, alarms and PPE", ProductCount = 10, SiteType = SiteType.DIY, Icon = "Security" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        return DataSeeder.LoadProductsFromJson("diy-products.json", SiteType.DIY);
    }
}
