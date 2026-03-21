import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Grid, Card, CardContent, CardActionArea, CircularProgress,
} from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  Tv, Laptop, Smartphone, Headphones, CameraAlt, SportsEsports, Tablet, Speaker, Watch, MenuBook,
  Kitchen, LocalLaundryService, Countertops, CleaningServices, Microwave, CoffeeMaker, Blender, AcUnit, Iron,
  Spa, Face, Brush, Visibility, FaceRetouchingNatural, Palette, ContentCut, CardGiftcard, WbSunny,
  Cable, ElectricalServices, Power, Lightbulb, LightMode, Dashboard, SmartToy, Build, Thermostat,
  EggAlt, BakeryDining, LunchDining, SetMeal, RiceBowl, Cookie, LocalDrink, EnergySavingsLeaf,
  Hardware, FormatPaint, Carpenter, Plumbing, Settings, GridView, Grass, Inventory, Security,
  Category as CategoryFallback,
} from '@mui/icons-material';
import { getCategories } from '../api';
import type { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

const iconMap: Record<string, SvgIconComponent> = {
  Tv, Laptop, Smartphone, Headphones, CameraAlt, SportsEsports, Tablet, Speaker, Watch, MenuBook,
  Kitchen, LocalLaundryService, Countertops, CleaningServices, Microwave, CoffeeMaker, Blender, AcUnit, Iron,
  Spa, Face, Brush, Visibility, FaceRetouchingNatural, Palette, ContentCut, CardGiftcard, WbSunny,
  Cable, ElectricalServices, Power, Lightbulb, LightMode, Dashboard, SmartToy, Build, Thermostat,
  EggAlt, BakeryDining, LunchDining, SetMeal, RiceBowl, Cookie, LocalDrink, Eco: EnergySavingsLeaf,
  Hardware, FormatPaint, Carpenter, Plumbing, Settings, GridView, Grass, Inventory, Security,
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>{t('categories.title')}</Typography>
      <Grid container spacing={2}>
        {categories.map((cat) => {
          const catName = lang === 'en' && cat.nameEn ? cat.nameEn : cat.name;
          const catDesc = lang === 'en' && cat.descriptionEn ? cat.descriptionEn : cat.description;
          return (
          <Grid key={cat.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card>
              <CardActionArea onClick={() => navigate(`/search?categoryId=${cat.id}`)}>
                <Box sx={{ height: 140, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(() => {
                    const IconComp = cat.icon ? iconMap[cat.icon] : null;
                    return IconComp
                      ? <IconComp sx={{ fontSize: 64, color: 'white', opacity: 0.85 }} />
                      : <CategoryFallback sx={{ fontSize: 64, color: 'white', opacity: 0.3 }} />;
                  })()}
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>{catName}</Typography>
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
    </Box>
  );
}
