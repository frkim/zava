namespace Zava.Api.Services;

using Zava.Api.Models;

public static class ClothingSeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Chemises Homme", NameEn = "Men's Shirts", Description = "Chemises casual, business et manches courtes", DescriptionEn = "Casual, business and short-sleeve shirts", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "Checkroom" },
            new() { Id = 2, Name = "T-shirts & Polos Homme", NameEn = "Men's T-shirts & Polos", Description = "T-shirts, polos et marinières", DescriptionEn = "T-shirts, polo shirts and Breton tops", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "Man" },
            new() { Id = 3, Name = "Pulls & Sweats Homme", NameEn = "Men's Knitwear & Sweatshirts", Description = "Pulls, cardigans et sweats à capuche", DescriptionEn = "Jumpers, cardigans and hoodies", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "DryCleaning" },
            new() { Id = 4, Name = "Pantalons & Jeans Homme", NameEn = "Men's Trousers & Jeans", Description = "Jeans, chinos, joggers et shorts", DescriptionEn = "Jeans, chinos, joggers and shorts", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "Styler" },
            new() { Id = 5, Name = "Vestes & Manteaux Homme", NameEn = "Men's Jackets & Coats", Description = "Blousons, doudounes, parkas et manteaux", DescriptionEn = "Jackets, puffers, parkas and coats", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "Umbrella" },
            new() { Id = 6, Name = "Hauts & Chemisiers Femme", NameEn = "Women's Tops & Blouses", Description = "Chemisiers, blouses, tops et débardeurs", DescriptionEn = "Blouses, shirts, tops and camisoles", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "Woman" },
            new() { Id = 7, Name = "Robes & Jupes Femme", NameEn = "Women's Dresses & Skirts", Description = "Robes courtes, midi, longues et jupes", DescriptionEn = "Short, midi and maxi dresses plus skirts", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "Woman2" },
            new() { Id = 8, Name = "Mailles & Sweats Femme", NameEn = "Women's Knitwear & Sweatshirts", Description = "Pulls, gilets, cardigans et sweats", DescriptionEn = "Jumpers, cardigans and sweatshirts", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "Iron" },
            new() { Id = 9, Name = "Pantalons & Jeans Femme", NameEn = "Women's Trousers & Jeans", Description = "Jeans, pantalons tailleur et shorts", DescriptionEn = "Jeans, tailored trousers and shorts", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "Straighten" },
            new() { Id = 10, Name = "Accessoires & Sous-vêtements", NameEn = "Accessories & Underwear", Description = "Ceintures, bonnets, chaussettes et lingerie", DescriptionEn = "Belts, beanies, socks and underwear", ProductCount = 10, SiteType = SiteType.Clothing, Icon = "ShoppingBag" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        return DataSeeder.LoadProductsFromJson("clothing-products.json", SiteType.Clothing);
    }
}
