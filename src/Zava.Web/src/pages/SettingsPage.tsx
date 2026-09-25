import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid,
  InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Devices, Kitchen, Spa, ElectricalServices, Construction, LocalGroceryStore,
} from '@mui/icons-material';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import { getDefaultThemeId, siteThemeChoices } from '../theme';
import type { SiteType } from '../types';
import PageTitle from '../components/PageTitle';
import { ErrorState, LoadingState } from '../components/PageState';

export default function SettingsPage() {
  const navigate = useNavigate();
  const {
    config, configError, selectedThemeId, defaultSelection, refreshConfig, selectSiteType,
  } = useSite();
  const { lang, t } = useLanguage();
  const [snackbar, setSnackbar] = useState('');
  const [draft, setDraft] = useState<Partial<{ siteType: SiteType; themeId: string; makeDefault: boolean }>>({});
  const [saving, setSaving] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const pendingSiteType = draft.siteType ?? config?.currentSiteType ?? null;
  const pendingThemeId = draft.themeId ?? selectedThemeId;
  const isPendingDefault = !!pendingSiteType
    && defaultSelection?.siteType === pendingSiteType
    && defaultSelection.themeId === pendingThemeId;
  const makeDefault = draft.makeDefault ?? isPendingDefault;
  const changesStoreType = !!config && !!pendingSiteType && pendingSiteType !== config.currentSiteType;
  const changesTheme = !!config && pendingThemeId !== selectedThemeId;
  const changesDefault = makeDefault !== isPendingDefault;
  const hasChanges = changesStoreType || changesTheme || changesDefault;

  const handleSelectSiteType = (siteType: SiteType) => {
    const themeId = getDefaultThemeId(siteType);
    setDraft({
      siteType,
      themeId,
      makeDefault:
      defaultSelection?.siteType === siteType
      && defaultSelection.themeId === themeId,
    });
  };

  const handleSelectTheme = (event: SelectChangeEvent) => {
    const themeId = event.target.value;
    setDraft((current) => ({
      ...current,
      themeId,
      makeDefault:
        defaultSelection?.siteType === pendingSiteType
        && defaultSelection.themeId === themeId,
    }));
  };

  const applySelection = async () => {
    if (!pendingSiteType || !pendingThemeId || !hasChanges) return;
    setSaving(true);
    try {
      const result = await selectSiteType(
        { siteType: pendingSiteType, themeId: pendingThemeId },
        makeDefault,
      );
      const site = result.config.availableSiteTypes.find((s) => s.type === pendingSiteType);
      const siteName = lang === 'en' && site?.nameEn ? site.nameEn : site?.name;
      setSnackbar(result.storeReset
        ? `${t('si.settings.storeChanged')} ${siteName ?? ''}`.trim()
        : t('si.settings.themeApplied'));
      setDraft({});
      setConfirmResetOpen(false);
      navigate(`/?site=${encodeURIComponent(pendingSiteType)}&theme=${encodeURIComponent(pendingThemeId)}`);
    } catch {
      setSnackbar(t('settings.changeError'));
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = () => {
    if (changesStoreType) {
      setConfirmResetOpen(true);
      return;
    }
    void applySelection();
  };

  const siteTypeIcons: Record<string, ReactNode> = {
    Electronics: <Devices sx={{ fontSize: 48, color: 'primary.main' }} />,
    Appliances: <Kitchen sx={{ fontSize: 48, color: 'primary.main' }} />,
    Cosmetics: <Spa sx={{ fontSize: 48, color: 'primary.main' }} />,
    Electrical: <ElectricalServices sx={{ fontSize: 48, color: 'primary.main' }} />,
    DIY: <Construction sx={{ fontSize: 48, color: 'primary.main' }} />,
    Grocery: <LocalGroceryStore sx={{ fontSize: 48, color: 'primary.main' }} />,
  };

  if (configError && !config) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <PageTitle>{t('settings.title')}</PageTitle>
        <ErrorState detail={configError} onRetry={refreshConfig} />
      </Box>
    );
  }

  if (!config) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <PageTitle>{t('settings.title')}</PageTitle>
        <LoadingState label={t('si.settings.loading')} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <PageTitle subtitle={t('si.settings.subtitle')}>{t('settings.title')}</PageTitle>
      {configError && <ErrorState detail={configError} onRetry={refreshConfig} />}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>{t('settings.siteType')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('settings.siteTypeDesc')}
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <FormLabel id="storefront-type-label">{t('si.settings.storeTypeLegend')}</FormLabel>
          <RadioGroup
            aria-labelledby="storefront-type-label"
            name="storefront-type"
            value={pendingSiteType ?? ''}
            onChange={(event) => handleSelectSiteType(event.target.value as SiteType)}
          >
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {config.availableSiteTypes.map((st) => (
                <Grid key={st.type} size={{ xs: 12, sm: 6 }}>
                  <Paper
                    variant={pendingSiteType === st.type ? 'elevation' : 'outlined'}
                    sx={{
                      display: 'block',
                      height: '100%',
                      p: 2,
                      cursor: 'pointer',
                      border: pendingSiteType === st.type ? '2px solid' : '1px solid',
                      borderColor: pendingSiteType === st.type ? 'primary.main' : 'divider',
                      textAlign: 'center',
                      '&:hover': { bgcolor: 'action.hover' },
                      '&:focus-within': {
                        outline: '3px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: 2,
                      },
                    }}
                  >
                    <FormControlLabel
                      value={st.type}
                      control={<Radio />}
                      label={(
                        <Stack spacing={1} alignItems="center" sx={{ width: '100%' }}>
                          <Box aria-hidden>{siteTypeIcons[st.type]}</Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {lang === 'en' && st.nameEn ? st.nameEn : st.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {lang === 'en' && st.descriptionEn ? st.descriptionEn : st.description}
                          </Typography>
                        </Stack>
                      )}
                      sx={{
                        m: 0,
                        alignItems: 'flex-start',
                        width: '100%',
                        '.MuiFormControlLabel-label': { flex: 1 },
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>

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
              <FormHelperText>{t('si.settings.themeHelp')}</FormHelperText>
            </FormControl>

            <FormControlLabel
              control={<Checkbox checked={makeDefault} onChange={(event) => setDraft((current) => ({ ...current, makeDefault: event.target.checked }))} />}
              label={t('settings.makeDefault')}
            />

            {changesStoreType ? (
              <Alert severity="warning">
                {t('si.settings.storeResetWarning')}
              </Alert>
            ) : (
              <Alert severity="info">
                {t('si.settings.themeOnlyNotice')}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleConfirm} disabled={saving || !hasChanges}>
                {saving ? t('settings.saving') : t('si.settings.apply')}
              </Button>
            </Box>
          </Stack>
        )}
      </Paper>

      <Dialog open={confirmResetOpen} onClose={() => setConfirmResetOpen(false)} aria-labelledby="store-reset-dialog-title">
        <DialogTitle id="store-reset-dialog-title">{t('si.settings.confirmStoreResetTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('si.settings.confirmStoreResetBody')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmResetOpen(false)}>{t('settings.cancel')}</Button>
          <Button variant="contained" color="warning" disabled={saving} onClick={() => void applySelection()}>
            {saving ? t('settings.saving') : t('si.settings.confirmStoreResetAction')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  );
}
