namespace Zava.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? PromoPrice { get; set; }
    public int CategoryId { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public int Stock { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsNew { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsPromo { get; set; }
    public List<ProductVariant> Variants { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public List<int> RelatedProductIds { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public SiteType SiteType { get; set; }
}

public class ProductVariant
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public decimal PriceAdjustment { get; set; }
    public int Stock { get; set; }
}
