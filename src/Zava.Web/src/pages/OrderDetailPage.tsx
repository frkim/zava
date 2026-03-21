import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, CircularProgress, Alert, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getOrder } from '../api';
import type { Order } from '../types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getOrder(parseInt(id))
      .then(setOrder)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!order) return <Alert severity="error">Commande introuvable</Alert>;

  const statusLabels: Record<string, string> = {
    Pending: 'En attente', Processing: 'En cours', Shipped: 'Expédié', Delivered: 'Livré', Cancelled: 'Annulé',
  };
  const statusColors: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
    Pending: 'warning', Processing: 'info', Shipped: 'info', Delivered: 'success', Cancelled: 'error',
  };

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/profile')} sx={{ mb: 2 }}>
        Retour
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Commande #{order.id}</Typography>
        <Chip label={statusLabels[order.status] ?? order.status}
          color={statusColors[order.status] ?? 'default'} />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Typography>
        <Typography variant="body2">Suivi : {order.trackingNumber}</Typography>
        <Typography variant="body2">Paiement : {order.paymentMethod}</Typography>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell align="right">Prix unitaire</TableCell>
              <TableCell align="center">Qté</TableCell>
              <TableCell align="right">Sous-total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Typography variant="subtitle2">{item.productName}</Typography>
                  {item.variantName && <Typography variant="caption" color="text.secondary">{item.variantName}</Typography>}
                </TableCell>
                <TableCell align="right">{item.unitPrice.toFixed(2)} €</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">{item.subtotal.toFixed(2)} €</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right"><Typography fontWeight={600}>Total</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight={700}>{order.total.toFixed(2)} €</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Adresse de livraison</Typography>
        <Typography>{order.shippingAddress.street}</Typography>
        <Typography>{order.shippingAddress.postalCode} {order.shippingAddress.city}</Typography>
        <Typography>{order.shippingAddress.country}</Typography>
      </Paper>
    </Box>
  );
}
