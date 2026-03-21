import { Grid, Typography, Box } from '@mui/material';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductGridProps {
  title?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({ title, products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography variant="h5" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
