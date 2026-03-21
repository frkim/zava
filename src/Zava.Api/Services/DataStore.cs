namespace Zava.Api.Services;

using Zava.Api.Models;

public class DataStore
{
    private readonly object _lock = new();

    public SiteType CurrentSiteType { get; private set; } = SiteType.Electronics;
    public List<Product> Products { get; private set; } = new();
    public List<Category> Categories { get; private set; } = new();
    public List<Review> Reviews { get; private set; } = new();
    public List<User> Users { get; private set; } = new();
    public List<Order> Orders { get; private set; } = new();
    public Cart Cart { get; private set; } = new();

    public void Initialize(SiteType siteType)
    {
        lock (_lock)
        {
            CurrentSiteType = siteType;
            Products = DataSeeder.GenerateProducts(siteType);
            Categories = DataSeeder.GenerateCategories(siteType);
            Reviews = DataSeeder.GenerateReviews(Products);
            Users = DataSeeder.GenerateUsers();
            Orders = DataSeeder.GenerateOrders(Products, Users);
            Cart = new Cart();

            // Update product review counts and ratings from generated reviews
            foreach (var product in Products)
            {
                var productReviews = Reviews.Where(r => r.ProductId == product.Id).ToList();
                product.ReviewCount = productReviews.Count;
                product.Rating = productReviews.Count > 0
                    ? Math.Round(productReviews.Average(r => r.Rating), 1)
                    : 0;
            }
        }
    }

    public void Reset()
    {
        Initialize(CurrentSiteType);
    }

    public void ChangeSiteType(SiteType siteType)
    {
        Initialize(siteType);
    }

    public SiteConfig GetSiteConfig()
    {
        return new SiteConfig
        {
            CurrentSiteType = CurrentSiteType,
            AvailableSiteTypes = new List<SiteTypeInfo>
            {
                new() { Type = SiteType.Electronics, Name = "Électronique & Livres", NameEn = "Electronics & Books", Description = "Comme Fnac.com", DescriptionEn = "Like Fnac.com" },
                new() { Type = SiteType.Appliances, Name = "Électroménager", NameEn = "Appliances", Description = "Comme Boulanger / Darty", DescriptionEn = "Like Boulanger / Darty" },
                new() { Type = SiteType.Cosmetics, Name = "Beauté & Parfums", NameEn = "Beauty & Fragrances", Description = "Comme Sephora / L'Oréal", DescriptionEn = "Like Sephora / L'Oréal" },
                new() { Type = SiteType.Electrical, Name = "Matériel Électrique", NameEn = "Electrical Equipment", Description = "Comme Rexel / Sonepar", DescriptionEn = "Like Rexel / Sonepar" },
                new() { Type = SiteType.DIY, Name = "Bricolage", NameEn = "DIY", Description = "Comme Leroy Merlin", DescriptionEn = "Like Leroy Merlin" },
                new() { Type = SiteType.Grocery, Name = "Alimentaire", NameEn = "Grocery", Description = "Comme Carrefour / Leclerc / Auchan", DescriptionEn = "Like Carrefour / Leclerc / Auchan" }
            }
        };
    }
}
