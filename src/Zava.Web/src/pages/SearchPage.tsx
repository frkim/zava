import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Typography, Box, Grid, Pagination, FormControl, InputLabel, Select, MenuItem,
  Checkbox, FormControlLabel, Paper, Chip, Stack, Accordion, AccordionSummary,
  AccordionDetails, Drawer, Button, Divider, IconButton, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Close, ExpandMore, FilterList, Recycling, SearchOff } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { searchProducts } from '../api';
import type { FacetGroup, Product, SearchRequest, SearchResult } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { useAddToCart } from '../hooks/useAddToCart';

type SortValue = 'relevance' | 'priceAsc' | 'priceDesc' | 'name' | 'rating' | 'bestSeller';
type SearchState = { result: SearchResult | null; loading: boolean; error: string | null };
type FilterChip = { key: string; label: string; remove: () => void };

const filterKeys = ['categoryId', 'brand', 'minPrice', 'maxPrice', 'minRating', 'inStock', 'secondLife'] as const;

function parsePage(value: string | null) {
  const parsed = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizeSort(searchParams: URLSearchParams): SortValue {
  const rawSort = searchParams.get('sort');
  if (rawSort === 'priceAsc' || rawSort === 'priceDesc' || rawSort === 'name' || rawSort === 'rating' || rawSort === 'bestSeller') {
    return rawSort;
  }

  const legacySortBy = searchParams.get('sortBy')?.toLowerCase() ?? '';
  const legacyDescending = searchParams.get('sortDescending') === 'true' || searchParams.get('sortDesc') === 'true';
  if (legacySortBy === 'price') return legacyDescending ? 'priceDesc' : 'priceAsc';
  if (legacySortBy === 'name') return 'name';
  if (legacySortBy === 'rating') return 'rating';
  if (legacySortBy === 'bestseller') return 'bestSeller';
  return 'relevance';
}

function requestSort(sort: SortValue): Pick<SearchRequest, 'sortBy' | 'sortDescending'> {
  switch (sort) {
    case 'priceAsc': return { sortBy: 'price', sortDescending: false };
    case 'priceDesc': return { sortBy: 'price', sortDescending: true };
    case 'name': return { sortBy: 'name', sortDescending: false };
    case 'rating': return { sortBy: 'rating', sortDescending: true };
    case 'bestSeller': return { sortBy: 'bestSeller', sortDescending: true };
    default: return { sortBy: undefined, sortDescending: false };
  }
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<SearchState>({ result: null, loading: true, error: null });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedFacets, setExpandedFacets] = useState<ReadonlySet<string>>(new Set());
  const [retryToken, setRetryToken] = useState(0);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusResultsAfterLoad = useRef(false);
  const { lang, t } = useLanguage();
  const { price } = useFormatters();
  const { config } = useSite();
  const { add, isPending } = useAddToCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const q = searchParams.get('q') ?? '';
  const categoryId = searchParams.get('categoryId');
  const brand = searchParams.get('brand');
  const page = parsePage(searchParams.get('page'));
  const sort = normalizeSort(searchParams);
  const inStock = searchParams.get('inStock') === 'true';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minRating = searchParams.get('minRating');
  const secondLifeFilterAvailable =
    config != null && config.currentSiteType !== 'Cosmetics' && config.currentSiteType !== 'Grocery';
  const secondLife = secondLifeFilterAvailable && searchParams.get('secondLife') === 'true';
  const result = state.result;

  const updateParams = useCallback((updates: Record<string, string | null>, resetPage = true) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    if (resetPage) params.delete('page');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const updateParam = useCallback((key: string, value: string | null, resetPage = true) => {
    updateParams({ [key]: value }, resetPage);
  }, [updateParams]);

  const updateSort = useCallback((value: SortValue) => {
    updateParams({ sort: value === 'relevance' ? null : value, sortBy: null, sortDesc: null, sortDescending: null });
  }, [updateParams]);

  const clearFilters = useCallback(() => {
    const updates = Object.fromEntries(filterKeys.map((key) => [key, null]));
    updateParams(updates);
  }, [updateParams]);

  const activeFilters = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = [];
    const categoryLabel = result?.facets
      .find((facet) => facet.nameEn === 'Category')?.values
      .find((value) => value.filterValue === categoryId)?.value ?? (categoryId ? `${t('disc.search.category')} #${categoryId}` : '');

    if (categoryId) chips.push({ key: 'categoryId', label: categoryLabel, remove: () => updateParam('categoryId', null) });
    if (brand) chips.push({ key: 'brand', label: brand, remove: () => updateParam('brand', null) });
    if (minPrice || maxPrice) {
      const min = minPrice ? Number.parseFloat(minPrice) : null;
      const max = maxPrice ? Number.parseFloat(maxPrice) : null;
      const label = min != null && max != null
        ? `${price(min)} – ${price(max)}`
        : min != null
          ? `${t('disc.search.priceFrom')} ${price(min)}`
          : `${t('disc.search.priceUntil')} ${price(max ?? 0)}`;
      chips.push({ key: 'price', label, remove: () => updateParams({ minPrice: null, maxPrice: null }) });
    }
    if (minRating) chips.push({ key: 'minRating', label: `${minRating}+ ${t('disc.search.stars')}`, remove: () => updateParam('minRating', null) });
    if (inStock) chips.push({ key: 'inStock', label: t('search.inStockOnly'), remove: () => updateParam('inStock', null) });
    if (secondLife) chips.push({ key: 'secondLife', label: t('secondLife.filterLabel'), remove: () => updateParam('secondLife', null) });
    return chips;
  }, [brand, categoryId, inStock, maxPrice, minPrice, minRating, price, result?.facets, secondLife, t, updateParam, updateParams]);

  const request = useMemo<SearchRequest>(() => {
    const sortRequest = requestSort(sort);
    return {
      query: q || undefined,
      categoryId: categoryId ? Number.parseInt(categoryId, 10) : undefined,
      brand: brand || undefined,
      page,
      pageSize: 20,
      ...sortRequest,
      inStock: inStock || undefined,
      minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
      minRating: minRating ? Number.parseFloat(minRating) : undefined,
      secondLife: secondLife || undefined,
    };
  }, [brand, categoryId, inStock, maxPrice, minPrice, minRating, page, q, secondLife, sort]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => {
        if (!cancelled) setState((current) => ({ ...current, loading: true, error: null }));
        return searchProducts(request);
      })
      .then((nextResult) => {
        if (!cancelled) setState({ result: nextResult, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState((current) => ({
            result: current.result,
            loading: false,
            error: error instanceof Error ? error.message : t('disc.search.loadError'),
          }));
        }
      });
    return () => { cancelled = true; };
  }, [request, retryToken, t]);

  useEffect(() => {
    if (!state.loading && state.result && focusResultsAfterLoad.current) {
      focusResultsAfterLoad.current = false;
      window.requestAnimationFrame(() => {
        resultsHeadingRef.current?.scrollIntoView({ block: 'start' });
        resultsHeadingRef.current?.focus({ preventScroll: true });
      });
    }
  }, [state.loading, state.result]);

  const handleAddToCart = useCallback((product: Product) => add(product), [add]);
  const handlePageChange = useCallback((nextPage: number) => {
    focusResultsAfterLoad.current = true;
    updateParam('page', nextPage.toString(), false);
  }, [updateParam]);

  const toggleFacetList = useCallback((facetKey: string) => {
    setExpandedFacets((current) => {
      const next = new Set(current);
      if (next.has(facetKey)) next.delete(facetKey);
      else next.add(facetKey);
      return next;
    });
  }, []);

  const isFacetValueActive = useCallback((facet: FacetGroup, filterValue: string) => {
    if (facet.nameEn === 'Brand') return brand === filterValue;
    if (facet.nameEn === 'Category') return categoryId === filterValue;
    if (facet.nameEn === 'Price') {
      const [min, max] = filterValue.split('-');
      return minPrice === min && (maxPrice ?? '') === (max ?? '');
    }
    if (facet.nameEn === 'Rating') return minRating === filterValue;
    return false;
  }, [brand, categoryId, maxPrice, minPrice, minRating]);

  const applyFacetValue = useCallback((facet: FacetGroup, filterValue: string) => {
    if (facet.nameEn === 'Brand') {
      updateParam('brand', brand === filterValue ? null : filterValue);
    } else if (facet.nameEn === 'Category') {
      updateParam('categoryId', categoryId === filterValue ? null : filterValue);
    } else if (facet.nameEn === 'Price') {
      const [min, max] = filterValue.split('-');
      if (minPrice === min && (maxPrice ?? '') === (max ?? '')) {
        updateParams({ minPrice: null, maxPrice: null });
      } else {
        updateParams({ minPrice: min, maxPrice: max || null });
      }
    } else if (facet.nameEn === 'Rating') {
      updateParam('minRating', minRating === filterValue ? null : filterValue);
    }
  }, [brand, categoryId, maxPrice, minPrice, minRating, updateParam, updateParams]);

  const sortSelect = (id: string) => (
    <FormControl fullWidth size="small">
      <InputLabel id={`${id}-label`}>{t('search.sortBy')}</InputLabel>
      <Select
        labelId={`${id}-label`}
        value={sort}
        label={t('search.sortBy')}
        onChange={(event) => updateSort(event.target.value as SortValue)}
      >
        <MenuItem value="relevance">{t('search.relevance')}</MenuItem>
        <MenuItem value="priceAsc">{t('search.priceAsc')}</MenuItem>
        <MenuItem value="priceDesc">{t('disc.search.priceDesc')}</MenuItem>
        <MenuItem value="name">{t('search.nameAZ')}</MenuItem>
        <MenuItem value="rating">{t('search.bestRated')}</MenuItem>
        <MenuItem value="bestSeller">{t('disc.search.bestSellers')}</MenuItem>
      </Select>
    </FormControl>
  );

  const filtersPanel = (compact: boolean) => (
    <Stack spacing={2}>
      <FormControlLabel
        control={<Checkbox checked={inStock} onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)} />}
        label={t('search.inStockOnly')}
      />

      {secondLifeFilterAvailable && (
        <FormControlLabel
          control={
            <Checkbox
              checked={secondLife}
              onChange={(e) => updateParam('secondLife', e.target.checked ? 'true' : null)}
              icon={<Recycling />}
              checkedIcon={<Recycling />}
              sx={{ color: '#00796b', '&.Mui-checked': { color: '#00796b' } }}
            />
          }
          label={t('secondLife.filterLabel')}
        />
      )}

      {result?.facets.map((facet) => {
        const facetLabel = lang === 'en' && facet.nameEn ? facet.nameEn : facet.name;
        const showAll = expandedFacets.has(facet.nameEn);
        const values = showAll ? facet.values : facet.values.slice(0, 10);
        return (
          <Accordion key={facet.nameEn} defaultExpanded={!compact} disableGutters elevation={0}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" fontWeight={700}>{facetLabel}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Stack spacing={0.75} alignItems="flex-start">
                {values.map((value) => {
                  const filterValue = value.filterValue ?? value.value;
                  const isActive = isFacetValueActive(facet, filterValue);
                  return (
                    <Chip
                      key={`${facet.nameEn}-${value.value}`}
                      label={`${value.value} (${value.count})`}
                      size="small"
                      variant={isActive ? 'filled' : 'outlined'}
                      color={isActive ? 'primary' : 'default'}
                      onClick={() => applyFacetValue(facet, filterValue)}
                      sx={{ justifyContent: 'flex-start', maxWidth: '100%' }}
                    />
                  );
                })}
                {facet.values.length > 10 && (
                  <Button size="small" onClick={() => toggleFacetList(facet.nameEn)}>
                    {showAll ? t('disc.search.showLess') : t('disc.search.showMore')}
                  </Button>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );

  const totalCount = result?.totalCount ?? 0;
  const pageTitle = q ? `${t('search.resultsFor')} « ${q} »` : t('search.allProducts');
  const hasProducts = !!result && result.products.length > 0;

  return (
    <Box>
      <PageTitle subtitle={result ? `${totalCount} ${t('search.results')}` : undefined}>
        {pageTitle}
      </PageTitle>

      <Paper
        variant="outlined"
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'sticky',
          top: 8,
          zIndex: theme.zIndex.appBar - 1,
          p: 1.5,
          mb: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={700} sx={{ flex: 1 }}>
            {totalCount} {t('search.results')}
          </Typography>
          <Button variant="outlined" startIcon={<FilterList />} onClick={() => setFiltersOpen(true)}>
            {t('disc.search.filterButton')} ({activeFilters.length})
          </Button>
        </Stack>
        <Box sx={{ mt: 1 }}>{sortSelect('mobile-sort')}</Box>
      </Paper>

      {activeFilters.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }} aria-label={t('disc.search.activeFilters')}>
          {activeFilters.map((filter) => (
            <Chip key={filter.key} label={filter.label} onDelete={filter.remove} />
          ))}
          <Button size="small" onClick={clearFilters}>{t('disc.search.clearAll')}</Button>
        </Stack>
      )}

      <Grid container spacing={3}>
        <Grid size={{ md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper sx={{ p: 2, position: 'sticky', top: 16 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>{t('search.filters')}</Typography>
            <Box sx={{ mb: 2 }}>{sortSelect('desktop-sort')}</Box>
            {filtersPanel(false)}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Typography ref={resultsHeadingRef} component="h2" variant="h6" tabIndex={-1} sx={{ mb: 2, outline: 'none' }}>
            {t('disc.search.resultsHeading')}
          </Typography>

          {state.loading ? (
            <LoadingState label={t('disc.search.loading')} />
          ) : state.error ? (
            <ErrorState detail={state.error} onRetry={() => setRetryToken((value) => value + 1)} />
          ) : hasProducts ? (
            <>
              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {result.products.map((product) => (
                  <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} isAdding={isPending(product.id)} />
                  </Grid>
                ))}
              </Grid>
              {result.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={result.totalPages}
                    page={result.page}
                    onChange={(_, nextPage) => handlePageChange(nextPage)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <EmptyState
              icon={<SearchOff />}
              title={t('search.noResults')}
              description={t('disc.search.noResultsDesc')}
            />
          )}
        </Grid>
      </Grid>

      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        PaperProps={{ sx: { maxHeight: '88vh', borderTopLeftRadius: 16, borderTopRightRadius: 16, width: { md: 380 } } }}
      >
        <Box sx={{ p: 2, overflow: 'auto' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="h6" component="h2" sx={{ flex: 1 }}>{t('search.filters')}</Typography>
            <IconButton onClick={() => setFiltersOpen(false)} aria-label={t('common.close')}>
              <Close />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          {filtersPanel(true)}
        </Box>
        <Box sx={{ position: 'sticky', bottom: 0, p: 2, bgcolor: 'background.paper', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button fullWidth variant="contained" size="large" onClick={() => setFiltersOpen(false)}>
            {t('disc.search.showResults')} {totalCount} {t('search.results')}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
