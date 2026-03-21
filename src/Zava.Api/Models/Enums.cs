namespace Zava.Api.Models;

public enum SiteType
{
    Electronics,    // Fnac-like
    Appliances,     // Boulanger/Darty-like
    Cosmetics,      // Sephora/L'Oréal-like
    Electrical,     // Rexel/Sonepar-like
    DIY,            // Leroy Merlin-like
    Grocery         // Carrefour/Leclerc/Auchan-like
}

public enum PaymentStatus
{
    Pending,
    Success,
    Failed
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
    GooglePay,
    BankTransfer,
    GiftCard
}

public enum DeliveryMethod
{
    Home,
    Relay,
    Locker,
    Store,
    Drive,
    Express
}
