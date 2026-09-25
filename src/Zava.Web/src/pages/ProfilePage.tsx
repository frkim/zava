import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography, Box, Paper, TextField, Button, Grid, Switch,
  FormControlLabel, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, RadioGroup, Radio, FormControl, FormLabel, Alert, CircularProgress, Link,
} from '@mui/material';
import {
  Person, LocalShipping, Payment, ShoppingBag, Home, Store, Lock,
  DirectionsCar, Speed, CreditCard, AccountBalanceWallet, Save,
} from '@mui/icons-material';
import { getUser, updateUser, getOrders } from '../api';
import type { User, Order, DeliveryMethod, PaymentMethod as PaymentMethodType, Address } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import { useFeedback } from '../context/FeedbackContext';
import type { TranslationKey } from '../i18n';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
  id: string;
  labelledBy: string;
}

function TabPanel({ children, value, index, id, labelledBy }: TabPanelProps) {
  return (
    <Box id={id} role="tabpanel" aria-labelledby={labelledBy} hidden={value !== index} sx={{ py: 3 }}>
      {value === index && children}
    </Box>
  );
}

const blankAddress = (): Address => ({ street: '', city: '', postalCode: '', country: '' });

function text(value: string | null | undefined) {
  return value?.trim() ?? '';
}

function serialiseUser(user: User) {
  return JSON.stringify(user);
}

function trimmedUser(user: User): User {
  return {
    ...user,
    firstName: text(user.firstName),
    lastName: text(user.lastName),
    email: text(user.email),
    phone: text(user.phone),
    shippingAddress: {
      ...(user.shippingAddress ?? blankAddress()),
      street: text(user.shippingAddress?.street),
      city: text(user.shippingAddress?.city),
      postalCode: text(user.shippingAddress?.postalCode),
      country: text(user.shippingAddress?.country),
    },
  };
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const { price, date } = useFormatters();
  const { notify } = useFeedback();
  const [form, setForm] = useState<User | null>(null);
  const formRef = useRef<User | null>(null);
  const saveSeq = useRef(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [userAttempt, setUserAttempt] = useState(0);
  const [ordersAttempt, setOrdersAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ severity: 'success' | 'error'; text: string } | null>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => { formRef.current = form; }, [form]);
  // Kept in a ref so that switching language never reloads the profile over unsaved edits.
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  useEffect(() => {
    let active = true;
    setUserLoading(true);
    setUserError(null);
    getUser()
      .then((user) => {
        if (!active) return;
        setForm(user);
      })
      .catch((error: unknown) => {
        if (active) setUserError(error instanceof Error ? error.message : tRef.current('profile.userNotFound'));
      })
      .finally(() => {
        if (active) setUserLoading(false);
      });
    return () => { active = false; };
  }, [userAttempt]);

  useEffect(() => {
    let active = true;
    setOrdersLoading(true);
    setOrdersError(null);
    getOrders()
      .then((nextOrders) => {
        if (active) setOrders(nextOrders);
      })
      .catch((error: unknown) => {
        if (active) setOrdersError(error instanceof Error ? error.message : tRef.current('common.error'));
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => { active = false; };
  }, [ordersAttempt]);

  const errors = useMemo(() => {
    if (!form) return {} as Record<string, string>;
    return {
      firstName: text(form.firstName) ? '' : t('sec.profile.required'),
      lastName: text(form.lastName) ? '' : t('sec.profile.required'),
      email: text(form.email) ? '' : t('sec.profile.required'),
      phone: text(form.phone) ? '' : t('sec.profile.required'),
      street: text(form.shippingAddress?.street) ? '' : t('sec.profile.required'),
      city: text(form.shippingAddress?.city) ? '' : t('sec.profile.required'),
      postalCode: text(form.shippingAddress?.postalCode) ? '' : t('sec.profile.required'),
      country: text(form.shippingAddress?.country) ? '' : t('sec.profile.required'),
    };
  }, [form, t]);

  const hasErrors = Object.values(errors).some(Boolean);

  const setField = <Key extends keyof User>(key: Key, value: User[Key]) => {
    setForm((current) => current ? { ...current, [key]: value } : current);
  };

  const setAddressField = <Key extends keyof Address>(key: Key, value: Address[Key]) => {
    setForm((current) => current ? {
      ...current,
      shippingAddress: { ...(current.shippingAddress ?? blankAddress()), [key]: value },
    } : current);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form || saving || hasErrors) return;
    const seq = saveSeq.current + 1;
    saveSeq.current = seq;
    const submitted = trimmedUser(form);
    const snapshot = serialiseUser(submitted);
    setSaving(true);
    setSaveMessage(null);
    try {
      const updated = await updateUser(submitted);
      if (seq !== saveSeq.current) return;
      const latest = formRef.current;
      const unchanged = latest ? serialiseUser(trimmedUser(latest)) === snapshot : true;
      if (unchanged) setForm(updated);
      const message = unchanged ? t('sec.profile.saveSuccess') : t('sec.profile.saveLocalEdits');
      setSaveMessage({ severity: 'success', text: message });
      notify({ severity: 'success', message });
    } catch (error: unknown) {
      if (seq !== saveSeq.current) return;
      const message = error instanceof Error ? error.message : t('sec.profile.saveError');
      setSaveMessage({ severity: 'error', text: message });
      notify({ severity: 'error', message });
    } finally {
      if (seq === saveSeq.current) setSaving(false);
    }
  };

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

  const disabled = saving || userLoading || !form;

  return (
    <Box>
      <PageTitle>{t('profile.title')}</PageTitle>

      {userLoading && !form && <LoadingState label={t('sec.profile.loadingUser')} />}
      {userError && <ErrorState title={t('sec.profile.userError')} detail={userError} onRetry={() => setUserAttempt((attempt) => attempt + 1)} />}

      {form && (
        <Paper component="form" onSubmit={handleSave} sx={{ mb: 3 }} noValidate>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="fullWidth" aria-label={t('profile.title')}>
            <Tab id="profile-tab-personal" aria-controls="profile-panel-personal" icon={<Person />} iconPosition="start" label={t('profile.tab.personal')} />
            <Tab id="profile-tab-delivery" aria-controls="profile-panel-delivery" icon={<LocalShipping />} iconPosition="start" label={t('profile.tab.delivery')} />
            <Tab id="profile-tab-payment" aria-controls="profile-panel-payment" icon={<Payment />} iconPosition="start" label={t('profile.tab.payment')} />
          </Tabs>

          <TabPanel value={tab} index={0} id="profile-panel-personal" labelledBy="profile-tab-personal">
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Person sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
                <Box>
                  <Typography component="h2" variant="h6">{t('profile.personalInfo')}</Typography>
                  <Typography variant="body2" color="text.secondary">{form.firstName} {form.lastName}</Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required disabled={disabled} label={t('profile.firstName')} value={form.firstName}
                    autoComplete="given-name" error={!!errors.firstName} helperText={errors.firstName || ' '}
                    slotProps={{ htmlInput: { 'aria-invalid': !!errors.firstName } }}
                    onChange={(event) => setField('firstName', event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required disabled={disabled} label={t('profile.lastName')} value={form.lastName}
                    autoComplete="family-name" error={!!errors.lastName} helperText={errors.lastName || ' '}
                    slotProps={{ htmlInput: { 'aria-invalid': !!errors.lastName } }}
                    onChange={(event) => setField('lastName', event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required disabled={disabled} type="email" label={t('profile.email')} value={form.email}
                    autoComplete="email" error={!!errors.email} helperText={errors.email || t('sec.profile.emailHelp')}
                    slotProps={{ htmlInput: { 'aria-invalid': !!errors.email } }}
                    onChange={(event) => setField('email', event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required disabled={disabled} type="tel" label={t('profile.phone')} value={form.phone}
                    autoComplete="tel" error={!!errors.phone} helperText={errors.phone || ' '}
                    slotProps={{ htmlInput: { 'aria-invalid': !!errors.phone } }}
                    onChange={(event) => setField('phone', event.target.value)} />
                </Grid>
              </Grid>
              <FormControlLabel
                control={<Switch checked={form.isPremium} disabled={disabled} onChange={(event) => setField('isPremium', event.target.checked)} />}
                label={t('profile.premium')}
                sx={{ mt: 2 }}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1} id="profile-panel-delivery" labelledBy="profile-tab-delivery">
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <LocalShipping sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
                <Box>
                  <Typography component="h2" variant="h6">{t('profile.shippingAddress')}</Typography>
                  <Typography variant="body2" color="text.secondary">{form.shippingAddress?.city ?? ''}</Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth required disabled={disabled} label={t('checkout.street')} value={form.shippingAddress?.street ?? ''}
                    autoComplete="street-address" error={!!errors.street} helperText={errors.street || ' '}
                    slotProps={{ htmlInput: { 'aria-invalid': !!errors.street } }}
                    onChange={(event) => setAddressField('street', event.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField fullWidth required disabled={disabled} label={t('checkout.city')} value={form.shippingAddress?.city ?? ''}
                    autoComplete="address-level2" error={!!errors.city} helperText={errors.city || ' '}
                    slotProps={{ htmlInput: { 'aria-invalid': !!errors.city } }}
                    onChange={(event) => setAddressField('city', event.target.value)} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField fullWidth required disabled={disabled} label={t('common.postalCodeShort')} value={form.shippingAddress?.postalCode ?? ''}
                    autoComplete="postal-code" error={!!errors.postalCode} helperText={errors.postalCode || ' '}
                    slotProps={{ htmlInput: { 'aria-invalid': !!errors.postalCode } }}
                    onChange={(event) => setAddressField('postalCode', event.target.value)} />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <TextField fullWidth required disabled={disabled} label={t('checkout.country')} value={form.shippingAddress?.country ?? ''}
                    autoComplete="country-name" error={!!errors.country} helperText={errors.country || ' '}
                    slotProps={{ htmlInput: { 'aria-invalid': !!errors.country } }}
                    onChange={(event) => setAddressField('country', event.target.value)} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <FormControl component="fieldset" disabled={disabled}>
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>{t('profile.deliveryMethod')}</FormLabel>
                <RadioGroup
                  value={form.preferredDeliveryMethod}
                  onChange={(event) => setField('preferredDeliveryMethod', event.target.value as DeliveryMethod)}
                >
                  {deliveryOptions.map((opt) => (
                    <FormControlLabel key={opt.value} value={opt.value} control={<Radio />}
                      label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{opt.icon} {t(opt.labelKey)}</Box>} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={2} id="profile-panel-payment" labelledBy="profile-tab-payment">
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Payment sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
                <Box>
                  <Typography component="h2" variant="h6">{t('profile.paymentInfo')}</Typography>
                  <Typography variant="body2" color="text.secondary">{form.paymentInfo?.cardType ?? ''} ····{form.paymentInfo?.lastFourDigits ?? ''}</Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label={t('profile.cardType')} value={form.paymentInfo?.cardType ?? ''} disabled autoComplete="cc-type" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label={t('profile.lastDigits')} value={form.paymentInfo?.lastFourDigits ?? ''} disabled autoComplete="cc-number" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label={t('checkout.cardHolder')} value={form.paymentInfo?.cardHolderName ?? ''} disabled autoComplete="cc-name" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label={t('checkout.cardExpiry')} value={form.paymentInfo?.expiryDate ?? ''} disabled autoComplete="cc-exp" />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <FormControl component="fieldset" disabled={disabled}>
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>{t('profile.paymentMethod')}</FormLabel>
                <RadioGroup
                  value={form.preferredPaymentMethod}
                  onChange={(event) => setField('preferredPaymentMethod', event.target.value as PaymentMethodType)}
                >
                  {paymentOptions.map((opt) => (
                    <FormControlLabel key={opt.value} value={opt.value} control={<Radio />}
                      label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{opt.icon} {t(opt.labelKey)}</Box>} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </TabPanel>

          {saveMessage && <Alert severity={saveMessage.severity} sx={{ mx: 3, mb: 2 }}>{saveMessage.text}</Alert>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3, pt: 0 }}>
            <Button type="submit" variant="contained" disabled={disabled || hasErrors} startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}>
              {saving ? t('sec.profile.saving') : t('profile.save')}
            </Button>
          </Box>
        </Paper>
      )}

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <ShoppingBag sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
        <Typography component="h2" variant="h5">{t('profile.orders')}</Typography>
      </Box>
      {ordersLoading && <LoadingState label={t('sec.profile.loadingOrders')} />}
      {ordersError && <ErrorState title={t('sec.profile.ordersError')} detail={ordersError} onRetry={() => setOrdersAttempt((attempt) => attempt + 1)} />}
      {!ordersLoading && !ordersError && orders.length === 0 && (
        <EmptyState title={t('profile.noOrders')} description={t('sec.profile.noOrdersDesc')} icon={<ShoppingBag />} />
      )}
      {!ordersLoading && !ordersError && orders.length > 0 && (
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
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Link component={RouterLink} to={`/orders/${order.id}`} aria-label={`${t('sec.profile.openOrder')} ${order.id}`}>
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{date(order.createdAt)}</TableCell>
                  <TableCell>{order.items.length} {order.items.length > 1 ? t('cart.articles') : t('cart.article')}</TableCell>
                  <TableCell align="right">{price(order.total)}</TableCell>
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
    </Box>
  );
}
