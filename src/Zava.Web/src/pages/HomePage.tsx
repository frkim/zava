import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Chip, Stack, CircularProgress, Alert, Paper,
} from '@mui/material';
import ProductGrid from '../components/ProductGrid';
import { getHomepage, addToCart } from '../api';
import type { HomepageData, Product } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
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
        <Typography variant="h4" gutterBottom>Bienvenue sur Zava</Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Découvrez nos sélections, meilleures ventes et nouveautés. Profitez de la livraison offerte et de nos prix garantis.
        </Typography>
      </Paper>

      {/* Top Categories */}
      {data.topCategories.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Top Catégories</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.topCategories.map((cat) => (
              <Chip
                key={cat.id}
                label={`${cat.name} (${cat.productCount})`}
                onClick={() => navigate(`/search?categoryId=${cat.id}`)}
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <ProductGrid title="⭐ Sélection pour vous" products={data.selectionProducts} onAddToCart={handleAddToCart} />
      <ProductGrid title="🏆 Meilleures ventes" products={data.bestSellers} onAddToCart={handleAddToCart} />
      <ProductGrid title="🆕 Nouveautés" products={data.newProducts} onAddToCart={handleAddToCart} />
      <ProductGrid title="🔥 Promotions" products={data.promoProducts} onAddToCart={handleAddToCart} />
      <ProductGrid title="💎 Produits en avant" products={data.featuredProducts} onAddToCart={handleAddToCart} />

      {/* Brands */}
      {data.brands.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Nos Marques</Typography>
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
        <Typography variant="h6" gutterBottom>⭐ Abonnement Premium</Typography>
        <Typography variant="body2">
          Livraison express gratuite, accès aux ventes privées, retours étendus à 30 jours, et bien plus encore.
        </Typography>
      </Paper>
    </Box>
  );
}
