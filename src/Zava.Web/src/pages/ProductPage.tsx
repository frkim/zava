import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Typography, Box, Grid, Chip, Rating, Button, Alert,
  Paper, Divider, Stack, ToggleButtonGroup, ToggleButton,
  Card, CardContent, Dialog, IconButton, CardActionArea,
} from '@mui/material';
import { ShoppingCart, LocalOffer, FiberNew, ArrowBack, Category as CategoryIcon, Close, ChevronLeft, ChevronRight, Recycling, Home, Search } from '@mui/icons-material';
import { getProduct, getCrossSell, API_BASE, ApiError } from '../api';
import type { Product, Review, Category, ProductImage, CrossSellOffer } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import CrossSellDialog from '../components/CrossSellDialog';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { useAddToCart } from '../hooks/useAddToCart';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  return <ProductPageContent key={id ?? 'missing'} id={id} />;
}

function ProductPageContent({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { price, date } = useFormatters();
  const { add, isPending } = useAddToCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState('');
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [crossSellOffer, setCrossSellOffer] = useState<CrossSellOffer | null>(null);
  const [crossSellOpen, setCrossSellOpen] = useState(false);

  const productId = Number(id);
  const loadProduct = useCallback(async (signal?: AbortSignal) => {
    if (!Number.isInteger(productId) || productId <= 0) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const data = await getProduct(productId, signal);
      if (signal?.aborted) return;
      setProduct(data.product);
      setReviews(data.reviews);
      setRelatedProducts(data.relatedProducts);
      setCategory(data.category);
      setImages(data.images ?? []);
      setSelectedImageIdx(0);
    } catch (e) {
      if (signal?.aborted) return;
      if (e instanceof ApiError && e.status === 404) setNotFound(true);
      else setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    const controller = new AbortController();
    void loadProduct(controller.signal);
    return () => controller.abort();
  }, [loadProduct]);

  const productName = product ? (lang === 'en' && product.nameEn ? product.nameEn : product.name) : '';
  const productDescription = product ? (lang === 'en' && product.descriptionEn ? product.descriptionEn : product.description) : '';
  const firstAvailableVariantId = useMemo(() => {
    if (!product || product.variants.length === 0) return null;
    return product.variants.find(v => v.stock > 0)?.id ?? product.variants[0].id;
  }, [product]);
  const selectedVariantId = selectedVariant ?? firstAvailableVariantId;
  const selectedVar = product?.variants.find(v => v.id === selectedVariantId) ?? null;
  const variantAdjustment = selectedVar?.priceAdjustment ?? 0;
  const availableStock = product
    ? selectedVar
      ? Math.min(product.stock, selectedVar.stock)
      : product.variants.length > 0 ? 0 : product.stock
    : 0;
  const purchasable = !!product && availableStock > 0;
  const safeQuantity = Math.min(Math.max(quantity, 1), Math.max(availableStock, 1));
  const finalPrice = product ? (product.promoPrice ?? product.price) + variantAdjustment : 0;
  const referencePrice = product?.promoPrice
    ? product.price + variantAdjustment
    : product?.isSecondLife && product.secondLife
      ? product.secondLife.originalPrice + variantAdjustment
      : null;
  const discount = referencePrice && referencePrice > finalPrice
    ? Math.round((1 - finalPrice / referencePrice) * 100)
    : 0;

  const handleVariantChange = (_: React.MouseEvent<HTMLElement>, value: number | null) => {
    if (value === null) return;
    setSelectedVariant(value);
    setQuantity(1);
    setFormError('');
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!purchasable) {
      setFormError(t('com.product.unavailableVariant'));
      return;
    }
    const cart = await add(product, safeQuantity, selectedVariantId ?? undefined);
    if (!cart) return;
    try {
      const offer = await getCrossSell(product.id);
      if (offer.complementaryProduct || offer.warranty) {
        setCrossSellOffer(offer);
        setCrossSellOpen(true);
      }
    } catch {
      // Cross-sell is optional; the add-to-cart feedback has already been shown.
    }
  };

  if (loading) {
    return (
      <Box>
        <PageTitle>{t('com.product.title')}</PageTitle>
        <LoadingState />
      </Box>
    );
  }
  if (error) {
    return (
      <Box>
        <PageTitle>{t('com.product.title')}</PageTitle>
        <ErrorState detail={error} onRetry={() => void loadProduct()} />
      </Box>
    );
  }
  if (notFound || !product) {
    return (
      <Box>
        <PageTitle>{t('product.notFound')}</PageTitle>
        <EmptyState
          title={t('product.notFound')}
          description={t('com.product.notFoundDesc')}
          action={(
            <>
              <Button variant="contained" component={RouterLink} to="/search" startIcon={<Search />} sx={{ m: 0.5 }}>{t('notFound.catalog')}</Button>
              <Button variant="outlined" component={RouterLink} to="/" startIcon={<Home />} sx={{ m: 0.5 }}>{t('notFound.home')}</Button>
            </>
          )}
        />
      </Box>
    );
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length > 0 ? Math.round(reviews.filter(rev => rev.rating === r).length / reviews.length * 100) : 0,
  }));

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>{t('product.back')}</Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          {images.length > 0 ? (
            <Box>
              <Paper
                ref={mainImageRef}
                sx={{ height: 400, position: 'relative', overflow: 'hidden', cursor: 'crosshair', bgcolor: 'grey.50' }}
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
                <Box component="img" src={`${API_BASE}${images[selectedImageIdx].main}`} alt={productName}
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                {zoomVisible && (
                  <Box
                    sx={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      backgroundImage: `url(${API_BASE}${images[selectedImageIdx].main})`,
                      backgroundSize: '250%',
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundRepeat: 'no-repeat',
                      zIndex: 2,
                    }}
                  />
                )}
              </Paper>

              {images.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
                  {images.map((img, idx) => (
                    <Box
                      key={img.index}
                      component="button"
                      type="button"
                      aria-label={`${t('com.product.imageSelect')} ${idx + 1}`}
                      aria-pressed={idx === selectedImageIdx}
                      aria-current={idx === selectedImageIdx ? 'true' : undefined}
                      onClick={() => setSelectedImageIdx(idx)}
                      sx={{
                        width: 64, height: 64, p: 0, bgcolor: 'transparent',
                        border: idx === selectedImageIdx ? '2px solid' : '2px solid transparent',
                        borderColor: idx === selectedImageIdx ? 'primary.main' : 'transparent',
                        borderRadius: 1, overflow: 'hidden', cursor: 'pointer',
                        opacity: idx === selectedImageIdx ? 1 : 0.6,
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <Box component="img" src={`${API_BASE}${img.thumb}`} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          ) : (
            <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
              <Typography component="span" variant="h1" sx={{ opacity: 0.15, fontWeight: 700 }}>{productName.charAt(0)}</Typography>
            </Paper>
          )}

          <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="lg" fullWidth
            PaperProps={{ sx: { bgcolor: 'black', position: 'relative' } }}>
            <IconButton onClick={() => setLightboxOpen(false)}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 10 }}
              aria-label={t('product.close')}
            >
              <Close />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', position: 'relative' }}>
              {images.length > 1 && (
                <IconButton onClick={() => setSelectedImageIdx((prev) => (prev - 1 + images.length) % images.length)}
                  sx={{ position: 'absolute', left: 8, color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  aria-label={t('product.previousImage')}
                >
                  <ChevronLeft fontSize="large" />
                </IconButton>
              )}
              {images.length > 0 && (
                <Box component="img" src={`${API_BASE}${images[selectedImageIdx].main}`} alt={productName}
                  sx={{ maxWidth: '90%', maxHeight: '70vh', objectFit: 'contain' }} />
              )}
              {images.length > 1 && (
                <IconButton onClick={() => setSelectedImageIdx((prev) => (prev + 1) % images.length)}
                  sx={{ position: 'absolute', right: 8, color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  aria-label={t('product.nextImage')}
                >
                  <ChevronRight fontSize="large" />
                </IconButton>
              )}
            </Box>
            {images.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', py: 2 }}>
                {images.map((img, idx) => (
                  <Box
                    key={img.index}
                    component="button"
                    type="button"
                    aria-label={`${t('com.product.imageSelect')} ${idx + 1}`}
                    aria-pressed={idx === selectedImageIdx}
                    aria-current={idx === selectedImageIdx ? 'true' : undefined}
                    onClick={() => setSelectedImageIdx(idx)}
                    sx={{
                      width: 56, height: 56, p: 0, bgcolor: 'transparent',
                      border: idx === selectedImageIdx ? '2px solid white' : '2px solid transparent',
                      borderRadius: 1, overflow: 'hidden', cursor: 'pointer',
                      opacity: idx === selectedImageIdx ? 1 : 0.5,
                      transition: 'all 0.2s',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <Box component="img" src={`${API_BASE}${img.thumb}`} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Stack>
            )}
          </Dialog>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {product.isNew && <Chip label={t('product.new')} size="small" color="info" icon={<FiberNew />} />}
            {discount > 0 && <Chip label={`-${discount}%`} size="small" color="error" icon={<LocalOffer />} />}
            {product.isBestSeller && <Chip label={t('product.bestSeller')} size="small" color="secondary" />}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">{product.brand} · SKU: {product.sku}</Typography>
            {category && (
              <Chip icon={<CategoryIcon />} label={lang === 'en' && category.nameEn ? category.nameEn : category.name}
                size="small" variant="outlined" clickable onClick={() => navigate(`/search?categoryId=${category.id}`)} />
            )}
          </Stack>
          <PageTitle sx={{ mb: 1 }}>{productName}</PageTitle>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.rating.toFixed(1)} ({product.reviewCount} {t('product.reviews')})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2 }}>
            <Typography variant="h4" color="primary" fontWeight={700}>{price(finalPrice)}</Typography>
            {referencePrice && referencePrice > finalPrice && (
              <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {price(referencePrice)}
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>{productDescription}</Typography>

          {product.variants.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('product.variant')}</Typography>
              <ToggleButtonGroup value={selectedVariantId} exclusive onChange={handleVariantChange} size="small">
                {product.variants.map((v) => (
                  <ToggleButton key={v.id} value={v.id} color={v.stock > 0 ? 'standard' : 'error'}>
                    {lang === 'en' && v.nameEn ? v.nameEn : v.name}
                    {v.priceAdjustment !== 0 && (
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        ({v.priceAdjustment > 0 ? '+' : ''}{price(v.priceAdjustment)})
                      </Typography>
                    )}
                    {v.stock === 0 && <Chip label={t('product.outOfStock')} size="small" color="error" sx={{ ml: 1 }} />}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {!purchasable && <Alert severity="warning" sx={{ mt: 1 }}>{t('com.product.unavailableVariant')}</Alert>}
            </Box>
          )}

          <Typography variant="body2" sx={{ mb: 2 }} color={purchasable ? 'success.main' : 'error.main'}>
            {purchasable ? `${t('product.inStock')} (${availableStock} ${t('product.available')})` : t('product.outOfStock')}
          </Typography>
          {formError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError('')}>{formError}</Alert>}

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <Button variant="outlined" size="small" disabled={safeQuantity <= 1 || !purchasable}
              onClick={() => setQuantity(Math.max(1, safeQuantity - 1))}>-</Button>
            <Typography aria-label={t('com.product.quantity')}>{safeQuantity}</Typography>
            <Button variant="outlined" size="small" disabled={!purchasable || safeQuantity >= availableStock}
              onClick={() => setQuantity(Math.min(availableStock, safeQuantity + 1))}>+</Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              disabled={!purchasable || isPending(product.id)}
              onClick={handleAddToCart}
            >
              {isPending(product.id) ? t('common.adding') : `${t('product.addToCart')} — ${price(finalPrice * safeQuantity)}`}
            </Button>
          </Stack>

          {product.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
              {product.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" clickable
                  onClick={() => navigate(tag === product.brand ? `/search?brand=${encodeURIComponent(tag)}` : `/search?q=${encodeURIComponent(tag)}`)} />
              ))}
            </Stack>
          )}

          {product.isSecondLife && product.secondLife && (
            <Paper sx={{ mt: 3, p: 2, border: '1px solid #00796b', borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Chip icon={<Recycling />} label={t('secondLife.sectionTitle')}
                  sx={{ bgcolor: '#00796b', color: 'white', '& .MuiChip-icon': { color: 'white' } }} />
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">{t('secondLife.condition')}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {lang === 'en' ? product.secondLife.conditionEn : product.secondLife.condition}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">{t('secondLife.savings')}</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">-{discount}%</Typography>
                </Grid>
                {product.secondLife.warrantyMonths && (
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">{t('secondLife.warranty')}</Typography>
                    <Typography variant="body2" fontWeight={600}>{product.secondLife.warrantyMonths} {t('secondLife.months')}</Typography>
                  </Grid>
                )}
                {product.secondLife.sellerType && (
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">{t('secondLife.seller')}</Typography>
                    <Typography variant="body2" fontWeight={600}>{lang === 'en' ? product.secondLife.sellerTypeEn : product.secondLife.sellerType}</Typography>
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary">{t('secondLife.originalPrice')}</Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>{price(referencePrice ?? product.secondLife.originalPrice)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>{t('product.customerReviews')} ({reviews.length})</Typography>

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
                    {date(review.createdAt)} · {review.helpfulCount} {t('product.helpfulCount')}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            {reviews.length > visibleReviews && (
              <Button variant="outlined" onClick={() => setVisibleReviews((prev) => prev + 5)} sx={{ alignSelf: 'center' }}>
                {t('product.viewMoreReviews')} ({reviews.length - visibleReviews})
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>{t('product.relatedProducts')}</Typography>
          <Grid container spacing={2}>
            {relatedProducts.slice(0, 4).map((p) => (
              <Grid key={p.id} size={{ xs: 6, sm: 3 }}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                  <CardActionArea component={RouterLink} to={`/products/${p.id}`} aria-label={`${t('com.product.relatedLink')} ${lang === 'en' && p.nameEn ? p.nameEn : p.name}`}>
                    <Box sx={{ height: 120, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <Box component="img" src={`${API_BASE}/images/products/${product.siteType}/${p.id}/1_medium.jpg`}
                        alt={lang === 'en' && p.nameEn ? p.nameEn : p.name}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">{p.brand}</Typography>
                      <Typography variant="subtitle2" noWrap>{lang === 'en' && p.nameEn ? p.nameEn : p.name}</Typography>
                      <Typography variant="subtitle1" color="primary" fontWeight={700}>{price(p.promoPrice ?? p.price)}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {crossSellOffer && (
        <CrossSellDialog
          open={crossSellOpen}
          onClose={() => setCrossSellOpen(false)}
          offer={crossSellOffer}
          productId={product.id}
          productName={productName}
        />
      )}
    </Box>
  );
}
