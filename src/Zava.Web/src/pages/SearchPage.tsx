import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Typography, Box, Grid, CircularProgress, Alert, Pagination, FormControl,
  InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Paper,
  Chip, Stack, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { searchProducts, addToCart } from '../api';
import type { SearchResult, SearchRequest, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();

  const q = searchParams.get('q') ?? '';
  const categoryId = searchParams.get('categoryId');
  const brand = searchParams.get('brand');
  const page = parseInt(searchParams.get('page') ?? '1');
  const sortBy = searchParams.get('sortBy') ?? '';
  const sortDesc = searchParams.get('sortDesc') === 'true';
  const inStock = searchParams.get('inStock') === 'true';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  useEffect(() => {
    setLoading(true);
    const req: SearchRequest = {
      query: q || undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      brand: brand || undefined,
      page,
      pageSize: 20,
      sortBy: sortBy || undefined,
      sortDescending: sortDesc,
      inStock: inStock || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    searchProducts(req)
      .then(setResult)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q, categoryId, brand, page, sortBy, sortDesc, inStock, minPrice, maxPrice]);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const handleAddToCart = async (product: Product) => {
    try { await addToCart(product.id, 1); } catch { /* ignore */ }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {q ? `${t('search.resultsFor')} "${q}"` : t('search.allProducts')}
        {result && <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>({result.totalCount} {t('search.results')})</Typography>}
      </Typography>

      <Grid container spacing={3}>
        {/* Sidebar Filters */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{t('search.filters')}</Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>{t('search.sortBy')}</InputLabel>
              <Select
                value={sortBy}
                label={t('search.sortBy')}
                onChange={(e) => updateParam('sortBy', e.target.value || null)}
              >
                <MenuItem value="">{t('search.relevance')}</MenuItem>
                <MenuItem value="price">{t('search.priceAsc')}</MenuItem>
                <MenuItem value="rating">{t('search.bestRated')}</MenuItem>
                <MenuItem value="newest">{t('search.newest')}</MenuItem>
                <MenuItem value="name">{t('search.nameAZ')}</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Checkbox checked={inStock} onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)} />}
              label={t('search.inStockOnly')}
              sx={{ mb: 2 }}
            />

            {/* Facets from search results */}
            {result?.facets.map((facet) => (
              <Accordion key={facet.nameEn} defaultExpanded disableGutters elevation={0}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2" fontWeight={600}>{lang === 'en' && facet.nameEn ? facet.nameEn : facet.name}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Stack spacing={0.5}>
                    {facet.values.slice(0, 10).map((v) => (
                      <Chip
                        key={v.value}
                        label={`${v.value} (${v.count})`}
                        size="small"
                        variant={
                          (facet.nameEn === 'Brand' && brand === v.value) ||
                          (facet.nameEn === 'Category' && categoryId === v.value)
                            ? 'filled' : 'outlined'
                        }
                        onClick={() => {
                          if (facet.nameEn === 'Brand') updateParam('brand', brand === v.value ? null : v.value);
                        }}
                        sx={{ justifyContent: 'flex-start' }}
                      />
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        {/* Product Grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : result && result.products.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {result.products.map((product) => (
                  <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </Grid>
                ))}
              </Grid>
              {result.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={result.totalPages}
                    page={result.page}
                    onChange={(_, p) => updateParam('page', p.toString())}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <Alert severity="info">{t('search.noResults')}</Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
