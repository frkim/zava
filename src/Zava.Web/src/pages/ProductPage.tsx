import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Grid, Chip, Rating, Button, CircularProgress, Alert,
  Paper, Divider, Stack, ToggleButtonGroup, ToggleButton, Snackbar,
  Card, CardContent,
} from '@mui/material';
import { ShoppingCart, LocalOffer, FiberNew, ArrowBack } from '@mui/icons-material';
import { getProduct, addToCart } from '../api';
import type { Product, Review } from '../types';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(parseInt(id))
      .then((data) => {
        setProduct(data.product);
        setReviews(data.reviews);
        setRelatedProducts(data.relatedProducts);
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
      setSnackbar('Produit ajouté au panier');
    } catch {
      setSnackbar('Erreur lors de l\'ajout');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return <Alert severity="error">Produit introuvable</Alert>;

  const effectivePrice = product.promoPrice ?? product.price;
  const selectedVar = product.variants.find(v => v.id === selectedVariant);
  const finalPrice = effectivePrice + (selectedVar?.priceAdjustment ?? 0);
  const discount = product.promoPrice ? Math.round((1 - product.promoPrice / product.price) * 100) : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length > 0 ? Math.round(reviews.filter(rev => rev.rating === r).length / reviews.length * 100) : 0,
  }));

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Retour</Button>

      <Grid container spacing={4}>
        {/* Image placeholder */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
            <Typography variant="h1" sx={{ opacity: 0.15, fontWeight: 700 }}>{product.name.charAt(0)}</Typography>
          </Paper>
        </Grid>

        {/* Product info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {product.isNew && <Chip label="Nouveau" size="small" color="info" icon={<FiberNew />} />}
            {product.isPromo && <Chip label={`-${discount}%`} size="small" color="error" icon={<LocalOffer />} />}
            {product.isBestSeller && <Chip label="Best-seller" size="small" color="secondary" />}
          </Stack>

          <Typography variant="caption" color="text.secondary">{product.brand} · SKU: {product.sku}</Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>{product.name}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.rating.toFixed(1)} ({product.reviewCount} avis)
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

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>{product.description}</Typography>

          {/* Variants */}
          {product.variants.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Variante</Typography>
              <ToggleButtonGroup
                value={selectedVariant}
                exclusive
                onChange={(_, v) => v !== null && setSelectedVariant(v)}
                size="small"
              >
                {product.variants.map((v) => (
                  <ToggleButton key={v.id} value={v.id}>
                    {v.name}
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
            {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
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
              Ajouter au panier — {(finalPrice * quantity).toFixed(2)} €
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
      <Typography variant="h5" sx={{ mb: 2 }}>Avis clients ({reviews.length})</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h2" fontWeight={700}>{product.rating.toFixed(1)}</Typography>
            <Rating value={product.rating} precision={0.1} readOnly size="large" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Basé sur {reviews.length} avis
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
            {reviews.slice(0, 10).map((review) => (
              <Card key={review.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{review.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.userName} {review.verified && '✓ Achat vérifié'}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                  <Typography variant="body2">{review.comment}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')} · {review.helpfulCount} personnes ont trouvé cet avis utile
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Produits similaires</Typography>
          <Grid container spacing={2}>
            {relatedProducts.slice(0, 4).map((p) => (
              <Grid key={p.id} size={{ xs: 6, sm: 3 }}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <Box sx={{ height: 120, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h3" sx={{ opacity: 0.15 }}>{p.name.charAt(0)}</Typography>
                  </Box>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">{p.brand}</Typography>
                    <Typography variant="subtitle2" noWrap>{p.name}</Typography>
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
