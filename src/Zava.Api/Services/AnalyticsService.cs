namespace Zava.Api.Services;

using Zava.Api.Models;

public class AnalyticsService
{
    private readonly DataStore _store;

    public AnalyticsService(DataStore store)
    {
        _store = store;
    }

    public AnalyticsDashboard GetDashboard()
    {
        var orders = _store.Orders;
        var products = _store.Products;
        var categories = _store.Categories;
        var users = _store.Users;

        decimal totalRevenue = orders.Sum(o => o.Total);
        int totalOrders = orders.Count;
        decimal avgOrderValue = totalOrders > 0 ? Math.Round(totalRevenue / totalOrders, 2) : 0;

        // Top products by quantity sold across all orders
        var productSales = orders
            .SelectMany(o => o.Items)
            .GroupBy(i => i.ProductId)
            .Select(g =>
            {
                var product = products.FirstOrDefault(p => p.Id == g.Key);
                return new TopProduct
                {
                    ProductId = g.Key,
                    Name = product?.Name ?? "Inconnu",
                    Brand = product?.Brand ?? "",
                    QuantitySold = g.Sum(i => i.Quantity),
                    Revenue = g.Sum(i => i.Subtotal)
                };
            })
            .OrderByDescending(tp => tp.Revenue)
            .Take(10)
            .ToList();

        // Orders by status
        var ordersByStatus = orders
            .GroupBy(o => o.Status.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        // Revenue by category
        var revenueByCategory = orders
            .SelectMany(o => o.Items)
            .GroupBy(i =>
            {
                var product = products.FirstOrDefault(p => p.Id == i.ProductId);
                if (product == null) return "Autre";
                var cat = categories.FirstOrDefault(c => c.Id == product.CategoryId);
                return cat?.Name ?? "Autre";
            })
            .ToDictionary(g => g.Key, g => Math.Round(g.Sum(i => i.Subtotal), 2));

        // Recent daily sales (last 30 days)
        var recentSales = orders
            .Where(o => o.CreatedAt >= DateTime.Now.AddDays(-30))
            .GroupBy(o => DateOnly.FromDateTime(o.CreatedAt))
            .OrderBy(g => g.Key)
            .Select(g => new DailySales
            {
                Date = g.Key,
                Orders = g.Count(),
                Revenue = Math.Round(g.Sum(o => o.Total), 2)
            })
            .ToList();

        return new AnalyticsDashboard
        {
            TotalRevenue = Math.Round(totalRevenue, 2),
            TotalOrders = totalOrders,
            AverageOrderValue = avgOrderValue,
            TotalProducts = products.Count,
            TotalCustomers = users.Count,
            TopProducts = productSales,
            OrdersByStatus = ordersByStatus,
            RevenueByCategory = revenueByCategory,
            RecentSales = recentSales
        };
    }
}
