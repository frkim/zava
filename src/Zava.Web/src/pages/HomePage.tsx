import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Chip, Stack, CircularProgress, Alert, Paper,
} from '@mui/material';
import ProductGrid from '../components/ProductGrid';
import { getHomepage, addToCart } from '../api';
import type { HomepageData, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getHomepage()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
    } catch { /* ignore */ }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  return (
    <Box>
      {/* Hero banner */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>{t('home.welcome')}</Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {t('home.intro')}
        </Typography>
      </Paper>

      {/* Top Categories */}
      {data.topCategories.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{t('home.topCategories')}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.topCategories.map((cat) => (
              <Chip
                key={cat.id}
                label={`${lang === 'en' && cat.nameEn ? cat.nameEn : cat.name} (${cat.productCount})`}
                onClick={() => navigate(`/search?categoryId=${cat.id}`)}
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <ProductGrid title={t('home.selection')} products={data.selectionProducts.slice(0, 5)} onAddToCart={handleAddToCart} />
      <ProductGrid title={t('home.bestSellers')} products={data.bestSellers.slice(0, 5)} onAddToCart={handleAddToCart} />
      <ProductGrid title={t('home.newArrivals')} products={data.newProducts.slice(0, 5)} onAddToCart={handleAddToCart} />
      <ProductGrid title={t('home.promotions')} products={data.promoProducts.slice(0, 5)} onAddToCart={handleAddToCart} />
      <ProductGrid title={t('home.featured')} products={data.featuredProducts.slice(0, 5)} onAddToCart={handleAddToCart} />

      {/* Brands */}
      {data.brands.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{t('home.brands')}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.brands.map((brand) => (
              <Chip
                key={brand}
                label={brand}
                onClick={() => navigate(`/search?brand=${encodeURIComponent(brand)}`)}
                variant="filled"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Premium banner */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'secondary.main', color: 'white', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>{t('home.premium')}</Typography>
        <Typography variant="body2">
          {t('home.premiumDesc')}
        </Typography>
      </Paper>
    </Box>
  );
}
