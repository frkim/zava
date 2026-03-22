import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, TextField, Button, Grid, Switch,
  FormControlLabel, CircularProgress, Alert, Snackbar, Divider, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, RadioGroup, Radio, FormControl, FormLabel,
} from '@mui/material';
import {
  Person, LocalShipping, Payment, ShoppingBag, Home, Store, Lock,
  DirectionsCar, Speed, CreditCard, AccountBalanceWallet,
} from '@mui/icons-material';
import { getUser, updateUser, getOrders } from '../api';
import type { User, Order, DeliveryMethod, PaymentMethod as PaymentMethodType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import type { TranslationKey } from '../i18n';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState('');
  const [tab, setTab] = useState(0);

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
      setSnackbar(t('profile.saved'));
    } catch {
      setSnackbar(t('profile.saveError'));
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!user) return <Alert severity="error">{t('profile.userNotFound')}</Alert>;

  const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
    Pending: 'warning', Processing: 'info', Shipped: 'info', Delivered: 'success', Cancelled: 'error',
  };
  const statusLabels: Record<string, string> = {
    Pending: t('status.Pending'), Processing: t('status.Processing'), Shipped: t('status.Shipped'), Delivered: t('status.Delivered'), Cancelled: t('status.Cancelled'),
  };

  const deliveryOptions: { value: DeliveryMethod; labelKey: TranslationKey; icon: React.ReactNode }[] = [
    { value: 'Home', labelKey: 'profile.delivery.home', icon: <Home /> },
    { value: 'Relay', labelKey: 'profile.delivery.relay', icon: <Store /> },
    { value: 'Locker', labelKey: 'profile.delivery.locker', icon: <Lock /> },
    { value: 'Store', labelKey: 'profile.delivery.store', icon: <Store /> },
    { value: 'Drive', labelKey: 'profile.delivery.drive', icon: <DirectionsCar /> },
    { value: 'Express', labelKey: 'profile.delivery.express', icon: <Speed /> },
  ];

  const paymentOptions: { value: PaymentMethodType; labelKey: TranslationKey; icon: React.ReactNode }[] = [
    { value: 'CreditCard', labelKey: 'profile.payment.creditCard', icon: <CreditCard /> },
    { value: 'PayPal', labelKey: 'profile.payment.paypal', icon: <AccountBalanceWallet /> },
    { value: 'ApplePay', labelKey: 'profile.payment.applePay', icon: <Payment /> },
    { value: 'GooglePay', labelKey: 'profile.payment.googlePay', icon: <Payment /> },
    { value: 'BankTransfer', labelKey: 'profile.payment.bankTransfer', icon: <AccountBalanceWallet /> },
    { value: 'GiftCard', labelKey: 'profile.payment.giftCard', icon: <CreditCard /> },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>{t('profile.title')}</Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
          <Tab icon={<Person />} iconPosition="start" label={t('profile.tab.personal')} />
          <Tab icon={<LocalShipping />} iconPosition="start" label={t('profile.tab.delivery')} />
          <Tab icon={<Payment />} iconPosition="start" label={t('profile.tab.payment')} />
        </Tabs>

        {/* Tab 0 — Personal information */}
        <TabPanel value={tab} index={0}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Person sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
              <Box>
                <Typography variant="h6">{t('profile.personalInfo')}</Typography>
                <Typography variant="body2" color="text.secondary">{user.firstName} {user.lastName}</Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={t('profile.firstName')} value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={t('profile.lastName')} value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={t('profile.email')} value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={t('profile.phone')} value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })} />
              </Grid>
            </Grid>
            <FormControlLabel
              control={<Switch checked={user.isPremium} onChange={(e) => setUser({ ...user, isPremium: e.target.checked })} />}
              label={t('profile.premium')}
              sx={{ mt: 2 }}
            />
          </Box>
        </TabPanel>

        {/* Tab 1 — Delivery address + preferred method */}
        <TabPanel value={tab} index={1}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <LocalShipping sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
              <Box>
                <Typography variant="h6">{t('profile.shippingAddress')}</Typography>
                <Typography variant="body2" color="text.secondary">{user.shippingAddress?.city ?? ''}</Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label={t('checkout.street')} value={user.shippingAddress?.street ?? ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...user.shippingAddress!, street: e.target.value } })} />
              </Grid>
              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField fullWidth label={t('checkout.city')} value={user.shippingAddress?.city ?? ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...user.shippingAddress!, city: e.target.value } })} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth label={t('common.postalCodeShort')} value={user.shippingAddress?.postalCode ?? ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...user.shippingAddress!, postalCode: e.target.value } })} />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <TextField fullWidth label={t('checkout.country')} value={user.shippingAddress?.country ?? ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...user.shippingAddress!, country: e.target.value } })} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>{t('profile.deliveryMethod')}</FormLabel>
              <RadioGroup
                value={user.preferredDeliveryMethod}
                onChange={(e) => setUser({ ...user, preferredDeliveryMethod: e.target.value as DeliveryMethod })}
              >
                {deliveryOptions.map((opt) => (
                  <FormControlLabel key={opt.value} value={opt.value} control={<Radio />}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{opt.icon} {t(opt.labelKey)}</Box>} />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </TabPanel>

        {/* Tab 2 — Payment info + preferred method */}
        <TabPanel value={tab} index={2}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Payment sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
              <Box>
                <Typography variant="h6">{t('profile.paymentInfo')}</Typography>
                <Typography variant="body2" color="text.secondary">{user.paymentInfo?.cardType ?? ''} ····{user.paymentInfo?.lastFourDigits ?? ''}</Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={t('profile.cardType')} value={user.paymentInfo?.cardType ?? ''} disabled />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={t('profile.lastDigits')} value={user.paymentInfo?.lastFourDigits ?? ''} disabled />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={t('checkout.cardHolder')} value={user.paymentInfo?.cardHolderName ?? ''} disabled />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label={t('checkout.cardExpiry')} value={user.paymentInfo?.expiryDate ?? ''} disabled />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>{t('profile.paymentMethod')}</FormLabel>
              <RadioGroup
                value={user.preferredPaymentMethod}
                onChange={(e) => setUser({ ...user, preferredPaymentMethod: e.target.value as PaymentMethodType })}
              >
                {paymentOptions.map((opt) => (
                  <FormControlLabel key={opt.value} value={opt.value} control={<Radio />}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{opt.icon} {t(opt.labelKey)}</Box>} />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </TabPanel>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" onClick={handleSave}>{t('profile.save')}</Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Orders */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <ShoppingBag sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
        <Typography variant="h5">{t('profile.orders')}</Typography>
      </Box>
      {orders.length === 0 ? (
        <Alert severity="info">{t('profile.noOrders')}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t('order.date')}</TableCell>
                <TableCell>{t('order.items')}</TableCell>
                <TableCell align="right">{t('order.total')}</TableCell>
                <TableCell>{t('order.status')}</TableCell>
                <TableCell>{t('order.tracking')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/orders/${order.id}`)}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR')}</TableCell>
                  <TableCell>{order.items.length} {order.items.length > 1 ? t('cart.articles') : t('cart.article')}</TableCell>
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
