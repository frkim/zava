import {
  DirectionsCar, ShoppingCart, AccessTime, Place, MoneyOff, Store,
} from '@mui/icons-material';
import InfoPage from './InfoSection';

export default function DrivePage() {
  return (
    <InfoPage
      heroTitleKey="info.drive.heroTitle"
      heroSubtitleKey="info.drive.heroSubtitle"
      heroGradientStops={['#00695c', '#4db6ac']}
      heroIcon={<DirectionsCar />}
      sections={[
        { titleKey: 'info.drive.howItWorksTitle', descKey: 'info.drive.step1', icon: <ShoppingCart /> },
        { titleKey: 'info.drive.howItWorksTitle', descKey: 'info.drive.step2', icon: <AccessTime /> },
        { titleKey: 'info.drive.howItWorksTitle', descKey: 'info.drive.step3', icon: <Place /> },
        { titleKey: 'info.drive.freeTitle', descKey: 'info.drive.freeDesc', icon: <MoneyOff /> },
        { titleKey: 'info.drive.storesTitle', descKey: 'info.drive.storesDesc', icon: <Store /> },
      ]}
    />
  );
}
