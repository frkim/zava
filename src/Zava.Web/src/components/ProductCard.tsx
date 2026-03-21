import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardActions, Typography, Button, Box, Chip, Rating, Stack,
} from '@mui/material';
import { ShoppingCart, FiberNew, LocalOffer, Star } from '@mui/icons-material';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();

  const effectivePrice = product.promoPrice ?? product.price;
  const discount = product.promoPrice
    ? Math.round((1 - product.promoPrice / product.price) * 100)
    : 0;

  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Placeholder visuel au lieu d'une image */}
      <Box
        sx={{
          height: 180,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Typography variant="h3" sx={{ opacity: 0.2, fontWeight: 700 }}>
          {product.name.charAt(0)}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 8, left: 8 }}>
          {product.isNew && <Chip label="Nouveau" size="small" color="info" icon={<FiberNew />} />}
          {product.isPromo && <Chip label={`-${discount}%`} size="small" color="error" icon={<LocalOffer />} />}
          {product.isBestSeller && <Chip label="Best-seller" size="small" color="secondary" icon={<Star />} />}
        </Stack>
      </Box>

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {product.brand}
        </Typography>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">({product.reviewCount})</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6" color="primary" fontWeight={700}>
            {effectivePrice.toFixed(2)} €
          </Typography>
          {product.promoPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              {product.price.toFixed(2)} €
            </Typography>
          )}
        </Box>

        {product.stock === 0 && (
          <Typography variant="caption" color="error" fontWeight={600}>Rupture de stock</Typography>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<ShoppingCart />}
          disabled={product.stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
        >
          Ajouter au panier
        </Button>
      </CardActions>
    </Card>
  );
}
