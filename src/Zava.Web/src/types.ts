export type SiteType = 'Electronics' | 'Appliances' | 'Cosmetics' | 'Electrical' | 'DIY' | 'Grocery';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'CreditCard' | 'PayPal' | 'ApplePay' | 'GooglePay';

export type PaymentStatus = 'Pending' | 'Success' | 'Failed';

export interface ProductVariant {
  id: number;
  name: string;
  nameEn: string;
  value: string;
  priceAdjustment: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  promoPrice: number | null;
  categoryId: number;
  brand: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isPromo: boolean;
  variants: ProductVariant[];
  tags: string[];
  relatedProductIds: number[];
  createdAt: string;
  siteType: SiteType;
}

export interface Category {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  productCount: number;
  siteType: SiteType;
  icon: string;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verified: boolean;
  helpfulCount: number;
}

export interface CartItem {
  productId: number;
  productName: string;
  variantId: number | null;
  variantName: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  cardType: string;
  lastFourDigits: string;
  expiryDate: string;
  cardHolderName: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  paymentInfo: PaymentInfo | null;
  isPremium: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: string;
  trackingNumber: string;
}

export interface SiteTypeInfo {
  type: SiteType;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
}

export interface SiteConfig {
  currentSiteType: SiteType;
  availableSiteTypes: SiteTypeInfo[];
}

export interface SearchRequest {
  query?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  minRating?: number;
  inStock?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface FacetGroup {
  name: string;
  nameEn: string;
  values: FacetValue[];
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: FacetGroup[];
}

export interface SearchSuggestion {
  productId: number;
  name: string;
  brand: string;
  price: number;
}

export interface HomepageData {
  featuredProducts: Product[];
  bestSellers: Product[];
  newProducts: Product[];
  promoProducts: Product[];
  selectionProducts: Product[];
  topCategories: Category[];
  brands: string[];
}

export interface PaymentResult {
  success: boolean;
  status: PaymentStatus;
  message: string;
  orderId?: number;
  transactionId?: string;
}

export interface CheckoutRequest {
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
}

export interface AnalyticsDashboard {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  totalCustomers: number;
  topProducts: TopProduct[];
  ordersByStatus: Record<string, number>;
  revenueByCategory: Record<string, number>;
  recentSales: DailySales[];
}

export interface TopProduct {
  productId: number;
  name: string;
  brand: string;
  quantitySold: number;
  revenue: number;
}

export interface DailySales {
  date: string;
  orders: number;
  revenue: number;
}
