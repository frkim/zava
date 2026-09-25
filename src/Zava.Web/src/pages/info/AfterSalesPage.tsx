import {
  Build, Phone, Email, Chat, VerifiedUser, Construction,
} from '@mui/icons-material';
import InfoPage from './InfoSection';

export default function AfterSalesPage() {
  return (
    <InfoPage
      heroTitleKey="info.aftersales.heroTitle"
      heroSubtitleKey="info.aftersales.heroSubtitle"
      heroGradientStops={['#6a1b9a', '#ab47bc']}
      heroIcon={<Build />}
      sections={[
        { titleKey: 'info.aftersales.phoneTitle', descKey: 'info.aftersales.phoneDesc', icon: <Phone /> },
        { titleKey: 'info.aftersales.emailTitle', descKey: 'info.aftersales.emailDesc', icon: <Email /> },
        { titleKey: 'info.aftersales.chatTitle', descKey: 'info.aftersales.chatDesc', icon: <Chat /> },
        { titleKey: 'info.aftersales.warrantyTitle', descKey: 'info.aftersales.warrantyDesc', icon: <VerifiedUser /> },
        { titleKey: 'info.aftersales.repairTitle', descKey: 'info.aftersales.repairDesc', icon: <Construction /> },
      ]}
    />
  );
}
