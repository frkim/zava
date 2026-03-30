import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardActions, Typography, Button, Box, Chip, Rating, Stack, Tooltip,
} from '@mui/material';
import { ShoppingCart, FiberNew, LocalOffer, Star, Recycling } from '@mui/icons-material';
import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { API_BASE } from '../api';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { config } = useSite();
  const [imgError, setImgError] = useState(false);

  const effectivePrice = product.promoPrice ?? product.price;
  const discount = product.promoPrice
    ? Math.round((1 - product.promoPrice / product.price) * 100)
    : 0;
  const productName = lang === 'en' && product.nameEn ? product.nameEn : product.name;
  const siteType = config?.currentSiteType ?? 'Electronics';
  const thumbUrl = `${API_BASE}/images/products/${siteType}/${product.id}/1_medium.jpg`;

  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <Box
        sx={{
          height: 180,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {!imgError ? (
          <Box
            component="img"
            src={thumbUrl}
            alt={productName}
            onError={() => setImgError(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Typography variant="h3" sx={{ opacity: 0.2, fontWeight: 700 }}>
            {productName.charAt(0)}
          </Typography>
        )}
        <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 8, left: 8 }}>
          {product.isNew && <Chip label={t('product.new')} size="small" color="info" icon={<FiberNew />} />}
          {product.isPromo && <Chip label={`-${discount}%`} size="small" color="error" icon={<LocalOffer />} />}
          {product.isBestSeller && <Chip label={t('product.bestSeller')} size="small" color="secondary" icon={<Star />} />}
        </Stack>
        {product.isSecondLife && (
          <Tooltip title={
            product.secondLife && product.secondLife.originalPrice > 0
              ? `${lang === 'en' ? product.secondLife.conditionEn : product.secondLife.condition} — ${t('secondLife.savings')} ${Math.round((1 - product.price / product.secondLife.originalPrice) * 100)}%`
              : t('secondLife.badge')
          }>
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: '#00796b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Recycling sx={{ color: 'white', fontSize: 18 }} />
            </Box>
          </Tooltip>
        )}
      </Box>

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {product.brand}
        </Typography>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {productName}
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
          {product.isSecondLife && product.secondLife && !product.promoPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              {product.secondLife.originalPrice.toFixed(2)} €
            </Typography>
          )}
        </Box>

        {product.stock === 0 && (
          <Typography variant="caption" color="error" fontWeight={600}>{t('product.outOfStock')}</Typography>
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
          {t('product.addToCart')}
        </Button>
      </CardActions>
    </Card>
  );
}
