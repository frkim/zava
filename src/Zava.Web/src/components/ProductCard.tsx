import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card, CardContent, CardActions, Typography, Button, Box, Chip, Rating, Stack,
} from '@mui/material';
import { ShoppingCart, FiberNew, LocalOffer, Star, Recycling } from '@mui/icons-material';
import type { Product } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { API_BASE } from '../api';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void | Promise<unknown>;
  isAdding?: boolean;
}

export default function ProductCard({ product, onAddToCart, isAdding = false }: ProductCardProps) {
  const { lang, t } = useLanguage();
  const { price } = useFormatters();
  const { config } = useSite();
  const [imgError, setImgError] = useState(false);

  const effectivePrice = product.promoPrice ?? product.price;
  const discount = product.promoPrice
    ? Math.round((1 - product.promoPrice / product.price) * 100)
    : 0;
  const productName = lang === 'en' && product.nameEn ? product.nameEn : product.name;
  const siteType = config?.currentSiteType ?? 'Electronics';
  const thumbUrl = `${API_BASE}/images/products/${siteType}/${product.id}/1_medium.jpg`;
  const productTo = `/products/${product.id}`;
  const secondLifeCondition = product.secondLife
    ? (lang === 'en' && product.secondLife.conditionEn ? product.secondLife.conditionEn : product.secondLife.condition)
    : '';
  const secondLifeLabel = product.secondLife && product.secondLife.originalPrice > 0
    ? `${secondLifeCondition} — ${t('secondLife.savings')} ${Math.round((1 - product.price / product.secondLife.originalPrice) * 100)}%`
    : t('secondLife.badge');

  const badges = [
    product.isPromo ? { key: 'promo', label: `-${discount}%`, color: 'error' as const, icon: <LocalOffer /> } : null,
    product.isNew ? { key: 'new', label: t('product.new'), color: 'info' as const, icon: <FiberNew /> } : null,
    product.isBestSeller ? { key: 'bestSeller', label: t('product.bestSeller'), color: 'secondary' as const, icon: <Star /> } : null,
  ].filter((badge): badge is NonNullable<typeof badge> => badge != null).slice(0, 2);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
      }}
    >
      <Box
        sx={{
          height: { xs: 140, sm: 180 },
          aspectRatio: '4 / 3',
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
            width={320}
            height={240}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Typography variant="h3" sx={{ opacity: 0.2, fontWeight: 700 }}>
            {productName.charAt(0)}
          </Typography>
        )}
        {badges.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 8, left: 8, maxWidth: 'calc(100% - 48px)', flexWrap: 'wrap', gap: 0.5 }}>
            {badges.map((badge) => (
              <Chip key={badge.key} label={badge.label} size="small" color={badge.color} icon={badge.icon} />
            ))}
          </Stack>
        )}
        {product.isSecondLife && (
          <Box
            role="img"
            aria-label={secondLifeLabel}
            title={secondLifeLabel}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 30,
              height: 30,
              borderRadius: '50%',
              bgcolor: '#00796b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1,
            }}
          >
            <Recycling sx={{ color: 'white', fontSize: 18 }} />
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: 1, p: { xs: 1.25, sm: 2 }, pb: { xs: 0.5, sm: 1 } }}>
        <Typography variant="caption" color="text.secondary" gutterBottom noWrap component="p">
          {product.brand}
        </Typography>
        <Typography
          component={RouterLink}
          to={productTo}
          variant="subtitle2"
          fontWeight={700}
          sx={{
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'text.primary',
            textDecoration: 'none',
            position: 'static',
            '&:hover': { textDecoration: 'underline' },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              zIndex: 1,
            },
          }}
        >
          {productName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, minWidth: 0 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' } }} />
          <Typography variant="caption" color="text.secondary">({product.reviewCount})</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
          <Typography variant="h6" color="primary" fontWeight={800} sx={{ whiteSpace: 'nowrap', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {price(effectivePrice)}
          </Typography>
          {product.promoPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
              {price(product.price)}
            </Typography>
          )}
          {product.isSecondLife && product.secondLife && !product.promoPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
              {price(product.secondLife.originalPrice)}
            </Typography>
          )}
        </Box>

        {product.stock === 0 && (
          <Typography variant="caption" color="error" fontWeight={600}>{t('product.outOfStock')}</Typography>
        )}
      </CardContent>

      <CardActions sx={{ px: { xs: 1.25, sm: 2 }, pb: { xs: 1.25, sm: 2 }, pt: 0, position: 'relative', zIndex: 2 }}>
        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<ShoppingCart />}
          disabled={product.stock === 0 || isAdding}
          aria-label={isAdding ? t('common.adding') : t('product.addToCart')}
          onClick={() => { void onAddToCart?.(product); }}
          sx={{ minHeight: 40, px: { xs: 1, sm: 2 } }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {isAdding ? t('common.adding') : t('product.addToCart')}
          </Box>
        </Button>
      </CardActions>
    </Card>
  );
}
