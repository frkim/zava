import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert, Snackbar, Grid, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { getConfig, changeSiteType, resetData, createProduct, getCategories } from '../api';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import type { SiteConfig, Category } from '../types';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { refreshConfig } = useSite();
  const { lang, t } = useLanguage();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState('');

  // Create product dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: 0, categoryId: 0, brand: '', stock: 100,
  });

  const load = async () => {
    try {
      const [c, cats] = await Promise.all([getConfig(), getCategories()]);
      setConfig(c);
      setCategories(cats);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleChangeSiteType = async (siteType: string) => {
    try {
      const updated = await changeSiteType(siteType);
      setConfig(updated);
      const cats = await getCategories();
      setCategories(cats);
      // Refresh global context (title, cart badge, etc.)
      await refreshConfig();
      setSnackbar(`${t('settings.siteChanged')} : ${lang === 'en' ? (updated.availableSiteTypes.find(s => s.type === siteType)?.nameEn) : (updated.availableSiteTypes.find(s => s.type === siteType)?.name)}`);
      // Navigate home so the user sees the new site
      navigate('/');
    } catch {
      setSnackbar(t('settings.changeError'));
    }
  };

  const handleReset = async () => {
    try {
      await resetData();
      const cats = await getCategories();
      setCategories(cats);
      await refreshConfig();
      setSnackbar(t('settings.dataReset'));
    } catch {
      setSnackbar(t('settings.resetError'));
    }
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct);
      setDialogOpen(false);
      setNewProduct({ name: '', description: '', price: 0, categoryId: 0, brand: '', stock: 100 });
      setSnackbar(t('settings.productCreated'));
    } catch {
      setSnackbar(t('settings.createError'));
    }
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
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => handleChangeSiteType(st.type)}
              >
                <Typography variant="subtitle1" fontWeight={600}>{lang === 'en' && st.nameEn ? st.nameEn : st.name}</Typography>
                <Typography variant="caption" color="text.secondary">{lang === 'en' && st.descriptionEn ? st.descriptionEn : st.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Data management */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{t('settings.dataManagement')}</Typography>
        <Button variant="outlined" color="error" onClick={handleReset}>
          {t('settings.resetAll')}
        </Button>
      </Paper>

      {/* Create product */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{t('settings.createProduct')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('settings.createProductDesc')}
        </Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          {t('settings.newProduct')}
        </Button>
      </Paper>

      {/* Create Product Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('settings.createProduct')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label={t('settings.productName')} value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label={t('settings.description')} multiline rows={3} value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label={t('settings.price')} type="number" value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label={t('settings.stock')} type="number" value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label={t('settings.brand')} value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('settings.category')}</InputLabel>
                <Select value={newProduct.categoryId} label={t('settings.category')}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: Number(e.target.value) })}>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{lang === 'en' && cat.nameEn ? cat.nameEn : cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('settings.cancel')}</Button>
          <Button variant="contained" onClick={handleCreateProduct}
            disabled={!newProduct.name || !newProduct.brand || newProduct.price <= 0}>
            {t('settings.create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  );
}
