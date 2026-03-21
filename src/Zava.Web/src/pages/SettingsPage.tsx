import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert, Snackbar, Grid, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { getConfig, changeSiteType, resetData, createProduct, getCategories } from '../api';
import { useSite } from '../context/SiteContext';
import type { SiteConfig, Category } from '../types';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { refreshConfig } = useSite();
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
      setSnackbar(`Site changé en : ${updated.availableSiteTypes.find(s => s.type === siteType)?.name}`);
      // Navigate home so the user sees the new site
      navigate('/');
    } catch {
      setSnackbar('Erreur lors du changement');
    }
  };

  const handleReset = async () => {
    try {
      await resetData();
      const cats = await getCategories();
      setCategories(cats);
      await refreshConfig();
      setSnackbar('Données réinitialisées');
    } catch {
      setSnackbar('Erreur lors de la réinitialisation');
    }
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct);
      setDialogOpen(false);
      setNewProduct({ name: '', description: '', price: 0, categoryId: 0, brand: '', stock: 100 });
      setSnackbar('Produit créé');
    } catch {
      setSnackbar('Erreur lors de la création');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!config) return <Alert severity="error">Erreur de chargement</Alert>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>⚙️ Paramètres</Typography>

      {/* Site Type */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Type de site e-commerce</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Changez le type de site pour charger un catalogue de produits différent.
          Toutes les données (panier, commandes) seront réinitialisées.
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
                <Typography variant="subtitle1" fontWeight={600}>{st.name}</Typography>
                <Typography variant="caption" color="text.secondary">{st.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Data management */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Gestion des données</Typography>
        <Button variant="outlined" color="error" onClick={handleReset}>
          Réinitialiser toutes les données
        </Button>
      </Paper>

      {/* Create product */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Créer un produit</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ajoutez un produit personnalisé au catalogue actuel.
        </Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Nouveau produit
        </Button>
      </Paper>

      {/* Create Product Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un produit</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Nom du produit" value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Description" multiline rows={3} value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Prix" type="number" value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Stock" type="number" value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Marque" value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select value={newProduct.categoryId} label="Catégorie"
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: Number(e.target.value) })}>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleCreateProduct}
            disabled={!newProduct.name || !newProduct.brand || newProduct.price <= 0}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  );
}
