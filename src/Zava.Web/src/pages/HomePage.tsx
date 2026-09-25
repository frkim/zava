import { useCallback, useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography, Box, Chip, Stack, Paper, Button,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  LocalShipping, Verified, TrendingUp, ArrowForward, SearchOff,
} from '@mui/icons-material';
import ProductGrid from '../components/ProductGrid';
import RecipeBasketLink from '../components/RecipeBasketLink';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { getHomepage } from '../api';
import type { HomepageData, Product, SiteType } from '../types';
import type { TranslationKey } from '../i18n';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { useAddToCart } from '../hooks/useAddToCart';
import { surfaceForWhiteText } from '../theme';

type HomeState = { data: HomepageData | null; loading: boolean; error: string | null };
type HeroCopy = { title: TranslationKey; intro: TranslationKey; cta: TranslationKey };

const heroBySite = {
  Electronics: {
    title: 'disc.home.hero.electronics.title',
    intro: 'disc.home.hero.electronics.intro',
    cta: 'disc.home.hero.electronics.cta',
  },
  Grocery: {
    title: 'disc.home.hero.grocery.title',
    intro: 'disc.home.hero.grocery.intro',
    cta: 'disc.home.hero.grocery.cta',
  },
  Appliances: {
    title: 'disc.home.hero.appliances.title',
    intro: 'disc.home.hero.appliances.intro',
    cta: 'disc.home.hero.appliances.cta',
  },
  Cosmetics: {
    title: 'disc.home.hero.cosmetics.title',
    intro: 'disc.home.hero.cosmetics.intro',
    cta: 'disc.home.hero.cosmetics.cta',
  },
  Electrical: {
    title: 'disc.home.hero.electrical.title',
    intro: 'disc.home.hero.electrical.intro',
    cta: 'disc.home.hero.electrical.cta',
  },
  DIY: {
    title: 'disc.home.hero.diy.title',
    intro: 'disc.home.hero.diy.intro',
    cta: 'disc.home.hero.diy.cta',
  },
} satisfies Record<SiteType, HeroCopy>;

function hasHomepageContent(data: HomepageData) {
  return data.selectionProducts.length > 0
    || data.bestSellers.length > 0
    || data.newProducts.length > 0
    || data.promoProducts.length > 0
    || data.featuredProducts.length > 0
    || data.secondLifeProducts.length > 0
    || data.topCategories.length > 0;
}

export default function HomePage() {
  const { lang, t } = useLanguage();
  const { config } = useSite();
  const theme = useTheme();
  const { add, isPending } = useAddToCart();
  const [state, setState] = useState<HomeState>({ data: null, loading: true, error: null });
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const loadHomepage = useCallback(() => {
    Promise.resolve()
      .then(() => {
        setState((current) => ({ ...current, loading: true, error: null }));
        return getHomepage();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error: unknown) => {
        setState((current) => ({
          data: current.data,
          loading: false,
          error: error instanceof Error ? error.message : tRef.current('disc.home.loadError'),
        }));
      });
  }, []);

  useEffect(() => {
    loadHomepage();
  }, [loadHomepage]);

  const handleAddToCart = useCallback((product: Product) => add(product), [add]);

  if (state.loading) return <LoadingState label={t('disc.home.loading')} />;
  if (state.error) return <ErrorState detail={state.error} onRetry={loadHomepage} />;
  const data = state.data;
  const hasContent = data != null && hasHomepageContent(data);
  const siteType = config?.currentSiteType ?? 'Electronics';
  const hero = heroBySite[siteType];
  const secondLifeAvailable =
    config != null && config.currentSiteType !== 'Cosmetics' && config.currentSiteType !== 'Grocery';
  const heroStart = surfaceForWhiteText(theme.palette.primary.main);
  const heroEnd = surfaceForWhiteText(theme.palette.secondary.main);
  const mutedSectionSx = { opacity: 0.92, '& > .MuiPaper-root': { boxShadow: 'none' } };

  return (
    <Box>
      <Paper
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 3, md: 5 },
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${heroStart} 0%, ${heroEnd} 100%)`,
          color: 'white',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <Typography variant="subtitle2" component="p" sx={{ fontWeight: 700, mb: 0.5, color: 'rgba(255,255,255,0.88)' }}>
            {t('home.welcome')}
          </Typography>
          <PageTitle
            subtitle={t(hero.intro)}
            sx={{
              mb: 3,
              '& .MuiTypography-body1': { color: 'rgba(255,255,255,0.88)' },
            }}
          >
            {t(hero.title)}
          </PageTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button component={RouterLink} to="/search" variant="contained" color="inherit" endIcon={<ArrowForward />} sx={{ color: heroStart, fontWeight: 800 }}>
              {t(hero.cta)}
            </Button>
            {siteType === 'Grocery' && (
              <Button component={RouterLink} to="/recipe-basket" variant="outlined" color="inherit">
                {t('disc.home.recipeCta')}
              </Button>
            )}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
            <Button component={RouterLink} to="/info/delivery" color="inherit" size="small" startIcon={<LocalShipping />}>
              {t('disc.home.freeDelivery')}
            </Button>
            <Button component={RouterLink} to="/info/best-prices" color="inherit" size="small" startIcon={<Verified />}>
              {t('disc.home.guaranteedPrices')}
            </Button>
            <Button component={RouterLink} to="/search?sort=bestSeller" color="inherit" size="small" startIcon={<TrendingUp />}>
              {t('home.bestSellers')}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {siteType === 'Grocery' && <RecipeBasketLink />}

      {!hasContent || !data ? (
        <EmptyState icon={<SearchOff />} title={t('disc.home.empty')} description={t('disc.home.emptyDesc')} />
      ) : (<>
      {data.topCategories.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography component="h2" variant="h5" sx={{ mb: 1.5 }}>{t('disc.home.categoryShortcuts')}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.topCategories.slice(0, 6).map((cat) => (
              <Chip
                key={cat.id}
                component={RouterLink}
                to={`/search?categoryId=${cat.id}`}
                clickable
                label={`${lang === 'en' && cat.nameEn ? cat.nameEn : cat.name} (${cat.productCount})`}
                variant="outlined"
                sx={{ mb: 1, textDecoration: 'none' }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <ProductGrid title={t('disc.home.topRated')} products={data.selectionProducts.slice(0, 5)} onAddToCart={handleAddToCart} isProductAdding={isPending} accentColor="primary" viewAllTo="/search?sort=rating" />
      <ProductGrid title={t('home.bestSellers')} products={data.bestSellers.slice(0, 5)} onAddToCart={handleAddToCart} isProductAdding={isPending} accentColor="secondary" viewAllTo="/search?sort=bestSeller" />
      {secondLifeAvailable && data.secondLifeProducts.length > 0 && (
        <ProductGrid title={t('secondLife.homeSection')} products={data.secondLifeProducts.slice(0, 5)} onAddToCart={handleAddToCart} isProductAdding={isPending} accentColor="success" viewAllTo="/search?secondLife=true" />
      )}

      <Box sx={mutedSectionSx}>
        <ProductGrid title={t('home.newArrivals')} products={data.newProducts.slice(0, 5)} onAddToCart={handleAddToCart} isProductAdding={isPending} accentColor="info" />
        <ProductGrid title={t('home.promotions')} products={data.promoProducts.slice(0, 5)} onAddToCart={handleAddToCart} isProductAdding={isPending} accentColor="error" />
        <ProductGrid title={t('home.featured')} products={data.featuredProducts.slice(0, 5)} onAddToCart={handleAddToCart} isProductAdding={isPending} accentColor="warning" />
      </Box>

      {data.brands.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography component="h2" variant="h5" sx={{ mb: 2 }}>{t('home.brands')}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.brands.slice(0, 12).map((brand) => (
              <Chip
                key={brand}
                component={RouterLink}
                to={`/search?brand=${encodeURIComponent(brand)}`}
                clickable
                label={brand}
                variant="filled"
                sx={{ mb: 1, textDecoration: 'none' }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Paper
        component={RouterLink}
        to="/info/premium"
        sx={{
          display: 'block',
          p: 3,
          mb: 4,
          bgcolor: surfaceForWhiteText(theme.palette.secondary.main),
          color: 'white',
          borderRadius: 2,
          textDecoration: 'none',
          transition: 'opacity 0.2s',
          '&:hover': { opacity: 0.92 },
          '&:focus-visible': { outline: `3px solid ${alpha(theme.palette.common.white, 0.9)}`, outlineOffset: 2 },
        }}
      >
        <Typography component="h2" variant="h6" gutterBottom>{t('home.premium')}</Typography>
        <Typography variant="body2">
          {t('home.premiumDesc')}
        </Typography>
      </Paper>
      </>)}
    </Box>
  );
}
