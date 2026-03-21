namespace Zava.Api.Services;

using Zava.Api.Models;

public static class DataSeeder
{
    private static readonly Random _random = new(42);
    private static readonly string[] _firstNames = ["Marie", "Jean", "Pierre", "Sophie", "Nicolas", "Camille", "Thomas", "Julie", "Antoine", "Émilie", "Lucas", "Léa", "Hugo", "Chloé", "Maxime", "Manon", "Alexandre", "Sarah", "Raphaël", "Clara"];
    private static readonly string[] _lastNames = ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon", "Michel", "Lefebvre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard"];

    public static List<Product> GenerateProducts(SiteType siteType)
    {
        return siteType switch
        {
            SiteType.Electronics => ElectronicsSeeder.GenerateProducts(),
            SiteType.Appliances => AppliancesSeeder.GenerateProducts(),
            SiteType.Cosmetics => CosmeticsSeeder.GenerateProducts(),
            SiteType.Electrical => ElectricalSeeder.GenerateProducts(),
            SiteType.DIY => DiySeeder.GenerateProducts(),
            SiteType.Grocery => GrocerySeeder.GenerateProducts(),
            _ => ElectronicsSeeder.GenerateProducts()
        };
    }

    public static List<Category> GenerateCategories(SiteType siteType)
    {
        return siteType switch
        {
            SiteType.Electronics => ElectronicsSeeder.GenerateCategories(),
            SiteType.Appliances => AppliancesSeeder.GenerateCategories(),
            SiteType.Cosmetics => CosmeticsSeeder.GenerateCategories(),
            SiteType.Electrical => ElectricalSeeder.GenerateCategories(),
            SiteType.DIY => DiySeeder.GenerateCategories(),
            SiteType.Grocery => GrocerySeeder.GenerateCategories(),
            _ => ElectronicsSeeder.GenerateCategories()
        };
    }

    public static List<Review> GenerateReviews(List<Product> products)
    {
        var reviews = new List<Review>();
        int reviewId = 1;

        var reviewTemplates = new[]
        {
            ("Excellent produit", "Très satisfait de mon achat, je recommande vivement. La qualité est au rendez-vous."),
            ("Bon rapport qualité/prix", "Pour le prix, c'est un très bon produit. Rien à redire sur la qualité."),
            ("Déçu", "Le produit ne correspond pas tout à fait à mes attentes. La qualité pourrait être meilleure."),
            ("Super !", "Exactement ce que je cherchais. Livraison rapide et produit conforme à la description."),
            ("Pas mal", "Correct pour le prix. Quelques petits défauts mais dans l'ensemble satisfaisant."),
            ("Très bien", "Produit de bonne qualité, bien emballé. Je suis content de mon achat."),
            ("À éviter", "Qualité médiocre, déçu par ce produit. Je ne le recommande pas."),
            ("Parfait", "Rien à dire, c'est parfait ! Correspond exactement à la description."),
            ("Correct", "Fait le job, sans plus. Pour le prix c'est acceptable."),
            ("Génial", "Je suis fan ! Excellente qualité et design très réussi."),
            ("Bonne surprise", "Je ne m'attendais pas à une aussi bonne qualité pour ce prix."),
            ("Mitigé", "Quelques points positifs mais aussi des défauts. À améliorer."),
            ("Recommandé", "Un ami me l'a recommandé et je ne suis pas déçu. Très bon produit."),
            ("Qualité premium", "On sent la qualité dès le déballage. Finitions impeccables."),
            ("Peut mieux faire", "C'est correct mais j'ai connu mieux pour un prix similaire."),
            ("Indispensable", "Devenu indispensable au quotidien. Je ne pourrais plus m'en passer."),
            ("Bien mais...", "Le produit est bien dans l'ensemble, mais la notice est incompréhensible."),
            ("Top qualité", "Excellente fabrication, matériaux de qualité. Très satisfait."),
            ("Bof", "Sans grand intérêt, je regrette un peu mon achat."),
            ("Coup de coeur", "Un vrai coup de coeur ! Je l'ai offert à plusieurs personnes depuis."),
        };

        foreach (var product in products)
        {
            int reviewCount = _random.Next(10, 51);
            for (int i = 0; i < reviewCount; i++)
            {
                var template = reviewTemplates[_random.Next(reviewTemplates.Length)];
                int rating = GenerateWeightedRating();
                reviews.Add(new Review
                {
                    Id = reviewId++,
                    ProductId = product.Id,
                    UserName = $"{_firstNames[_random.Next(_firstNames.Length)]} {_lastNames[_random.Next(_lastNames.Length)][0]}.",
                    Rating = rating,
                    Title = template.Item1,
                    Comment = template.Item2,
                    CreatedAt = DateTime.Now.AddDays(-_random.Next(1, 365)),
                    Verified = _random.NextDouble() > 0.3,
                    HelpfulCount = _random.Next(0, 50)
                });
            }
        }

        return reviews;
    }

    public static List<User> GenerateUsers()
    {
        return new List<User>
        {
            new()
            {
                Id = 1,
                Email = "demo@zava.fr",
                FirstName = "Marie",
                LastName = "Dupont",
                Phone = "06 12 34 56 78",
                ShippingAddress = new Address
                {
                    Street = "15 Rue de la Paix",
                    City = "Paris",
                    PostalCode = "75002",
                    Country = "France"
                },
                BillingAddress = new Address
                {
                    Street = "15 Rue de la Paix",
                    City = "Paris",
                    PostalCode = "75002",
                    Country = "France"
                },
                PaymentInfo = new PaymentInfo
                {
                    CardType = "Visa",
                    LastFourDigits = "4242",
                    ExpiryDate = "12/27",
                    CardHolderName = "MARIE DUPONT"
                },
                IsPremium = true,
                CreatedAt = DateTime.Now.AddMonths(-6)
            }
        };
    }

    public static List<Order> GenerateOrders(List<Product> products, List<User> users)
    {
        var orders = new List<Order>();
        var statuses = new[] { OrderStatus.Delivered, OrderStatus.Delivered, OrderStatus.Shipped, OrderStatus.Processing, OrderStatus.Pending };

        for (int i = 1; i <= 25; i++)
        {
            var orderProducts = products.OrderBy(_ => _random.Next()).Take(_random.Next(1, 5)).ToList();
            var items = orderProducts.Select(p => new CartItem
            {
                ProductId = p.Id,
                ProductName = p.Name,
                VariantId = p.Variants.Count > 0 ? p.Variants[0].Id : null,
                VariantName = p.Variants.Count > 0 ? p.Variants[0].Name : null,
                UnitPrice = p.PromoPrice ?? p.Price,
                Quantity = _random.Next(1, 4)
            }).ToList();

            orders.Add(new Order
            {
                Id = i,
                UserId = 1,
                Items = items,
                Total = items.Sum(item => item.Subtotal),
                Status = statuses[_random.Next(statuses.Length)],
                ShippingAddress = users[0].ShippingAddress!,
                PaymentMethod = (PaymentMethod)_random.Next(0, 4),
                CreatedAt = DateTime.Now.AddDays(-_random.Next(1, 90)),
                TrackingNumber = i <= 15 ? $"FR{_random.Next(100000000, 999999999)}" : string.Empty
            });
        }

        return orders.OrderByDescending(o => o.CreatedAt).ToList();
    }

    private static int GenerateWeightedRating()
    {
        // Weighted towards positive reviews (realistic distribution)
        double roll = _random.NextDouble();
        if (roll < 0.05) return 1;
        if (roll < 0.10) return 2;
        if (roll < 0.25) return 3;
        if (roll < 0.55) return 4;
        return 5;
    }

    public static List<int> GetRelatedIds(int productId, int totalProducts, int count = 4)
    {
        var ids = new List<int>();
        while (ids.Count < count)
        {
            int id = _random.Next(1, totalProducts + 1);
            if (id != productId && !ids.Contains(id))
                ids.Add(id);
        }
        return ids;
    }

    public static DateTime RandomRecentDate() => DateTime.Now.AddDays(-_random.Next(1, 180));
}
