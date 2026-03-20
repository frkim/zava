namespace Zava.Api.Models;

public enum SiteType
{
    Electronics,    // Fnac-like
    Appliances,     // Boulanger/Darty-like
    Cosmetics,      // Sephora/L'Oréal-like
    Electrical,     // Rexel/Sonepar-like
    DIY             // Leroy Merlin-like
}

public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

public enum PaymentMethod
{
    CreditCard,
    PayPal,
    ApplePay,
    GooglePay
}
