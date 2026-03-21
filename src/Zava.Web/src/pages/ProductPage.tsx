import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Grid, Chip, Rating, Button, CircularProgress, Alert,
  Paper, Divider, Stack, ToggleButtonGroup, ToggleButton, Snackbar,
  Card, CardContent, Dialog, IconButton,
} from '@mui/material';
import { ShoppingCart, LocalOffer, FiberNew, ArrowBack, Category as CategoryIcon, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { getProduct, addToCart, API_BASE } from '../api';
import type { Product, Review, Category, ProductImage } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState('');
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(parseInt(id))
      .then((data) => {
        setProduct(data.product);
        setReviews(data.reviews);
        setRelatedProducts(data.relatedProducts);
        setCategory(data.category);
        setImages(data.images ?? []);
        setSelectedImageIdx(0);
        if (data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0].id);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity, selectedVariant ?? undefined);
      setSnackbar(t('product.addedToCart'));
    } catch {
      setSnackbar(t('product.addError'));
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return <Alert severity="error">{t('product.notFound')}</Alert>;

  const effectivePrice = product.promoPrice ?? product.price;
  const selectedVar = product.variants.find(v => v.id === selectedVariant);
  const finalPrice = effectivePrice + (selectedVar?.priceAdjustment ?? 0);
  const discount = product.promoPrice ? Math.round((1 - product.promoPrice / product.price) * 100) : 0;
  const productName = lang === 'en' && product.nameEn ? product.nameEn : product.name;
  const productDescription = lang === 'en' && product.descriptionEn ? product.descriptionEn : product.description;

  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length > 0 ? Math.round(reviews.filter(rev => rev.rating === r).length / reviews.length * 100) : 0,
  }));

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>{t('product.back')}</Button>

      <Grid container spacing={4}>
        {/* Image gallery */}
        <Grid size={{ xs: 12, md: 5 }}>
          {images.length > 0 ? (
            <Box>
              {/* Main image with zoom */}
              <Paper
                ref={mainImageRef}
                sx={{
                  height: 400,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'crosshair',
                  bgcolor: 'grey.50',
                }}
                onMouseEnter={() => setZoomVisible(true)}
                onMouseLeave={() => setZoomVisible(false)}
                onMouseMove={(e) => {
                  if (!mainImageRef.current) return;
                  const rect = mainImageRef.current.getBoundingClientRect();
                  setZoomPos({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                  });
                }}
                onClick={() => setLightboxOpen(true)}
              >
                <Box
                  component="img"
                  src={`${API_BASE}${images[selectedImageIdx].main}`}
                  alt={productName}
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                {/* Zoom lens overlay */}
                {zoomVisible && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      backgroundImage: `url(${API_BASE}${images[selectedImageIdx].main})`,
                      backgroundSize: '250%',
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundRepeat: 'no-repeat',
                      opacity: 1,
                      zIndex: 2,
                    }}
                  />
                )}
              </Paper>

              {/* Thumbnails */}
              {images.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
                  {images.map((img, idx) => (
                    <Box
                      key={img.index}
                      onClick={() => setSelectedImageIdx(idx)}
                      sx={{
                        width: 64,
                        height: 64,
                        border: idx === selectedImageIdx ? '2px solid' : '2px solid transparent',
                        borderColor: idx === selectedImageIdx ? 'primary.main' : 'transparent',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        opacity: idx === selectedImageIdx ? 1 : 0.6,
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <Box
                        component="img"
                        src={`${API_BASE}${img.thumb}`}
                        alt={`${productName} ${idx + 1}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          ) : (
            <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
              <Typography variant="h1" sx={{ opacity: 0.15, fontWeight: 700 }}>{productName.charAt(0)}</Typography>
            </Paper>
          )}

          {/* Lightbox dialog */}
          <Dialog
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { bgcolor: 'black', position: 'relative' } }}
          >
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10 }}
              aria-label={t('product.close')}
            >
              <Close />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', position: 'relative' }}>
              {images.length > 1 && (
                <IconButton
                  onClick={() => setSelectedImageIdx((prev) => (prev - 1 + images.length) % images.length)}
                  sx={{ position: 'absolute', left: 8, color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  aria-label={t('product.previousImage')}
                >
                  <ChevronLeft fontSize="large" />
                </IconButton>
              )}

              {images.length > 0 && (
                <Box
                  component="img"
                  src={`${API_BASE}${images[selectedImageIdx].main}`}
                  alt={productName}
                  sx={{ maxWidth: '90%', maxHeight: '70vh', objectFit: 'contain' }}
                />
              )}

              {images.length > 1 && (
                <IconButton
                  onClick={() => setSelectedImageIdx((prev) => (prev + 1) % images.length)}
                  sx={{ position: 'absolute', right: 8, color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  aria-label={t('product.nextImage')}
                >
                  <ChevronRight fontSize="large" />
                </IconButton>
              )}
            </Box>

            {/* Lightbox thumbnails */}
            {images.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', py: 2 }}>
                {images.map((img, idx) => (
                  <Box
                    key={img.index}
                    onClick={() => setSelectedImageIdx(idx)}
                    sx={{
                      width: 56,
                      height: 56,
                      border: idx === selectedImageIdx ? '2px solid white' : '2px solid transparent',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      opacity: idx === selectedImageIdx ? 1 : 0.5,
                      transition: 'all 0.2s',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <Box
                      component="img"
                      src={`${API_BASE}${img.thumb}`}
                      alt={`${productName} ${idx + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Dialog>
        </Grid>

        {/* Product info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {product.isNew && <Chip label={t('product.new')} size="small" color="info" icon={<FiberNew />} />}
            {product.isPromo && <Chip label={`-${discount}%`} size="small" color="error" icon={<LocalOffer />} />}
            {product.isBestSeller && <Chip label={t('product.bestSeller')} size="small" color="secondary" />}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">{product.brand} · SKU: {product.sku}</Typography>
            {category && (
              <Chip
                icon={<CategoryIcon />}
                label={lang === 'en' && category.nameEn ? category.nameEn : category.name}
                size="small"
                variant="outlined"
                clickable
                onClick={() => navigate(`/search?categoryId=${category.id}`)}
              />
            )}
          </Stack>
          <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>{productName}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.rating.toFixed(1)} ({product.reviewCount} {t('product.reviews')})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2 }}>
            <Typography variant="h4" color="primary" fontWeight={700}>{finalPrice.toFixed(2)} €</Typography>
            {product.promoPrice && (
              <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {product.price.toFixed(2)} €
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>{productDescription}</Typography>

          {/* Variants */}
          {product.variants.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('product.variant')}</Typography>
              <ToggleButtonGroup
                value={selectedVariant}
                exclusive
                onChange={(_, v) => v !== null && setSelectedVariant(v)}
                size="small"
              >
                {product.variants.map((v) => (
                  <ToggleButton key={v.id} value={v.id}>
                    {lang === 'en' && v.nameEn ? v.nameEn : v.name}
                    {v.priceAdjustment !== 0 && (
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        ({v.priceAdjustment > 0 ? '+' : ''}{v.priceAdjustment.toFixed(2)} €)
                      </Typography>
                    )}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Stock & Add to cart */}
          <Typography variant="body2" sx={{ mb: 2 }} color={product.stock > 0 ? 'success.main' : 'error.main'}>
            {product.stock > 0 ? `${t('product.inStock')} (${product.stock} ${t('product.available')})` : t('product.outOfStock')}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
            <Typography>{quantity}</Typography>
            <Button variant="outlined" size="small" onClick={() => setQuantity(quantity + 1)}>+</Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              {t('product.addToCart')} — {(finalPrice * quantity).toFixed(2)} €
            </Button>
          </Stack>

          {/* Tags */}
          {product.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
              {product.tags.map((tag) => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
            </Stack>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Reviews Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>{t('product.customerReviews')} ({reviews.length})</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h2" fontWeight={700}>{product.rating.toFixed(1)}</Typography>
            <Rating value={product.rating} precision={0.1} readOnly size="large" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('product.basedOn')} {reviews.length} {t('product.reviewsCount')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {ratingDistribution.map(({ stars, count, pct }) => (
              <Box key={stars} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="caption" sx={{ minWidth: 30 }}>{stars} ★</Typography>
                <Box sx={{ flex: 1, height: 8, bgcolor: 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
                  <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: 'secondary.main' }} />
                </Box>
                <Typography variant="caption" sx={{ minWidth: 30 }}>{count}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {reviews.slice(0, visibleReviews).map((review) => (
              <Card key={review.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{review.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.userName} {review.verified && `✓ ${t('product.verifiedPurchase')}`}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                  <Typography variant="body2">{review.comment}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {new Date(review.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR')} · {review.helpfulCount} {t('product.helpfulCount')}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {reviews.length > visibleReviews && (
              <Button
                variant="outlined"
                onClick={() => setVisibleReviews((prev) => prev + 5)}
                sx={{ alignSelf: 'center' }}
              >
                {t('product.viewMoreReviews')} ({reviews.length - visibleReviews})
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{t('product.relatedProducts')}</Typography>
          <Grid container spacing={2}>
            {relatedProducts.slice(0, 4).map((p) => (
              <Grid key={p.id} size={{ xs: 6, sm: 3 }}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <Box sx={{ height: 120, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={`${API_BASE}/images/products/${product.siteType}/${p.id}/1_medium.jpg`}
                      alt={(lang === 'en' && p.nameEn ? p.nameEn : p.name)}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">{p.brand}</Typography>
                    <Typography variant="subtitle2" noWrap>{lang === 'en' && p.nameEn ? p.nameEn : p.name}</Typography>
                    <Typography variant="subtitle1" color="primary" fontWeight={700}>
                      {(p.promoPrice ?? p.price).toFixed(2)} €
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Box>
  );
}
