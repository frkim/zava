import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Chip, Stack, CircularProgress, Alert, Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  LocalShipping, Verified, TrendingUp,
} from '@mui/icons-material';
import ProductGrid from '../components/ProductGrid';
import { getHomepage, addToCart } from '../api';
import type { HomepageData, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const theme = useTheme();
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
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light || theme.palette.primary.main} 50%, ${theme.palette.secondary?.main || theme.palette.primary.dark} 100%)`,
          color: 'white',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -40,
            left: '30%',
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          },
        }}
      >
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
          {t('home.welcome')}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600, position: 'relative', zIndex: 1 }}>
          {t('home.intro')}
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mt: 3, position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 1 }}>
          <Box onClick={() => navigate('/profile')} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.85, cursor: 'pointer', '&:hover': { opacity: 1, textDecoration: 'underline' } }}>
            <LocalShipping fontSize="small" />
            <Typography variant="body2" fontWeight={600}>{lang === 'en' ? 'Free delivery' : 'Livraison offerte'}</Typography>
          </Box>
          <Box onClick={() => navigate('/search')} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.85, cursor: 'pointer', '&:hover': { opacity: 1, textDecoration: 'underline' } }}>
            <Verified fontSize="small" />
            <Typography variant="body2" fontWeight={600}>{lang === 'en' ? 'Guaranteed prices' : 'Prix garantis'}</Typography>
          </Box>
          <Box onClick={() => navigate('/search?sort=bestSeller')} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.85, cursor: 'pointer', '&:hover': { opacity: 1, textDecoration: 'underline' } }}>
            <TrendingUp fontSize="small" />
            <Typography variant="body2" fontWeight={600}>{lang === 'en' ? 'Best sellers' : 'Meilleures ventes'}</Typography>
          </Box>
        </Stack>
      </Box>

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

      {/* Second Life products */}
      {data.secondLifeProducts && data.secondLifeProducts.length > 0 && (
        <ProductGrid title={t('secondLife.homeSection')} products={data.secondLifeProducts.slice(0, 8)} onAddToCart={handleAddToCart} />
      )}

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
      <Paper
        onClick={() => navigate('/profile')}
        sx={{ p: 3, mb: 4, bgcolor: 'secondary.main', color: 'white', borderRadius: 2, cursor: 'pointer', transition: 'opacity 0.2s', '&:hover': { opacity: 0.9 } }}
      >
        <Typography variant="h6" gutterBottom>{t('home.premium')}</Typography>
        <Typography variant="body2">
          {t('home.premiumDesc')}
        </Typography>
      </Paper>
    </Box>
  );
}
