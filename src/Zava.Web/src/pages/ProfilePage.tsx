import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, TextField, Button, Grid, Switch,
  FormControlLabel, CircularProgress, Alert, Snackbar, Divider, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { getUser, updateUser, getOrders } from '../api';
import type { User, Order } from '../types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    Promise.all([getUser(), getOrders()])
      .then(([u, o]) => { setUser(u); setOrders(o); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!user) return;
    try {
      const updated = await updateUser(user);
      setUser(updated);
      setSnackbar('Profil mis à jour');
    } catch {
      setSnackbar('Erreur lors de la mise à jour');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!user) return <Alert severity="error">Utilisateur introuvable</Alert>;

  const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
    Pending: 'warning', Processing: 'info', Shipped: 'info', Delivered: 'success', Cancelled: 'error',
  };
  const statusLabels: Record<string, string> = {
    Pending: 'En attente', Processing: 'En cours', Shipped: 'Expédié', Delivered: 'Livré', Cancelled: 'Annulé',
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Mon profil</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Informations personnelles</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Prénom" value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Nom" value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Email" value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Téléphone" value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })} />
              </Grid>
            </Grid>

            <FormControlLabel
              control={<Switch checked={user.isPremium} onChange={(e) => setUser({ ...user, isPremium: e.target.checked })} />}
              label="Abonnement Premium"
              sx={{ mt: 2 }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Adresse de livraison</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Rue" value={user.shippingAddress?.street ?? ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...user.shippingAddress!, street: e.target.value } })} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Ville" value={user.shippingAddress?.city ?? ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...user.shippingAddress!, city: e.target.value } })} />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <TextField fullWidth label="CP" value={user.shippingAddress?.postalCode ?? ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...user.shippingAddress!, postalCode: e.target.value } })} />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <TextField fullWidth label="Pays" value={user.shippingAddress?.country ?? ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...user.shippingAddress!, country: e.target.value } })} />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Informations de paiement</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Type de carte" value={user.paymentInfo?.cardType ?? ''} disabled />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="4 derniers chiffres" value={user.paymentInfo?.lastFourDigits ?? ''} disabled />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Titulaire" value={user.paymentInfo?.cardHolderName ?? ''} disabled />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField fullWidth label="Expiration" value={user.paymentInfo?.expiryDate ?? ''} disabled />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Orders */}
      <Typography variant="h5" sx={{ mb: 2 }}>Mes commandes</Typography>
      {orders.length === 0 ? (
        <Alert severity="info">Aucune commande</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Articles</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Suivi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/orders/${order.id}`)}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{order.items.length} article{order.items.length > 1 ? 's' : ''}</TableCell>
                  <TableCell align="right">{order.total.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Chip label={statusLabels[order.status] ?? order.status} size="small"
                      color={statusColors[order.status] ?? 'default'} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{order.trackingNumber}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} message={snackbar} />
    </Box>
  );
}
