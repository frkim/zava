import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';
import { ArrowForward, RestaurantMenu } from '@mui/icons-material';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';

export default function RecipeBasketLink() {
  const { config } = useSite();
  const { t } = useLanguage();
  if (config?.currentSiteType !== 'Grocery') return null;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', borderColor: 'primary.light', bgcolor: 'background.paper', textAlign: 'left' }}>
      <RestaurantMenu color="primary" sx={{ fontSize: 30 }} />
      <Box sx={{ flex: 1, minWidth: 180 }}>
        <Typography fontWeight={700}>{t('recipe.discover')}</Typography>
        <Typography variant="body2" color="text.secondary">{t('recipe.discoverDesc')}</Typography>
      </Box>
      <Button component={RouterLink} to="/recipe-basket" endIcon={<ArrowForward />}>
        {t('recipe.start')}
      </Button>
    </Paper>
  );
}
