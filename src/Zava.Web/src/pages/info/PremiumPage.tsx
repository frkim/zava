import { Paper, Typography, Button } from '@mui/material';
import {
  Star, LocalShipping, ShoppingBag, AssignmentReturn, SupportAgent, Savings,
} from '@mui/icons-material';
import InfoPage from './InfoSection';
import { useLanguage } from '../../context/LanguageContext';

export default function PremiumPage() {
  const { t } = useLanguage();

  return (
    <InfoPage
      heroTitleKey="info.premium.heroTitle"
      heroSubtitleKey="info.premium.heroSubtitle"
      heroGradient="linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)"
      heroIcon={<Star />}
      sections={[
        { titleKey: 'info.premium.freeExpressTitle', descKey: 'info.premium.freeExpressDesc', icon: <LocalShipping /> },
        { titleKey: 'info.premium.privateSalesTitle', descKey: 'info.premium.privateSalesDesc', icon: <ShoppingBag /> },
        { titleKey: 'info.premium.extendedReturnsTitle', descKey: 'info.premium.extendedReturnsDesc', icon: <AssignmentReturn /> },
        { titleKey: 'info.premium.supportTitle', descKey: 'info.premium.supportDesc', icon: <SupportAgent /> },
        { titleKey: 'info.premium.cashbackTitle', descKey: 'info.premium.cashbackDesc', icon: <Savings /> },
      ]}
      extra={
        <Paper sx={{ p: 3, mt: 2, textAlign: 'center', bgcolor: 'secondary.main', color: 'white', borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>{t('info.premium.priceLabel')}</Typography>
          <Button variant="contained" sx={{ bgcolor: 'white', color: 'secondary.main', '&:hover': { bgcolor: '#f5f5f5' } }}>
            {t('info.premium.subscribe')}
          </Button>
        </Paper>
      }
    />
  );
}
