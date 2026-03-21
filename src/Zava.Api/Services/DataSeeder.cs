namespace Zava.Api.Services;

using System.Text.Json;
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

        // Templates grouped by rating to ensure comment sentiment matches star rating
        // Each entry: (Title FR, Title EN, Comment FR, Comment EN)
        var templatesByRating = new Dictionary<int, (string Title, string TitleEn, string Comment, string CommentEn)[]>
        {
            [1] = [
                ("À éviter", "Stay away", "Qualité médiocre, déçu par ce produit. Je ne le recommande pas.", "Poor quality, disappointed with this product. I do not recommend it."),
                ("Très déçu", "Very disappointed", "Produit défectueux reçu, impossible à utiliser. Mauvaise expérience.", "Received a defective product, impossible to use. Bad experience."),
                ("Nul", "Terrible", "Ne correspond absolument pas à la description. Grosse déception.", "Does not match the description at all. Huge disappointment."),
                ("Catastrophique", "Catastrophic", "Cassé au bout de deux jours. Le SAV ne répond même pas. Fuyez.", "Broke after two days. Customer service doesn't even respond. Run away."),
                ("Arnaque", "Scam", "Le produit n'a rien à voir avec les photos. Emballage abîmé, contenu médiocre.", "The product looks nothing like the photos. Damaged packaging, mediocre content."),
                ("Honteux", "Shameful", "Jamais vu une qualité aussi mauvaise. Je vais demander un remboursement.", "Never seen such poor quality. I will request a refund."),
                ("Ne pas acheter", "Do not buy", "Matériaux bas de gamme, finitions inexistantes. Argent jeté par les fenêtres.", "Cheap materials, non-existent finishing. Money thrown out the window."),
                ("Retour immédiat", "Immediate return", "Produit renvoyé le jour même. Odeur désagréable et qualité lamentable.", "Returned the same day. Unpleasant smell and appalling quality."),
            ],
            [2] = [
                ("Déçu", "Disappointed", "Le produit ne correspond pas tout à fait à mes attentes. La qualité pourrait être meilleure.", "The product doesn't quite meet my expectations. Quality could be better."),
                ("Bof", "Meh", "Sans grand intérêt, je regrette un peu mon achat.", "Not very interesting, I somewhat regret my purchase."),
                ("Peut mieux faire", "Could do better", "C'est correct mais j'ai connu mieux pour un prix similaire.", "It's okay but I've seen better for a similar price."),
                ("Pas convaincu", "Not convinced", "L'idée est bonne mais la réalisation laisse à désirer. Finitions moyennes.", "The idea is good but the execution leaves much to be desired. Average finishing."),
                ("Moyen", "Below average", "Pas terrible pour le prix demandé. On s'attend à mieux pour cette gamme.", "Not great for the asking price. You'd expect better for this range."),
                ("Décevant", "Underwhelming", "Les avis étaient bons mais je ne retrouve pas la qualité promise. Dommage.", "Reviews were good but I don't see the promised quality. Too bad."),
                ("Pas à la hauteur", "Falls short", "Le produit fonctionne mais la qualité est vraiment en dessous de ce que j'espérais.", "The product works but the quality is really below what I hoped for."),
                ("Insuffisant", "Insufficient", "Reçu rapidement mais le produit est fragile et peu pratique au quotidien.", "Received quickly but the product is fragile and impractical for daily use."),
            ],
            [3] = [
                ("Correct", "Fair enough", "Fait le job, sans plus. Pour le prix c'est acceptable.", "Gets the job done, nothing more. Acceptable for the price."),
                ("Pas mal", "Not bad", "Correct pour le prix. Quelques petits défauts mais dans l'ensemble satisfaisant.", "Decent for the price. A few minor flaws but overall satisfactory."),
                ("Mitigé", "Mixed feelings", "Quelques points positifs mais aussi des défauts. À améliorer.", "Some positives but also some flaws. Room for improvement."),
                ("Bien mais...", "Good but...", "Le produit est bien dans l'ensemble, mais la notice est incompréhensible.", "The product is good overall, but the instructions are incomprehensible."),
                ("Acceptable", "Acceptable", "Rien d'exceptionnel, rien de catastrophique non plus. Un produit standard.", "Nothing exceptional, nothing catastrophic either. A standard product."),
                ("Sans surprise", "No surprises", "Conforme à ce qu'on peut attendre à ce prix. Ni plus ni moins.", "As expected for this price. Nothing more, nothing less."),
                ("Avis partagé", "On the fence", "Certains aspects sont réussis, d'autres beaucoup moins. Rapport qualité-prix moyen.", "Some aspects are good, others much less so. Average value for money."),
                ("Fonctionnel", "Functional", "Le produit remplit sa fonction de base correctement, mais manque de finition.", "The product fulfils its basic function correctly, but lacks finishing."),
                ("Honnête", "Honest product", "Un produit honnête pour un usage quotidien. Ne vous attendez pas à du haut de gamme.", "An honest product for daily use. Don't expect premium quality."),
                ("Convenable", "Decent", "Fait ce qu'on lui demande. L'emballage était soigné, le produit est basique mais correct.", "Does what it's supposed to. Packaging was neat, product is basic but fine."),
            ],
            [4] = [
                ("Bon rapport qualité/prix", "Great value", "Pour le prix, c'est un très bon produit. Rien à redire sur la qualité.", "For the price, this is a very good product. Nothing to complain about quality-wise."),
                ("Très bien", "Very good", "Produit de bonne qualité, bien emballé. Je suis content de mon achat.", "Good quality product, well packaged. I'm happy with my purchase."),
                ("Bonne surprise", "Pleasant surprise", "Je ne m'attendais pas à une aussi bonne qualité pour ce prix.", "I wasn't expecting such good quality for this price."),
                ("Recommandé", "Recommended", "Un ami me l'a recommandé et je ne suis pas déçu. Très bon produit.", "A friend recommended it and I'm not disappointed. Very good product."),
                ("Satisfait", "Satisfied", "Conforme à la description, livraison rapide. Je suis satisfait de cet achat.", "As described, fast delivery. I'm satisfied with this purchase."),
                ("Bon produit", "Good product", "Qualité au rendez-vous. Petit bémol sur l'emballage mais le produit est top.", "Quality is there. Minor issue with packaging but the product is great."),
                ("Je recommande", "I recommend", "Utilisé depuis plusieurs semaines, aucun souci. Bon rapport qualité-prix.", "Used for several weeks, no issues. Good value for money."),
                ("Agréablement surpris", "Pleasantly surprised", "Hésitais entre plusieurs marques, j'ai bien fait de choisir celui-ci. Très bon produit.", "Was hesitating between several brands, glad I chose this one. Very good product."),
                ("Conforme", "As described", "Exactement comme décrit. L'article est solide et bien conçu. Satisfait.", "Exactly as described. The item is solid and well designed. Satisfied."),
                ("Bon choix", "Good choice", "Deuxième achat de ce produit, toujours aussi bien. Fiable et pratique.", "Second purchase of this product, still just as good. Reliable and practical."),
            ],
            [5] = [
                ("Excellent produit", "Excellent product", "Très satisfait de mon achat, je recommande vivement. La qualité est au rendez-vous.", "Very satisfied with my purchase, highly recommended. Quality is top-notch."),
                ("Super !", "Awesome!", "Exactement ce que je cherchais. Livraison rapide et produit conforme à la description.", "Exactly what I was looking for. Fast delivery and product matches the description."),
                ("Parfait", "Perfect", "Rien à dire, c'est parfait ! Correspond exactement à la description.", "Nothing to say, it's perfect! Matches the description exactly."),
                ("Génial", "Brilliant", "Je suis fan ! Excellente qualité et design très réussi.", "I'm a fan! Excellent quality and very successful design."),
                ("Qualité premium", "Premium quality", "On sent la qualité dès le déballage. Finitions impeccables.", "You can feel the quality from unboxing. Impeccable finishing."),
                ("Indispensable", "A must-have", "Devenu indispensable au quotidien. Je ne pourrais plus m'en passer.", "Has become essential in my daily life. I couldn't do without it."),
                ("Top qualité", "Top quality", "Excellente fabrication, matériaux de qualité. Très satisfait.", "Excellent craftsmanship, quality materials. Very satisfied."),
                ("Coup de coeur", "Love it", "Un vrai coup de coeur ! Je l'ai offert à plusieurs personnes depuis.", "Absolutely love it! I've gifted it to several people since."),
                ("Exceptionnel", "Outstanding", "Dépasse toutes mes attentes. Un produit rare à ce niveau de qualité.", "Exceeds all my expectations. A rare product at this level of quality."),
                ("5 étoiles mérités", "Deserves 5 stars", "Qualité irréprochable, emballage soigné, livraison express. Bravo !", "Flawless quality, careful packaging, express delivery. Well done!"),
                ("Au top", "Best purchase", "Meilleur achat de l'année. Le produit est magnifique et fonctionne à merveille.", "Best purchase of the year. The product is gorgeous and works wonderfully."),
                ("Impressionnant", "Impressive", "La qualité de fabrication est bluffante. On voit que chaque détail a été pensé.", "The build quality is stunning. You can see every detail has been thought through."),
                ("Incontournable", "Essential", "Je l'ai recommandé à toute ma famille. Un must-have, tout simplement.", "I've recommended it to my whole family. Simply a must-have."),
                ("Rien à redire", "No complaints", "Tout est parfait du début à la fin. Commande, livraison et produit au top.", "Everything is perfect from start to finish. Order, delivery and product are all top-notch."),
            ],
        };

        foreach (var product in products)
        {
            int reviewCount = _random.Next(10, 51);
            for (int i = 0; i < reviewCount; i++)
            {
                int rating = GenerateWeightedRating();
                var templates = templatesByRating[rating];
                var template = templates[_random.Next(templates.Length)];
                reviews.Add(new Review
                {
                    Id = reviewId++,
                    ProductId = product.Id,
                    UserName = $"{_firstNames[_random.Next(_firstNames.Length)]} {_lastNames[_random.Next(_lastNames.Length)][0]}.",
                    Rating = rating,
                    Title = template.Title,
                    TitleEn = template.TitleEn,
                    Comment = template.Comment,
                    CommentEn = template.CommentEn,
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
                PreferredDeliveryMethod = DeliveryMethod.Home,
                PreferredPaymentMethod = PaymentMethod.CreditCard,
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

    public static List<Product> LoadProductsFromJson(string jsonFileName, SiteType siteType)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "Services", "Seeders", "Data", jsonFileName);
        var json = File.ReadAllText(path);
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var products = JsonSerializer.Deserialize<List<Product>>(json, options)!;

        foreach (var p in products)
        {
            p.SiteType = siteType;
            p.RelatedProductIds = GetRelatedIds(p.Id, products.Count);
            p.Tags = GenerateTags(p);
            p.CreatedAt = RandomRecentDate();
        }

        return products;
    }

    private static List<string> GenerateTags(Product p)
    {
        var tags = new List<string> { p.Brand };
        if (p.IsNew) tags.Add("Nouveauté");
        if (p.IsPromo) tags.Add("Promo");
        if (p.IsBestSeller) tags.Add("Best-seller");
        return tags;
    }
}
