namespace Zava.Api.Models;

public enum SiteType
{
    Electronics,
    Appliances,
    Cosmetics,
    Electrical,
    DIY,
    Grocery
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
