import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, CircularProgress, Alert, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getOrder } from '../api';
import type { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
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
  if (!order) return <Alert severity="error">{t('order.notFound')}</Alert>;

  const statusLabels: Record<string, string> = {
    Pending: t('status.Pending'), Processing: t('status.Processing'), Shipped: t('status.Shipped'), Delivered: t('status.Delivered'), Cancelled: t('status.Cancelled'),
  };
  const statusColors: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
    Pending: 'warning', Processing: 'info', Shipped: 'info', Delivered: 'success', Cancelled: 'error',
  };

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/profile')} sx={{ mb: 2 }}>
        {t('product.back')}
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Commande #{order.id}</Typography>
        <Chip label={statusLabels[order.status] ?? order.status}
          color={statusColors[order.status] ?? 'default'} />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('order.orderedOn')} {new Date(order.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Typography>
        <Typography variant="body2">{t('order.tracking')} : {order.trackingNumber}</Typography>
        <Typography variant="body2">{t('order.payment')} : {order.paymentMethod}</Typography>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('cart.product')}</TableCell>
              <TableCell align="right">{t('cart.unitPrice')}</TableCell>
              <TableCell align="center">{t('cart.quantity')}</TableCell>
              <TableCell align="right">{t('cart.subtotal')}</TableCell>
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
              <TableCell colSpan={3} align="right"><Typography fontWeight={600}>{t('cart.total')}</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight={700}>{order.total.toFixed(2)} €</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>{t('checkout.shippingAddress')}</Typography>
        <Typography>{order.shippingAddress.street}</Typography>
        <Typography>{order.shippingAddress.postalCode} {order.shippingAddress.city}</Typography>
        <Typography>{order.shippingAddress.country}</Typography>
      </Paper>
    </Box>
  );
}
