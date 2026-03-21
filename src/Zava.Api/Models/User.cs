namespace Zava.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public Address? ShippingAddress { get; set; }
    public Address? BillingAddress { get; set; }
    public PaymentInfo? PaymentInfo { get; set; }
    public DeliveryMethod PreferredDeliveryMethod { get; set; } = DeliveryMethod.Home;
    public PaymentMethod PreferredPaymentMethod { get; set; } = PaymentMethod.CreditCard;
    public bool IsPremium { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Address
{
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}

public class PaymentInfo
{
    public string CardType { get; set; } = string.Empty;
    public string LastFourDigits { get; set; } = string.Empty;
    public string ExpiryDate { get; set; } = string.Empty;
    public string CardHolderName { get; set; } = string.Empty;
}
