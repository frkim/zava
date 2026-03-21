import {
  PriceCheck, Balance, NotificationsActive, LocalOffer, Visibility,
} from '@mui/icons-material';
import InfoPage from './InfoSection';

export default function BestPricesPage() {
  return (
    <InfoPage
      heroTitleKey="info.bestprices.heroTitle"
      heroSubtitleKey="info.bestprices.heroSubtitle"
      heroGradient="linear-gradient(135deg, #c62828 0%, #ef5350 100%)"
      heroIcon={<PriceCheck />}
      sections={[
        { titleKey: 'info.bestprices.matchTitle', descKey: 'info.bestprices.matchDesc', icon: <Balance /> },
        { titleKey: 'info.bestprices.alertsTitle', descKey: 'info.bestprices.alertsDesc', icon: <NotificationsActive /> },
        { titleKey: 'info.bestprices.promosTitle', descKey: 'info.bestprices.promosDesc', icon: <LocalOffer /> },
        { titleKey: 'info.bestprices.transparencyTitle', descKey: 'info.bestprices.transparencyDesc', icon: <Visibility /> },
      ]}
    />
  );
}
