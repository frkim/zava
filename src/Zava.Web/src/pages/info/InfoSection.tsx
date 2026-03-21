import type { ReactNode } from 'react';
import { Typography, Paper, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import type { TranslationKey } from '../../i18n';

interface Section {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon?: ReactNode;
}

interface InfoPageProps {
  heroTitleKey: TranslationKey;
  heroSubtitleKey: TranslationKey;
  heroGradient?: string;
  heroIcon?: ReactNode;
  sections: Section[];
  extra?: ReactNode;
}

export default function InfoPage({ heroTitleKey, heroSubtitleKey, heroGradient, heroIcon, sections, extra }: InfoPageProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: heroGradient ?? 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          {heroIcon && <Box sx={{ display: 'flex', '& .MuiSvgIcon-root': { fontSize: 48 } }}>{heroIcon}</Box>}
          <Typography variant="h4" fontWeight={700}>{t(heroTitleKey)}</Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 700 }}>{t(heroSubtitleKey)}</Typography>
      </Paper>

      {sections.map((s, i) => (
        <Paper key={i} sx={{ p: 3, mb: 2 }} variant="outlined">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            {s.icon && <Box sx={{ display: 'flex', color: 'primary.main', '& .MuiSvgIcon-root': { fontSize: 40 } }}>{s.icon}</Box>}
            <Typography variant="h6" fontWeight={600}>{t(s.titleKey)}</Typography>
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{t(s.descKey)}</Typography>
        </Paper>
      ))}

      {extra}

      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>{t('info.backToHome')}</Button>
      </Box>
    </Box>
  );
}
