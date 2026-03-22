import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper,
  CircularProgress, Alert, Snackbar, Grid,
} from '@mui/material';
import {
  Devices, Kitchen, Spa, ElectricalServices, Construction, LocalGroceryStore,
} from '@mui/icons-material';
import { getConfig, changeSiteType } from '../api';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import type { SiteConfig } from '../types';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { refreshConfig } = useSite();
  const { lang, t } = useLanguage();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState('');

  const load = async () => {
    try {
      const c = await getConfig();
      setConfig(c);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleChangeSiteType = async (siteType: string) => {
    try {
      const updated = await changeSiteType(siteType);
      setConfig(updated);
      // Refresh global context (title, cart badge, etc.)
      await refreshConfig();
      setSnackbar(`${t('settings.siteChanged')} : ${lang === 'en' ? (updated.availableSiteTypes.find(s => s.type === siteType)?.nameEn) : (updated.availableSiteTypes.find(s => s.type === siteType)?.name)}`);
      // Navigate home so the user sees the new site
      navigate('/');
    } catch {
      setSnackbar(t('settings.changeError'));
    }
  };

  const siteTypeIcons: Record<string, React.ReactNode> = {
    Electronics: <Devices sx={{ fontSize: 48, color: 'primary.main' }} />,
    Appliances: <Kitchen sx={{ fontSize: 48, color: 'primary.main' }} />,
    Cosmetics: <Spa sx={{ fontSize: 48, color: 'primary.main' }} />,
    Electrical: <ElectricalServices sx={{ fontSize: 48, color: 'primary.main' }} />,
    DIY: <Construction sx={{ fontSize: 48, color: 'primary.main' }} />,
    Grocery: <LocalGroceryStore sx={{ fontSize: 48, color: 'primary.main' }} />,
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!config) return <Alert severity="error">{t('common.error')}</Alert>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>{t('settings.title')}</Typography>

      {/* Site Type */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{t('settings.siteType')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('settings.siteTypeDesc')}
        </Typography>

        <Grid container spacing={2}>
          {config.availableSiteTypes.map((st) => (
            <Grid key={st.type} size={{ xs: 12, sm: 6 }}>
              <Paper
                variant={config.currentSiteType === st.type ? 'elevation' : 'outlined'}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: config.currentSiteType === st.type ? '2px solid' : undefined,
                  borderColor: 'primary.main',
                  textAlign: 'center',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => handleChangeSiteType(st.type)}
              >
                <Box sx={{ mb: 1 }}>{siteTypeIcons[st.type]}</Box>
                <Typography variant="subtitle1" fontWeight={600}>{lang === 'en' && st.nameEn ? st.nameEn : st.name}</Typography>
                <Typography variant="caption" color="text.secondary">{lang === 'en' && st.descriptionEn ? st.descriptionEn : st.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  );
}
