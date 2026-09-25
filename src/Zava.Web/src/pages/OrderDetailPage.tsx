import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { ArrowBack, Receipt, Search } from '@mui/icons-material';
import { ApiError, getOrder } from '../api';
import type { Order, OrderStatus } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { errorDetail, orderStatusKey, paymentMethodKey } from '../components/commerce/commerceText';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { price, date } = useFormatters();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const loadOrder = useCallback(async () => {
    const orderId = Number(id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      setOrder(await getOrder(orderId));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) setNotFound(true);
      else setError(errorDetail(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const statusColors: Record<OrderStatus, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
    Pending: 'warning',
    Processing: 'info',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'error',
  };

  if (loading) {
    return (
      <Box>
        <PageTitle>{id ? `${t('com.order.titlePrefix')}${id}` : t('order.notFound')}</PageTitle>
        <LoadingState />
      </Box>
    );
  }
  if (error) {
    return (
      <Box>
        <PageTitle>{id ? `${t('com.order.titlePrefix')}${id}` : t('order.notFound')}</PageTitle>
        <ErrorState detail={error} onRetry={() => void loadOrder()} />
      </Box>
    );
  }
  if (notFound || !order) {
    return (
      <Box>
        <PageTitle>{t('order.notFound')}</PageTitle>
        <EmptyState
          title={t('order.notFound')}
          description={t('com.order.notFoundDesc')}
          action={(
            <>
              <Button variant="contained" component={RouterLink} to="/profile" startIcon={<Receipt />} sx={{ m: 0.5 }}>{t('com.order.backToProfile')}</Button>
              <Button variant="outlined" component={RouterLink} to="/search" startIcon={<Search />} sx={{ m: 0.5 }}>{t('notFound.catalog')}</Button>
            </>
          )}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/profile')} sx={{ mb: 2 }}>
        {t('product.back')}
      </Button>

      <PageTitle actions={<Chip label={t(orderStatusKey(order.status))} color={statusColors[order.status]} />}>
        {t('com.order.titlePrefix')}{order.id}
      </PageTitle>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('order.orderedOn')} {date(order.createdAt, { day: 'numeric', month: 'long', year: 'numeric' })}
        </Typography>
        <Typography variant="body2">{t('order.tracking')} : {order.trackingNumber}</Typography>
        <Typography variant="body2">{t('order.payment')} : {t(paymentMethodKey(order.paymentMethod))}</Typography>
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
              <TableRow key={`${item.productId}-${item.variantId ?? 'no'}-${item.offerTriggerProductId ?? 'regular'}-${i}`}>
                <TableCell>
                  <Typography variant="subtitle2">{item.productName}</Typography>
                  {item.variantName && <Typography variant="caption" color="text.secondary">{item.variantName}</Typography>}
                  {item.discountPercent && (
                    <Typography variant="caption" color="error" display="block">
                      {t('com.cart.offer')} -{item.discountPercent}%
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">{price(item.unitPrice)}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">{price(item.subtotal)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right"><Typography fontWeight={600}>{t('cart.total')}</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight={700}>{price(order.total)}</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>{t('checkout.shippingAddress')}</Typography>
        <Typography>{order.shippingAddress.street}</Typography>
        <Typography>{order.shippingAddress.postalCode} {order.shippingAddress.city}</Typography>
        <Typography>{order.shippingAddress.country}</Typography>
      </Paper>
    </Box>
  );
}
