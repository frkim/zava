namespace Zava.Api.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    public int ProductCount { get; set; }
    public SiteType SiteType { get; set; }
    public string Icon { get; set; } = string.Empty;
}
