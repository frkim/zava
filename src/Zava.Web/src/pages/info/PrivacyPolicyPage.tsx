import InfoPage from './InfoSection';

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      heroTitleKey="info.privacy.title"
      heroSubtitleKey="info.privacy.lastUpdate"
      heroGradientStops={['#37474f', '#78909c']}
      sections={[
        { titleKey: 'info.privacy.introTitle', descKey: 'info.privacy.introDesc' },
        { titleKey: 'info.privacy.collectionTitle', descKey: 'info.privacy.collectionDesc' },
        { titleKey: 'info.privacy.purposeTitle', descKey: 'info.privacy.purposeDesc' },
        { titleKey: 'info.privacy.retentionTitle', descKey: 'info.privacy.retentionDesc' },
        { titleKey: 'info.privacy.rightsTitle', descKey: 'info.privacy.rightsDesc' },
        { titleKey: 'info.privacy.cookiesTitle', descKey: 'info.privacy.cookiesDesc' },
      ]}
    />
  );
}
