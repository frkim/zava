import InfoPage from './InfoSection';

export default function LegalNoticePage() {
  return (
    <InfoPage
      heroTitleKey="info.legal.title"
      heroSubtitleKey="info.legal.editorTitle"
      heroGradientStops={['#37474f', '#78909c']}
      sections={[
        { titleKey: 'info.legal.editorTitle', descKey: 'info.legal.editorDesc' },
        { titleKey: 'info.legal.hostingTitle', descKey: 'info.legal.hostingDesc' },
        { titleKey: 'info.legal.ipTitle', descKey: 'info.legal.ipDesc' },
        { titleKey: 'info.legal.contactTitle', descKey: 'info.legal.contactDesc' },
      ]}
    />
  );
}
