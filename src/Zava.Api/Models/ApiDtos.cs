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
    public int Count { get; set; }
}

public class CheckoutRequest
{
    public Address ShippingAddress { get; set; } = new();
    public PaymentMethod PaymentMethod { get; set; }
    public string? CardNumber { get; set; }
}

public class AnalyticsSummary
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalProducts { get; set; }
    public decimal AverageOrderValue { get; set; }
    public List<TopProduct> TopProducts { get; set; } = new();
    public List<SalesByCategory> SalesByCategory { get; set; } = new();
    public List<RecentOrder> RecentOrders { get; set; } = new();
    public List<DailySales> DailySales { get; set; } = new();
}

public class TopProduct
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int UnitsSold { get; set; }
    public decimal Revenue { get; set; }
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

public class DailySales
{
    public string Date { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
}

public class SiteSettings
{
    public SiteType SiteType { get; set; }
}
