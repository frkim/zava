import { Link as RouterLink } from 'react-router-dom';
import { Grid, Typography, Box, Paper, Button } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ProductCard from './ProductCard';
import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductGridProps {
  title?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void | Promise<unknown>;
  isProductAdding?: (productId: number) => boolean;
  accentColor?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  viewAllTo?: string;
}

export default function ProductGrid({
  title,
  products,
  onAddToCart,
  isProductAdding,
  accentColor = 'primary',
  viewAllTo,
}: ProductGridProps) {
  const theme = useTheme();
  const { t } = useLanguage();

  if (products.length === 0) return null;

  const accent = theme.palette[accentColor].main;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2, md: 2.5 },
        mb: 4,
        borderRadius: 3,
        borderColor: alpha(accent, 0.22),
        background: `linear-gradient(180deg, ${alpha(accent, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.94)} 34%)`,
        boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.05)}`,
      }}
    >
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            pb: 1.5,
            borderBottom: `1px solid ${alpha(accent, 0.18)}`,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 32,
              borderRadius: 999,
              bgcolor: accent,
              boxShadow: `0 0 0 4px ${alpha(accent, 0.12)}`,
            }}
          />
          <Typography component="h2" variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', flex: 1 }}>
            {title}
          </Typography>
          {viewAllTo && (
            <Button component={RouterLink} to={viewAllTo} size="small" sx={{ whiteSpace: 'nowrap' }}>
              {t('disc.home.viewAll')}
            </Button>
          )}
        </Box>
      )}
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <ProductCard product={product} onAddToCart={onAddToCart} isAdding={isProductAdding?.(product.id) ?? false} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
