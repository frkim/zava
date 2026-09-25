import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, TextField, Stepper, Step, StepLabel,
  CircularProgress, Grid, ToggleButtonGroup, ToggleButton, Divider,
  Chip, Stack, Alert, List, ListItem, ListItemText,
} from '@mui/material';
import {
  CreditCard, CheckCircle, ErrorOutline, Lock, Fingerprint,
  PhoneIphone, Security,
} from '@mui/icons-material';
import { getCart, getUser, checkout } from '../api';
import type { Cart, User, PaymentResult, PaymentMethod, Address } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { errorDetail, paymentMethodKey, paymentStatusKey } from '../components/commerce/commerceText';
import { publishCart } from '../cartEvents';

type AddressErrors = Partial<Record<keyof Address, string>>;
type CardErrors = Partial<Record<'cardNumber' | 'cardHolder' | 'cardExpiry' | 'cardCvv', string>>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { price } = useFormatters();
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState<Cart | null>(null);
  const [, setUser] = useState<User | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [cartError, setCartError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [resultDetail, setResultDetail] = useState('');

  const [address, setAddress] = useState<Address>({ street: '', city: '', postalCode: '', country: 'France' });
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CreditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [paymentError, setPaymentError] = useState('');

  const [paypalConnected, setPaypalConnected] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [applePayAuthorized, setApplePayAuthorized] = useState(false);
  const [applePayLoading, setApplePayLoading] = useState(false);
  const [googlePayReady, setGooglePayReady] = useState(false);
  const [googlePayLoading, setGooglePayLoading] = useState(false);

  const loadCart = async () => {
    setCartLoading(true);
    setCartError('');
    try {
      setCart(await getCart());
    } catch (e) {
      setCartError(errorDetail(e));
    } finally {
      setCartLoading(false);
    }
  };

  const loadProfile = async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      const u = await getUser();
      setUser(u);
      setAddress((prev) => {
        const entered = !!(prev.street.trim() || prev.city.trim() || prev.postalCode.trim() || (prev.country.trim() && prev.country.trim() !== 'France'));
        return !entered && u.shippingAddress ? u.shippingAddress : prev;
      });
      setCardHolder((prev) => prev || `${u.firstName} ${u.lastName}`);
    } catch (e) {
      setProfileError(errorDetail(e));
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    void loadCart();
    void loadProfile();
  }, []);

  const required = (value: string) => value.trim() ? '' : t('com.checkout.requiredField');

  const validateAddress = () => {
    const next: AddressErrors = {
      street: required(address.street),
      city: required(address.city),
      postalCode: required(address.postalCode),
      country: required(address.country),
    };
    Object.keys(next).forEach((key) => {
      if (!next[key as keyof Address]) delete next[key as keyof Address];
    });
    setAddressErrors(next);
    return Object.keys(next).length === 0;
  };

  const validatePayment = () => {
    setPaymentError('');
    if (paymentMethod !== 'CreditCard') {
      const ready = paymentMethod === 'PayPal' ? paypalConnected
        : paymentMethod === 'ApplePay' ? applePayAuthorized
          : paymentMethod === 'GooglePay' ? googlePayReady
            : true;
      if (!ready) {
        setPaymentError(t('com.checkout.simulateFirst'));
        return false;
      }
      setCardErrors({});
      return true;
    }

    const next: CardErrors = {
      cardNumber: cardNumber.replace(/\s/g, '').length >= 12 ? '' : t('com.checkout.cardRequired'),
      cardHolder: required(cardHolder),
      cardExpiry: required(cardExpiry),
      cardCvv: cardCvv.trim().length >= 3 ? '' : t('com.checkout.cardRequired'),
    };
    Object.keys(next).forEach((key) => {
      if (!next[key as keyof CardErrors]) delete next[key as keyof CardErrors];
    });
    setCardErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleShippingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateAddress()) setActiveStep(1);
  };

  const handlePaymentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validatePayment()) setActiveStep(2);
  };

  const handleCheckout = async () => {
    if (!validateAddress() || !validatePayment()) return;
    setProcessing(true);
    setResultDetail('');
    try {
      const res = await checkout({
        shippingAddress: {
          street: address.street.trim(),
          city: address.city.trim(),
          postalCode: address.postalCode.trim(),
          country: address.country.trim(),
        },
        paymentMethod,
        cardNumber: paymentMethod === 'CreditCard' ? cardNumber.replace(/\s/g, '') : undefined,
        cardHolder: paymentMethod === 'CreditCard' ? cardHolder.trim() : undefined,
        cardExpiry: paymentMethod === 'CreditCard' ? cardExpiry.trim() : undefined,
      });
      setResult(res);
      setResultDetail(res.message);
      if (res.success) publishCart({ items: [], total: 0, itemCount: 0 });
      setActiveStep(3);
    } catch (e: unknown) {
      setResult({ success: false, status: 'Failed', message: t('com.checkout.paymentRejected') });
      setResultDetail(errorDetail(e));
      setActiveStep(3);
    } finally {
      setProcessing(false);
    }
  };

  const updateAddress = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setAddressErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const resetPaymentSimulation = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPaypalConnected(false);
    setApplePayAuthorized(false);
    setGooglePayReady(false);
    setPaymentError('');
  };

  const paymentDemoNote = <Alert severity="info" sx={{ mb: 2 }}>{t('com.checkout.simulatedMethod')}</Alert>;

  const demoBanner = (
    <Alert severity="warning" sx={{ mb: 3 }} role="note">
      {t('com.checkout.demoBanner')}
    </Alert>
  );

  if (cartLoading) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <PageTitle>{t('checkout.title')}</PageTitle>
        {demoBanner}
        <LoadingState />
      </Box>
    );
  }
  if (cartError) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <PageTitle>{t('checkout.title')}</PageTitle>
        {demoBanner}
        <ErrorState title={t('com.checkout.cartLoadError')} detail={cartError} onRetry={() => void loadCart()} />
      </Box>
    );
  }
  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <PageTitle>{t('checkout.title')}</PageTitle>
        {demoBanner}
        <EmptyState title={t('cart.empty')} action={<Button variant="contained" onClick={() => navigate('/')}>{t('checkout.backToHome')}</Button>} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <PageTitle>{t('checkout.title')}</PageTitle>
      {demoBanner}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {[t('checkout.shipping'), t('checkout.payment'), t('com.checkout.review'), t('checkout.confirmation')].map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Paper component="form" noValidate onSubmit={handleShippingSubmit} sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>{t('checkout.shippingAddress')}</Typography>
          {profileLoading && <LoadingState label={t('common.loading')} />}
          {profileError && (
            <ErrorState title={t('com.checkout.profileLoadError')} detail={profileError} onRetry={() => void loadProfile()} />
          )}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label={t('checkout.street')} value={address.street}
                onChange={(e) => updateAddress('street', e.target.value)}
                required error={!!addressErrors.street} helperText={addressErrors.street}
                autoComplete="shipping street-address" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label={t('checkout.city')} value={address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                required error={!!addressErrors.city} helperText={addressErrors.city}
                autoComplete="shipping address-level2" />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label={t('checkout.postalCode')} value={address.postalCode}
                onChange={(e) => updateAddress('postalCode', e.target.value)}
                required error={!!addressErrors.postalCode} helperText={addressErrors.postalCode}
                autoComplete="shipping postal-code" slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label={t('checkout.country')} value={address.country}
                onChange={(e) => updateAddress('country', e.target.value)}
                required error={!!addressErrors.country} helperText={addressErrors.country}
                autoComplete="shipping country-name" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2">
              {cart.itemCount} {cart.itemCount > 1 ? t('cart.articles') : t('cart.article')} — {t('cart.total')} : {price(cart.total)}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button type="button" onClick={() => navigate('/cart')}>{t('checkout.backToCart')}</Button>
            <Button type="submit" variant="contained">{t('checkout.continue')}</Button>
          </Box>
        </Paper>
      )}

      {activeStep === 1 && (
        <Paper component="form" noValidate onSubmit={handlePaymentSubmit} sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>{t('checkout.paymentMethod')}</Typography>
          {paymentError && <Alert severity="error" sx={{ mb: 2 }}>{paymentError}</Alert>}

          <ToggleButtonGroup
            value={paymentMethod}
            exclusive
            onChange={(_, v: PaymentMethod | null) => { if (v) resetPaymentSimulation(v); }}
            sx={{ mb: 3, flexWrap: 'wrap' }}
          >
            <ToggleButton value="CreditCard">{t('com.checkout.simulatedCreditCard')}</ToggleButton>
            <ToggleButton value="PayPal">{t('com.checkout.simulatedPayPal')}</ToggleButton>
            <ToggleButton value="ApplePay">{t('com.checkout.simulatedApplePay')}</ToggleButton>
            <ToggleButton value="GooglePay">{t('com.checkout.simulatedGooglePay')}</ToggleButton>
          </ToggleButtonGroup>

          {paymentMethod === 'CreditCard' && (
            <Box>
              {paymentDemoNote}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CreditCard sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight={600}>{t('com.checkout.simulatedCreditCard')}</Typography>
                <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                  <Chip label="Visa" size="small" variant="outlined" />
                  <Chip label="Mastercard" size="small" variant="outlined" />
                  <Chip label="CB" size="small" variant="outlined" />
                </Box>
              </Box>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label={t('checkout.cardNumber')} value={cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setCardNumber(v.replace(/(\d{4})(?=\d)/g, '$1 '));
                        setCardErrors((prev) => ({ ...prev, cardNumber: undefined }));
                      }}
                      required error={!!cardErrors.cardNumber} helperText={cardErrors.cardNumber || t('checkout.cardNumberHint')}
                      placeholder="4242 4242 4242 4242" autoComplete="cc-number"
                      slotProps={{ htmlInput: { inputMode: 'numeric' }, input: { endAdornment: <Lock fontSize="small" color="action" /> } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label={t('checkout.cardHolder')} value={cardHolder}
                      onChange={(e) => { setCardHolder(e.target.value); setCardErrors((prev) => ({ ...prev, cardHolder: undefined })); }}
                      required error={!!cardErrors.cardHolder} helperText={cardErrors.cardHolder}
                      placeholder="JEAN DUPONT" autoComplete="cc-name" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField fullWidth label={t('checkout.cardExpiry')} value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                        setCardExpiry(v);
                        setCardErrors((prev) => ({ ...prev, cardExpiry: undefined }));
                      }}
                      required error={!!cardErrors.cardExpiry} helperText={cardErrors.cardExpiry}
                      placeholder="MM/AA" autoComplete="cc-exp" slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField fullWidth label={t('checkout.cardCvv')} value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
                        setCardErrors((prev) => ({ ...prev, cardCvv: undefined }));
                      }}
                      required error={!!cardErrors.cardCvv} helperText={cardErrors.cardCvv || t('checkout.cardCvvHint')}
                      placeholder="123" type="password" autoComplete="cc-csc"
                      slotProps={{ htmlInput: { inputMode: 'numeric' }, input: { endAdornment: <Security fontSize="small" color="action" /> } }} />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}

          {paymentMethod === 'PayPal' && (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center', bgcolor: '#FFF8E1' }}>
              {paymentDemoNote}
              <Typography variant="h6" sx={{ mb: 2, color: '#003087', fontWeight: 700 }}>PayPal</Typography>
              {!paypalConnected ? (
                <Box sx={{ maxWidth: 360, mx: 'auto' }}>
                  {paypalLoading && <CircularProgress size={28} sx={{ mb: 2 }} />}
                  <Button variant="contained" fullWidth disabled={paypalLoading}
                    sx={{ bgcolor: '#0070BA', '&:hover': { bgcolor: '#005EA6' }, textTransform: 'none', fontWeight: 600 }}
                    onClick={() => {
                      setPaypalLoading(true);
                      window.setTimeout(() => { setPaypalConnected(true); setPaypalLoading(false); setPaymentError(''); }, 700);
                    }}
                  >
                    {t('com.checkout.simulatePaypal')}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>{t('com.checkout.paypalConnectedFictional')}</Typography>
                  <Chip label={`${t('com.checkout.fictionalBalance')} : ${price(1247.5)}`} size="small" sx={{ mt: 1 }} />
                </Box>
              )}
            </Paper>
          )}

          {paymentMethod === 'ApplePay' && (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center', bgcolor: '#000', color: '#fff' }}>
              <PhoneIphone sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>{t('com.checkout.simulatedApplePay')}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>{t('com.checkout.fictionalAuthorization')}</Typography>
              {!applePayAuthorized ? (
                <Box>
                  <Paper sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: '#1a1a1a', color: '#fff', borderRadius: 2, mb: 2 }}>
                    <CreditCard fontSize="small" />
                    <Typography variant="body2">{t('com.checkout.fictionalCard')} ····4242</Typography>
                  </Paper>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', my: 2 }} />
                  {applePayLoading ? (
                    <Box sx={{ py: 2 }}>
                      <CircularProgress size={36} sx={{ color: '#fff' }} />
                      <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>{t('com.checkout.fictionalAuthorization')}…</Typography>
                    </Box>
                  ) : (
                    <Button variant="contained" startIcon={<Fingerprint />}
                      sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#e0e0e0' }, textTransform: 'none', fontWeight: 600, px: 4 }}
                      onClick={() => {
                        setApplePayLoading(true);
                        window.setTimeout(() => { setApplePayAuthorized(true); setApplePayLoading(false); setPaymentError(''); }, 700);
                      }}
                    >
                      {t('checkout.applePayAuthorize')}
                    </Button>
                  )}
                </Box>
              ) : (
                <Box>
                  <CheckCircle sx={{ fontSize: 48, color: '#4CD964', mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>{t('checkout.applePayAuthorized')}</Typography>
                </Box>
              )}
            </Paper>
          )}

          {paymentMethod === 'GooglePay' && (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#3c4043' }}>{t('com.checkout.simulatedGooglePay')}</Typography>
              {!googlePayReady ? (
                <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                  <Stack spacing={1.5} sx={{ mb: 3, textAlign: 'left' }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">{t('checkout.googlePayAccount')}</Typography>
                      <Typography variant="body2" fontWeight={600}>demo.fictif@gmail.com</Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">{t('com.checkout.fictionalCard')}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CreditCard fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight={600}>Visa ····4242</Typography>
                        <Chip label={t('common.demoData')} size="small" color="primary" variant="outlined" sx={{ ml: 'auto' }} />
                      </Box>
                    </Paper>
                  </Stack>
                  {googlePayLoading && <CircularProgress size={28} sx={{ mb: 2 }} />}
                  <Button variant="contained" fullWidth disabled={googlePayLoading}
                    sx={{ bgcolor: '#1a73e8', '&:hover': { bgcolor: '#1565c0' }, textTransform: 'none', fontWeight: 600, borderRadius: 2, py: 1.2 }}
                    onClick={() => {
                      setGooglePayLoading(true);
                      window.setTimeout(() => { setGooglePayReady(true); setGooglePayLoading(false); setPaymentError(''); }, 700);
                    }}
                  >
                    {t('checkout.googlePayReady')}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <CheckCircle sx={{ fontSize: 48, color: '#1a73e8', mb: 1 }} />
                  <Typography variant="body1" fontWeight={600} color="primary">{t('checkout.googlePayReady')}</Typography>
                </Box>
              )}
            </Paper>
          )}

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">{t('checkout.totalToPay')} : {price(cart.total)}</Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button type="button" onClick={() => setActiveStep(0)}>{t('checkout.back')}</Button>
            <Button type="submit" variant="contained">{t('checkout.continue')}</Button>
          </Box>
        </Paper>
      )}

      {activeStep === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>{t('com.checkout.reviewTitle')}</Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('com.checkout.items')}</Typography>
              <List disablePadding>
                {cart.items.map((item, index) => (
                  <ListItem key={`${item.productId}-${item.variantId ?? 'no'}-${index}`} disableGutters divider>
                    <ListItemText
                      primary={item.productName}
                      secondary={[
                        item.variantName,
                        item.discountPercent ? `${t('com.cart.offer')} -${item.discountPercent}%` : null,
                        `${item.quantity} × ${price(item.unitPrice)}`,
                      ].filter(Boolean).join(' · ')}
                    />
                    <Typography fontWeight={600}>{price(item.subtotal)}</Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">{t('checkout.shippingAddress')}</Typography>
                  <Button size="small" onClick={() => setActiveStep(0)}>{t('com.checkout.editShipping')}</Button>
                </Stack>
                <Typography>{address.street.trim()}</Typography>
                <Typography>{address.postalCode.trim()} {address.city.trim()}</Typography>
                <Typography>{address.country.trim()}</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">{t('checkout.paymentMethod')}</Typography>
                  <Button size="small" onClick={() => setActiveStep(1)}>{t('com.checkout.editPayment')}</Button>
                </Stack>
                <Typography>{t(paymentMethodKey(paymentMethod))}</Typography>
                <Typography variant="caption" color="text.secondary">{t('com.checkout.simulatedMethod')}</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">{t('cart.total')}</Typography>
                  <Typography variant="h6" fontWeight={700}>{price(cart.total)}</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setActiveStep(1)}>{t('checkout.back')}</Button>
            <Button variant="contained" onClick={handleCheckout} disabled={processing}
              startIcon={processing ? <CircularProgress size={20} /> : <CreditCard />}>
              {processing ? t('checkout.processing') : `${t('com.checkout.simulatePayment')} ${price(cart.total)}`}
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 3 && result && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {result.success ? (
            <>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>{t('checkout.confirmed')}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {t('com.checkout.paymentAccepted')} {t(paymentStatusKey(result.status))}
              </Typography>
              {resultDetail && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  {t('com.api.detailPrefix')} : {resultDetail}
                </Typography>
              )}
              {result.orderId && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('checkout.orderNumber')} : <strong>#{result.orderId}</strong>
                </Typography>
              )}
              {result.transactionId && (
                <Typography variant="caption" color="text.secondary">
                  {t('checkout.transaction')} : {result.transactionId}
                </Typography>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                {result.orderId && (
                  <Button variant="contained" onClick={() => navigate(`/orders/${result.orderId}`)}>
                    {t('com.checkout.viewOrder')}
                  </Button>
                )}
                <Button onClick={() => navigate('/')}>{t('checkout.backToHome')}</Button>
              </Box>
            </>
          ) : (
            <>
              <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>{t('checkout.paymentFailed')}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {t('com.checkout.paymentRejected')} {t(paymentStatusKey(result.status))}
              </Typography>
              {resultDetail && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                  {t('com.api.detailPrefix')} : {resultDetail}
                </Typography>
              )}
              <Button variant="contained" onClick={() => setActiveStep(1)}>
                {t('checkout.retry')}
              </Button>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}
