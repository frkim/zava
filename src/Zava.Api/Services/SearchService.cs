namespace Zava.Api.Services;

using Zava.Api.Models;

public class SearchService
{
    private readonly DataStore _store;

    public SearchService(DataStore store)
    {
        _store = store;
    }

    public SearchResult Search(SearchRequest request)
    {
        var query = _store.Products.AsEnumerable();

        // Full-text search across name, description, brand, tags
        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var terms = request.Query.ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            query = query.Where(p => terms.All(t =>
                p.Name.Contains(t, StringComparison.OrdinalIgnoreCase) ||
                p.NameEn.Contains(t, StringComparison.OrdinalIgnoreCase) ||
                p.Description.Contains(t, StringComparison.OrdinalIgnoreCase) ||
                p.Brand.Contains(t, StringComparison.OrdinalIgnoreCase) ||
                p.Tags.Any(tag => tag.Contains(t, StringComparison.OrdinalIgnoreCase))
            ));
        }

        // Filters
        if (request.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == request.CategoryId.Value);

        if (request.MinPrice.HasValue)
            query = query.Where(p => (p.PromoPrice ?? p.Price) >= request.MinPrice.Value);

        if (request.MaxPrice.HasValue)
            query = query.Where(p => (p.PromoPrice ?? p.Price) <= request.MaxPrice.Value);

        if (!string.IsNullOrWhiteSpace(request.Brand))
            query = query.Where(p => p.Brand.Equals(request.Brand, StringComparison.OrdinalIgnoreCase));

        if (request.MinRating.HasValue)
            query = query.Where(p => p.Rating >= request.MinRating.Value);

        if (request.InStock == true)
            query = query.Where(p => p.Stock > 0);

        if (request.EcoResponsible == true)
            query = query.Where(p => p.Sustainability != null && p.Sustainability.OverallScore >= 6.0);

        var filtered = query.ToList();

        // Build facets from filtered results (before pagination)
        var facets = BuildFacets(filtered);

        // Sort
        filtered = (request.SortBy?.ToLowerInvariant()) switch
        {
            "price" => request.SortDescending
                ? filtered.OrderByDescending(p => p.PromoPrice ?? p.Price).ToList()
                : filtered.OrderBy(p => p.PromoPrice ?? p.Price).ToList(),
            "rating" => filtered.OrderByDescending(p => p.Rating).ToList(),
            "name" => request.SortDescending
                ? filtered.OrderByDescending(p => p.Name).ToList()
                : filtered.OrderBy(p => p.Name).ToList(),
            "newest" => filtered.OrderByDescending(p => p.CreatedAt).ToList(),
            _ => filtered // relevance = keep current order
        };

        // Pagination
        int totalCount = filtered.Count;
        int page = Math.Max(1, request.Page);
        int pageSize = Math.Clamp(request.PageSize, 1, 100);
        int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var paged = filtered.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return new SearchResult
        {
            Products = paged,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            Facets = facets
        };
    }

    public List<SearchSuggestion> GetSuggestions(string query)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            return new List<SearchSuggestion>();

        var q = query.ToLowerInvariant();
        return _store.Products
            .Where(p =>
                p.Name.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                p.Brand.Contains(q, StringComparison.OrdinalIgnoreCase))
            .Take(8)
            .Select(p => new SearchSuggestion
            {
                ProductId = p.Id,
                Name = p.Name,
                Brand = p.Brand,
                Price = p.PromoPrice ?? p.Price
            })
            .ToList();
    }

    private List<FacetGroup> BuildFacets(List<Product> products)
    {
        var facets = new List<FacetGroup>();

        // Brand facet
        var brands = products
            .GroupBy(p => p.Brand)
            .OrderByDescending(g => g.Count())
            .Select(g => new FacetValue { Value = g.Key, Count = g.Count() })
            .ToList();
        if (brands.Count > 0)
            facets.Add(new FacetGroup { Name = "Marque", NameEn = "Brand", Values = brands });

        // Category facet
        var categories = products
            .GroupBy(p => p.CategoryId)
            .Select(g =>
            {
                var cat = _store.Categories.FirstOrDefault(c => c.Id == g.Key);
                return new FacetValue { Value = cat?.Name ?? $"Cat {g.Key}", FilterValue = g.Key.ToString(), Count = g.Count() };
            })
            .OrderByDescending(v => v.Count)
            .ToList();
        if (categories.Count > 0)
            facets.Add(new FacetGroup { Name = "Catégorie", NameEn = "Category", Values = categories });

        // Price range facet
        var priceRanges = new (string Label, decimal Min, decimal Max)[]
        {
            ("0 - 25 €", 0, 25),
            ("25 - 50 €", 25, 50),
            ("50 - 100 €", 50, 100),
            ("100 - 250 €", 100, 250),
            ("250 - 500 €", 250, 500),
            ("500 € et plus", 500, decimal.MaxValue)
        };
        var priceValues = priceRanges
            .Select(r => new FacetValue
            {
                Value = r.Label,
                FilterValue = $"{r.Min}-{(r.Max == decimal.MaxValue ? "" : r.Max.ToString())}",
                Count = products.Count(p => (p.PromoPrice ?? p.Price) >= r.Min && (p.PromoPrice ?? p.Price) < r.Max)
            })
            .Where(v => v.Count > 0)
            .ToList();
        if (priceValues.Count > 0)
            facets.Add(new FacetGroup { Name = "Prix", NameEn = "Price", Values = priceValues });

        // Rating facet
        var ratingValues = Enumerable.Range(1, 5)
            .Reverse()
            .Select(r => new FacetValue
            {
                Value = $"{r} étoiles et plus",
                FilterValue = r.ToString(),
                Count = products.Count(p => p.Rating >= r)
            })
            .Where(v => v.Count > 0)
            .ToList();
        if (ratingValues.Count > 0)
            facets.Add(new FacetGroup { Name = "Avis clients", NameEn = "Rating", Values = ratingValues });

        // Eco-responsible facet
        var ecoCount = products.Count(p => p.Sustainability != null && p.Sustainability.OverallScore >= 6.0);
        if (ecoCount > 0)
        {
            facets.Add(new FacetGroup
            {
                Name = "Écoresponsable",
                NameEn = "Eco-Responsible",
                Values = [new FacetValue { Value = "Produit écoresponsable", FilterValue = "true", Count = ecoCount }]
            });
        }

        return facets;
    }
}
