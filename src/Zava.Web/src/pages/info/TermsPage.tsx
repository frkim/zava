import { Typography } from '@mui/material';
import InfoPage from './InfoSection';
import { useLanguage } from '../../context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <InfoPage
      heroTitleKey="info.terms.title"
      heroSubtitleKey="info.terms.lastUpdate"
      heroGradient="linear-gradient(135deg, #37474f 0%, #78909c 100%)"
      sections={[
        { titleKey: 'info.terms.s1Title', descKey: 'info.terms.s1Desc' },
        { titleKey: 'info.terms.s2Title', descKey: 'info.terms.s2Desc' },
        { titleKey: 'info.terms.s3Title', descKey: 'info.terms.s3Desc' },
        { titleKey: 'info.terms.s4Title', descKey: 'info.terms.s4Desc' },
        { titleKey: 'info.terms.s5Title', descKey: 'info.terms.s5Desc' },
        { titleKey: 'info.terms.s6Title', descKey: 'info.terms.s6Desc' },
      ]}
    />
  );
}
