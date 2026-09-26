import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography, Box, Grid, Card, CardContent, CardActionArea,
} from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  Tv, Laptop, Smartphone, Headphones, CameraAlt, SportsEsports, Tablet, Speaker, Watch, MenuBook,
  Kitchen, LocalLaundryService, Countertops, CleaningServices, Microwave, CoffeeMaker, Blender, AcUnit, Iron,
  Spa, Face, Brush, Visibility, FaceRetouchingNatural, Palette, ContentCut, CardGiftcard, WbSunny,
  Cable, ElectricalServices, Power, Lightbulb, LightMode, Dashboard, SmartToy, Build, Thermostat,
  EggAlt, BakeryDining, LunchDining, SetMeal, RiceBowl, Cookie, LocalDrink, EnergySavingsLeaf,
  Hardware, FormatPaint, Carpenter, Plumbing, Settings, GridView, Grass, Inventory, Security,
  Checkroom, Man, Man2, Woman, Woman2, DryCleaning, Umbrella, Straighten, ShoppingBag,
  DirectionsRun, FitnessCenter, SportsSoccer, Hiking, DirectionsBike, Pool, SportsTennis,
  DownhillSkiing, SportsBasketball, SelfImprovement,
  Category as CategoryFallback, SearchOff,
} from '@mui/icons-material';
import { getCategories } from '../api';
import type { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';

type CategoriesState = { categories: Category[]; loading: boolean; error: string | null };

const iconMap: Record<string, SvgIconComponent> = {
  Tv, Laptop, Smartphone, Headphones, CameraAlt, SportsEsports, Tablet, Speaker, Watch, MenuBook,
  Kitchen, LocalLaundryService, Countertops, CleaningServices, Microwave, CoffeeMaker, Blender, AcUnit, Iron,
  Spa, Face, Brush, Visibility, FaceRetouchingNatural, Palette, ContentCut, CardGiftcard, WbSunny,
  Cable, ElectricalServices, Power, Lightbulb, LightMode, Dashboard, SmartToy, Build, Thermostat,
  EggAlt, BakeryDining, LunchDining, SetMeal, RiceBowl, Cookie, LocalDrink, Eco: EnergySavingsLeaf,
  Hardware, FormatPaint, Carpenter, Plumbing, Settings, GridView, Grass, Inventory, Security,
  Checkroom, Man, Man2, Woman, Woman2, DryCleaning, Umbrella, Straighten, ShoppingBag,
  DirectionsRun, FitnessCenter, SportsSoccer, Hiking, DirectionsBike, Pool, SportsTennis,
  DownhillSkiing, SportsBasketball, SelfImprovement,
};

export default function CategoriesPage() {
  const { lang, t } = useLanguage();
  const [state, setState] = useState<CategoriesState>({ categories: [], loading: true, error: null });

  const loadCategories = useCallback(() => {
    Promise.resolve()
      .then(() => {
        setState((current) => ({ ...current, loading: true, error: null }));
        return getCategories();
      })
      .then((categories) => setState({ categories, loading: false, error: null }))
      .catch((error: unknown) => {
        setState((current) => ({
          categories: current.categories,
          loading: false,
          error: error instanceof Error ? error.message : t('disc.categories.loadError'),
        }));
      });
  }, [t]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (state.loading) return <LoadingState label={t('disc.categories.loading')} />;
  if (state.error) return <ErrorState detail={state.error} onRetry={loadCategories} />;

  return (
    <Box>
      <PageTitle subtitle={t('disc.categories.subtitle')}>{t('categories.title')}</PageTitle>
      {state.categories.length === 0 ? (
        <EmptyState icon={<SearchOff />} title={t('disc.categories.empty')} description={t('disc.categories.emptyDesc')} />
      ) : (
        <Grid container spacing={2}>
          {state.categories.map((cat) => {
            const catName = lang === 'en' && cat.nameEn ? cat.nameEn : cat.name;
            const catDesc = lang === 'en' && cat.descriptionEn ? cat.descriptionEn : cat.description;
            const IconComp = cat.icon ? iconMap[cat.icon] : null;
            return (
              <Grid key={cat.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea component={RouterLink} to={`/search?categoryId=${cat.id}`} sx={{ height: '100%', alignItems: 'stretch' }}>
                    <Box sx={{ height: { xs: 116, sm: 140 }, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {IconComp
                        ? <IconComp sx={{ fontSize: { xs: 48, sm: 64 }, color: 'primary.contrastText', opacity: 0.9 }} />
                        : <CategoryFallback sx={{ fontSize: { xs: 48, sm: 64 }, color: 'primary.contrastText', opacity: 0.45 }} />}
                    </Box>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700}>{catName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cat.productCount} {cat.productCount > 1 ? t('categories.products') : t('categories.product')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {catDesc}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
