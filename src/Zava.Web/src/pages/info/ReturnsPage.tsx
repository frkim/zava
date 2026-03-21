import {
  AssignmentReturn, CheckCircle, EditNote, Inventory2, LocalShipping, AccountBalanceWallet,
} from '@mui/icons-material';
import InfoPage from './InfoSection';

export default function ReturnsPage() {
  return (
    <InfoPage
      heroTitleKey="info.returns.heroTitle"
      heroSubtitleKey="info.returns.heroSubtitle"
      heroGradient="linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
      heroIcon={<AssignmentReturn />}
      sections={[
        { titleKey: 'info.returns.eligibilityTitle', descKey: 'info.returns.eligibilityDesc', icon: <CheckCircle /> },
        { titleKey: 'info.returns.step1Title', descKey: 'info.returns.step1Desc', icon: <EditNote /> },
        { titleKey: 'info.returns.step2Title', descKey: 'info.returns.step2Desc', icon: <Inventory2 /> },
        { titleKey: 'info.returns.step3Title', descKey: 'info.returns.step3Desc', icon: <LocalShipping /> },
        { titleKey: 'info.returns.refundTitle', descKey: 'info.returns.refundDesc', icon: <AccountBalanceWallet /> },
      ]}
    />
  );
}
