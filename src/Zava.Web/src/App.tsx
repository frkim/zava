import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { SiteProvider } from './context/SiteContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderDetailPage from './pages/OrderDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import DeliveryPage from './pages/info/DeliveryPage';
import PremiumPage from './pages/info/PremiumPage';
import ReturnsPage from './pages/info/ReturnsPage';
import AfterSalesPage from './pages/info/AfterSalesPage';
import BestPricesPage from './pages/info/BestPricesPage';
import DrivePage from './pages/info/DrivePage';
import TermsPage from './pages/info/TermsPage';
import LegalNoticePage from './pages/info/LegalNoticePage';
import PrivacyPolicyPage from './pages/info/PrivacyPolicyPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <BrowserRouter>
          <SiteProvider>
            <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/cart" element={<CartPage />} />
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
            </Routes>
          </Layout>
        </SiteProvider>
      </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
