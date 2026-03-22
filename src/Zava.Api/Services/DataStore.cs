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
                new() { Type = SiteType.Electronics, Name = "Électronique", NameEn = "Electronics", Description = "Smartphones, laptops, livres", DescriptionEn = "Smartphones, laptops, books" },
                new() { Type = SiteType.Appliances, Name = "Électroménager", NameEn = "Appliances", Description = "Lave-linge, réfrigérateurs", DescriptionEn = "Washing machines, refrigerators" },
                new() { Type = SiteType.Cosmetics, Name = "Beauté & Parfums", NameEn = "Beauty & Fragrances", Description = "Maquillage, soins, parfums", DescriptionEn = "Makeup, skincare, fragrances" },
                new() { Type = SiteType.Electrical, Name = "Matériel Électrique", NameEn = "Electrical Equipment", Description = "Câbles, disjoncteurs, outillage", DescriptionEn = "Cables, circuit breakers, tools" },
                new() { Type = SiteType.DIY, Name = "Bricolage", NameEn = "DIY", Description = "Perceuses, peinture, plomberie", DescriptionEn = "Drills, paint, plumbing" },
                new() { Type = SiteType.Grocery, Name = "Alimentaire", NameEn = "Grocery", Description = "Épicerie, frais, boissons", DescriptionEn = "Groceries, fresh food, beverages" }
            }
        };
    }
}
