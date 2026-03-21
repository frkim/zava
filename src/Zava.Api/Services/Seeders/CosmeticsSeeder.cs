namespace Zava.Api.Services;

using Zava.Api.Models;

public static class CosmeticsSeeder
{
    public static List<Category> GenerateCategories()
    {
        return new List<Category>
        {
            new() { Id = 1, Name = "Parfums Femme", NameEn = "Women's Fragrances", Description = "Eaux de parfum et eaux de toilette femme", DescriptionEn = "Women's eau de parfum and eau de toilette", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "Spa" },
            new() { Id = 2, Name = "Parfums Homme", NameEn = "Men's Fragrances", Description = "Eaux de parfum et eaux de toilette homme", DescriptionEn = "Men's eau de parfum and eau de toilette", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "Face" },
            new() { Id = 3, Name = "Maquillage Lèvres", NameEn = "Lip Makeup", Description = "Rouges à lèvres, gloss et crayons", DescriptionEn = "Lipsticks, gloss and lip liners", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "Brush" },
            new() { Id = 4, Name = "Maquillage Yeux", NameEn = "Eye Makeup", Description = "Mascaras, fards à paupières et eye-liners", DescriptionEn = "Mascaras, eyeshadows and eyeliners", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "Visibility" },
            new() { Id = 5, Name = "Soins Visage", NameEn = "Face Care", Description = "Crèmes, sérums et nettoyants visage", DescriptionEn = "Face creams, serums and cleansers", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "FaceRetouchingNatural" },
            new() { Id = 6, Name = "Soins Corps", NameEn = "Body Care", Description = "Laits corporels, gommages et huiles", DescriptionEn = "Body lotions, scrubs and oils", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "Spa" },
            new() { Id = 7, Name = "Teint", NameEn = "Complexion", Description = "Fonds de teint, correcteurs et poudres", DescriptionEn = "Foundations, concealers and powders", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "Palette" },
            new() { Id = 8, Name = "Soins Cheveux", NameEn = "Hair Care", Description = "Shampoings, après-shampoings et masques", DescriptionEn = "Shampoos, conditioners and masks", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "ContentCut" },
            new() { Id = 9, Name = "Coffrets & Cadeaux", NameEn = "Gift Sets", Description = "Coffrets parfums et coffrets beauté", DescriptionEn = "Fragrance sets and beauty gift sets", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "CardGiftcard" },
            new() { Id = 10, Name = "Solaires", NameEn = "Sun Care", Description = "Protections solaires et autobronzants", DescriptionEn = "Sun protection and self-tanners", ProductCount = 10, SiteType = SiteType.Cosmetics, Icon = "WbSunny" }
        };
    }

    public static List<Product> GenerateProducts()
    {
        return DataSeeder.LoadProductsFromJson("cosmetics-products.json", SiteType.Cosmetics);
    }
}
