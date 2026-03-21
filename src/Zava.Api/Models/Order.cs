namespace Zava.Api.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<CartItem> Items { get; set; } = new();
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; }
    public Address ShippingAddress { get; set; } = new();
    public PaymentMethod PaymentMethod { get; set; }
    public DateTime CreatedAt { get; set; }
    public string TrackingNumber { get; set; } = string.Empty;
}
