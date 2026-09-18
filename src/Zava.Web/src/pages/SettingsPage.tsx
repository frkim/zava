import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper,
  Button, Checkbox, CircularProgress, FormControl, FormControlLabel,
  Grid, InputLabel, MenuItem, Select, Snackbar, Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Devices, Kitchen, Spa, ElectricalServices, Construction, LocalGroceryStore,
} from '@mui/icons-material';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { getDefaultThemeId, siteThemeChoices } from '../theme';
import type { SiteType } from '../types';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { config, selectedThemeId, defaultSelection, selectSiteType } = useSite();
  const { lang, t } = useLanguage();
  const [snackbar, setSnackbar] = useState('');
  const [pendingSiteType, setPendingSiteType] = useState<SiteType | null>(null);
  const [pendingThemeId, setPendingThemeId] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!config) return;
    setPendingSiteType(config.currentSiteType);
    setPendingThemeId(selectedThemeId);
    setMakeDefault(
      defaultSelection?.siteType === config.currentSiteType
      && defaultSelection.themeId === selectedThemeId,
    );
  }, [config, defaultSelection, selectedThemeId]);

  const handleSelectSiteType = (siteType: SiteType) => {
    setPendingSiteType(siteType);
    setPendingThemeId(getDefaultThemeId(siteType));
    setMakeDefault(
      defaultSelection?.siteType === siteType
      && defaultSelection.themeId === getDefaultThemeId(siteType),
    );
  };

  const handleSelectTheme = (event: SelectChangeEvent) => {
    const themeId = event.target.value;
    setPendingThemeId(themeId);
    setMakeDefault(
      defaultSelection?.siteType === pendingSiteType
      && defaultSelection.themeId === themeId,
    );
  };

  const handleConfirm = async () => {
    if (!pendingSiteType || !pendingThemeId) return;
    setSaving(true);
    try {
      const updated = await selectSiteType(
        { siteType: pendingSiteType, themeId: pendingThemeId },
        makeDefault,
      );
      setSnackbar(`${t('settings.siteChanged')} : ${lang === 'en' ? (updated.availableSiteTypes.find(s => s.type === pendingSiteType)?.nameEn) : (updated.availableSiteTypes.find(s => s.type === pendingSiteType)?.name)}`);
      navigate(`/?site=${encodeURIComponent(pendingSiteType)}&theme=${encodeURIComponent(pendingThemeId)}`);
    } catch {
      setSnackbar(t('settings.changeError'));
    } finally {
      setSaving(false);
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

  if (!config) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

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
                variant={pendingSiteType === st.type ? 'elevation' : 'outlined'}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: pendingSiteType === st.type ? '2px solid' : undefined,
                  borderColor: 'primary.main',
                  textAlign: 'center',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => handleSelectSiteType(st.type)}
              >
                <Box sx={{ mb: 1 }}>{siteTypeIcons[st.type]}</Box>
                <Typography variant="subtitle1" fontWeight={600}>{lang === 'en' && st.nameEn ? st.nameEn : st.name}</Typography>
                <Typography variant="caption" color="text.secondary">{lang === 'en' && st.descriptionEn ? st.descriptionEn : st.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {pendingSiteType && (
          <Stack spacing={2.5} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="site-theme-label">{t('settings.theme')}</InputLabel>
              <Select
                labelId="site-theme-label"
                value={pendingThemeId}
                label={t('settings.theme')}
                onChange={handleSelectTheme}
              >
                {siteThemeChoices[pendingSiteType].map((choice) => (
                  <MenuItem key={choice.id} value={choice.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: choice.primary, borderRadius: '4px 0 0 4px' }} />
                        <Box sx={{ width: 20, height: 20, bgcolor: choice.secondary, borderRadius: '0 4px 4px 0' }} />
                      </Box>
                      {lang === 'en' ? choice.nameEn : choice.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Checkbox checked={makeDefault} onChange={(event) => setMakeDefault(event.target.checked)} />}
              label={t('settings.makeDefault')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleConfirm} disabled={saving}>
                {saving ? t('settings.saving') : t('settings.confirm')}
              </Button>
            </Box>
          </Stack>
        )}
      </Paper>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  );
}
