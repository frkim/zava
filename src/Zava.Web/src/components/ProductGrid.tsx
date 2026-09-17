import { Grid, Typography, Box, Paper } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductGridProps {
  title?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  accentColor?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

export default function ProductGrid({
  title,
  products,
  onAddToCart,
  accentColor = 'primary',
}: ProductGridProps) {
  const theme = useTheme();

  if (products.length === 0) return null;

  const accent = theme.palette[accentColor].main;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 2.5 },
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
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
