import type { ReactNode } from 'react';
import { Typography, Paper, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import type { TranslationKey } from '../../i18n';
import PageTitle from '../../components/PageTitle';
import { surfaceForWhiteText } from '../../theme';

interface Section {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon?: ReactNode;
}

interface InfoPageProps {
  heroTitleKey: TranslationKey;
  heroSubtitleKey: TranslationKey;
  heroGradientStops?: readonly [string, string];
  heroIcon?: ReactNode;
  sections: Section[];
  extra?: ReactNode;
}

export default function InfoPage({ heroTitleKey, heroSubtitleKey, heroGradientStops, heroIcon, sections, extra }: InfoPageProps) {
  const { t } = useLanguage();
  const [start, end] = heroGradientStops ?? ['#1a237e', '#534bae'];
  const heroGradient = `linear-gradient(135deg, ${surfaceForWhiteText(start)} 0%, ${surfaceForWhiteText(end)} 100%)`;

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: heroGradient,
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
          {heroIcon && <Box aria-hidden sx={{ display: 'flex', pt: 0.5, '& .MuiSvgIcon-root': { fontSize: 48 } }}>{heroIcon}</Box>}
          <PageTitle sx={{ mb: 0, '& [data-page-title]': { color: 'inherit' } }}>{t(heroTitleKey)}</PageTitle>
        </Box>
        <Typography variant="body1" sx={{ maxWidth: 700 }}>{t(heroSubtitleKey)}</Typography>
      </Paper>

      {sections.map((s, i) => (
        <Paper key={i} sx={{ p: 3, mb: 2 }} variant="outlined">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            {s.icon && <Box sx={{ display: 'flex', color: 'primary.main', '& .MuiSvgIcon-root': { fontSize: 40 } }}>{s.icon}</Box>}
            <Typography variant="h6" component="h2" fontWeight={600}>{t(s.titleKey)}</Typography>
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{t(s.descKey)}</Typography>
        </Paper>
      ))}

      {extra}

      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" component={RouterLink} to="/">{t('info.backToHome')}</Button>
      </Box>
    </Box>
  );
}
