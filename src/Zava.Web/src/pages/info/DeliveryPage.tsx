import {
  LocalShipping, FlashOn, Place, GpsFixed, Info,
} from '@mui/icons-material';
import InfoPage from './InfoSection';

export default function DeliveryPage() {
  return (
    <InfoPage
      heroTitleKey="info.delivery.heroTitle"
      heroSubtitleKey="info.delivery.heroSubtitle"
      heroGradient="linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)"
      heroIcon={<LocalShipping />}
      sections={[
        { titleKey: 'info.delivery.standardTitle', descKey: 'info.delivery.standardDesc', icon: <LocalShipping /> },
        { titleKey: 'info.delivery.expressTitle', descKey: 'info.delivery.expressDesc', icon: <FlashOn /> },
        { titleKey: 'info.delivery.relayTitle', descKey: 'info.delivery.relayDesc', icon: <Place /> },
        { titleKey: 'info.delivery.trackingTitle', descKey: 'info.delivery.trackingDesc', icon: <GpsFixed /> },
        { titleKey: 'info.delivery.conditionsTitle', descKey: 'info.delivery.conditionsDesc', icon: <Info /> },
      ]}
    />
  );
}
