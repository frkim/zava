import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme, { getSiteTheme } from './theme';
import { SiteProvider } from './context/SiteProvider';
import { useSite } from './context/SiteContext';
import { LanguageProvider } from './context/LanguageProvider';
import { FeedbackProvider } from './context/FeedbackProvider';
import Layout from './components/Layout';
import { LoadingState } from './components/PageState';
import HomePage from './pages/HomePage';

// The home page ships in the initial bundle; every other route (notably Analytics and its
// charting library) is downloaded only when it is visited.
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const RecipeBasketPage = lazy(() => import('./pages/RecipeBasketPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const DeliveryPage = lazy(() => import('./pages/info/DeliveryPage'));
const PremiumPage = lazy(() => import('./pages/info/PremiumPage'));
const ReturnsPage = lazy(() => import('./pages/info/ReturnsPage'));
const AfterSalesPage = lazy(() => import('./pages/info/AfterSalesPage'));
const BestPricesPage = lazy(() => import('./pages/info/BestPricesPage'));
const DrivePage = lazy(() => import('./pages/info/DrivePage'));
const TermsPage = lazy(() => import('./pages/info/TermsPage'));
const LegalNoticePage = lazy(() => import('./pages/info/LegalNoticePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/info/PrivacyPolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function ThemedApp({ children }: { children: React.ReactNode }) {
  const { config, selectedThemeId } = useSite();
  const currentTheme = config
    ? getSiteTheme(config.currentSiteType, selectedThemeId)
    : theme;
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <SiteProvider>
          <ThemedApp>
            <FeedbackProvider>
              <Layout>
                <Suspense fallback={<LoadingState />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/products/:id" element={<ProductPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/recipe-basket" element={<RecipeBasketPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/info/delivery" element={<DeliveryPage />} />
                    <Route path="/info/premium" element={<PremiumPage />} />
                    <Route path="/info/returns" element={<ReturnsPage />} />
                    <Route path="/info/after-sales" element={<AfterSalesPage />} />
                    <Route path="/info/best-prices" element={<BestPricesPage />} />
                    <Route path="/info/drive" element={<DrivePage />} />
                    <Route path="/info/terms" element={<TermsPage />} />
                    <Route path="/info/legal" element={<LegalNoticePage />} />
                    <Route path="/info/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </Layout>
            </FeedbackProvider>
          </ThemedApp>
        </SiteProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
