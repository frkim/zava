namespace Zava.Api.Models;

public class SearchRequest
{
    public string? Query { get; set; }
    public int? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Brand { get; set; }
    public double? MinRating { get; set; }
    public bool? InStock { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class SearchResult
{
    public List<Product> Products { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public List<FacetGroup> Facets { get; set; } = new();
}

public class FacetGroup
{
    public string Name { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public List<FacetValue> Values { get; set; } = new();
}

public class FacetValue
{
    public string Value { get; set; } = string.Empty;
    public string? FilterValue { get; set; }
    public int Count { get; set; }
}

public class SearchSuggestion
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class HomepageData
{
    public List<Product> FeaturedProducts { get; set; } = new();
    public List<Product> BestSellers { get; set; } = new();
    public List<Product> NewProducts { get; set; } = new();
    public List<Product> PromoProducts { get; set; } = new();
    public List<Product> SelectionProducts { get; set; } = new();
    public List<Category> TopCategories { get; set; } = new();
    public List<string> Brands { get; set; } = new();
}

public class SiteConfig
{
    public SiteType CurrentSiteType { get; set; } = SiteType.Electronics;
    public List<SiteTypeInfo> AvailableSiteTypes { get; set; } = new();
}

public class SiteTypeInfo
{
    public SiteType Type { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
}

public class CheckoutRequest
{
    public Address ShippingAddress { get; set; } = new();
    public PaymentMethod PaymentMethod { get; set; }
    public string? CardNumber { get; set; }
    public string? CardHolder { get; set; }
    public string? CardExpiry { get; set; }
}

public class PaymentResult
{
    public bool Success { get; set; }
    public PaymentStatus Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public int? OrderId { get; set; }
    public string? TransactionId { get; set; }
}

public class AddToCartRequest
{
    public int ProductId { get; set; }
    public int? VariantId { get; set; }
    public int Quantity { get; set; } = 1;
}

public class UpdateCartItemRequest
{
    public int Quantity { get; set; }
}

public class AnalyticsDashboard
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    public int TotalProducts { get; set; }
    public int TotalCustomers { get; set; }
    public List<TopProduct> TopProducts { get; set; } = new();
    public Dictionary<string, int> OrdersByStatus { get; set; } = new();
    public Dictionary<string, decimal> RevenueByCategory { get; set; } = new();
    public List<DailySales> RecentSales { get; set; } = new();
}

public class TopProduct
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int QuantitySold { get; set; }
    public decimal Revenue { get; set; }
}

public class DailySales
{
    public DateOnly Date { get; set; }
    public int Orders { get; set; }
    public decimal Revenue { get; set; }
}

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public string Brand { get; set; } = string.Empty;
    public int Stock { get; set; }
}

public class SalesByCategory
{
    public string Category { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
}

public class RecentOrder
{
    public int OrderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime Date { get; set; }
}

public class SiteSettings
{
    public SiteType SiteType { get; set; }
}
