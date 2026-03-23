import type {
  SiteConfig, HomepageData, Product, Category, SearchRequest, SearchResult,
  SearchSuggestion, Cart, PaymentResult, CheckoutRequest, Order, User,
  AnalyticsDashboard, Review, ProductImage, CrossSellOffer,
} from './types';

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5014';
const API = `${API_BASE}/api`;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error(
      'Le serveur ne répond pas. Vérifiez que le backend est lancé sur ' + API_BASE
    );
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

// Config
export const getConfig = () => request<SiteConfig>(`${API}/config`);
export const changeSiteType = (siteType: string) =>
  request<SiteConfig>(`${API}/config/site-type`, {
    method: 'PUT',
    body: JSON.stringify({ siteType }),
  });
export const resetData = () =>
  request<{ message: string }>(`${API}/config/reset`, { method: 'POST' });

// Homepage
export const getHomepage = () => request<HomepageData>(`${API}/homepage`);

// Products
export const getProducts = () => request<Product[]>(`${API}/products`);
export const getProduct = (id: number) =>
  request<{ product: Product; reviews: Review[]; relatedProducts: Product[]; category: Category | null; images: ProductImage[] }>(`${API}/products/${id}`);
export const createProduct = (data: {
  name: string; description: string; price: number; categoryId: number; brand: string; stock: number;
}) =>
  request<Product>(`${API}/products`, { method: 'POST', body: JSON.stringify(data) });

// Categories
export const getCategories = () => request<Category[]>(`${API}/categories`);
export const getCategory = (id: number) =>
  request<{ category: Category; products: Product[] }>(`${API}/categories/${id}`);

// Search
export const searchProducts = (req: SearchRequest) =>
  request<SearchResult>(`${API}/search`, { method: 'POST', body: JSON.stringify(req) });
export const getSuggestions = (q: string) =>
  request<SearchSuggestion[]>(`${API}/search/suggestions?q=${encodeURIComponent(q)}`);

// Cart
export const getCart = () => request<Cart>(`${API}/cart`);
export const addToCart = (productId: number, quantity: number, variantId?: number) =>
  request<Cart>(`${API}/cart/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, variantId, quantity }),
  });
export const updateCartItem = (productId: number, quantity: number) =>
  request<Cart>(`${API}/cart/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
export const removeCartItem = (productId: number) =>
  request<Cart>(`${API}/cart/items/${productId}`, { method: 'DELETE' });
export const clearCart = () => request<Cart>(`${API}/cart`, { method: 'DELETE' });

// Cross-sell
export const getCrossSell = (productId: number) =>
  request<CrossSellOffer>(`${API}/products/${productId}/cross-sell`);
export const addWarrantyToCart = (productId: number, warrantyName: string, warrantyPrice: number) =>
  request<Cart>(`${API}/cart/warranty`, {
    method: 'POST',
    body: JSON.stringify({ productId, warrantyName, warrantyPrice }),
  });

// Checkout
export const checkout = (data: CheckoutRequest) =>
  request<PaymentResult>(`${API}/checkout`, { method: 'POST', body: JSON.stringify(data) });

// Orders
export const getOrders = () => request<Order[]>(`${API}/orders`);
export const getOrder = (id: number) => request<Order>(`${API}/orders/${id}`);

// User
export const getUser = () => request<User>(`${API}/user`);
export const updateUser = (data: User) =>
  request<User>(`${API}/user`, { method: 'PUT', body: JSON.stringify(data) });

// Reviews
export const getProductReviews = (productId: number) =>
  request<Review[]>(`${API}/products/${productId}/reviews`);

// Analytics
export const getAnalytics = () => request<AnalyticsDashboard>(`${API}/analytics`);
