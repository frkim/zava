import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, TextField, Stepper, Step, StepLabel,
  CircularProgress, Grid, ToggleButtonGroup, ToggleButton, Divider,
  Chip, Stack, LinearProgress,
} from '@mui/material';
import {
  CreditCard, CheckCircle, ErrorOutline, Lock, Fingerprint,
  PhoneIphone, Security,
} from '@mui/icons-material';
import { getCart, getUser, checkout } from '../api';
import type { Cart, User, PaymentResult, PaymentMethod, Address } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState<Cart | null>(null);
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  // Form
  const [address, setAddress] = useState<Address>({ street: '', city: '', postalCode: '', country: 'France' });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CreditCard' as PaymentMethod);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // PayPal
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPassword, setPaypalPassword] = useState('');
  const [paypalConnected, setPaypalConnected] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);

  // Apple Pay
  const [applePayAuthorized, setApplePayAuthorized] = useState(false);
  const [applePayLoading, setApplePayLoading] = useState(false);

  // Google Pay
  const [googlePayReady, setGooglePayReady] = useState(false);
  const [googlePayLoading, setGooglePayLoading] = useState(false);

  useEffect(() => {
    Promise.all([getCart(), getUser()])
      .then(([c, u]) => {
        setCart(c);
        setUser(u);
        if (u?.shippingAddress) {
          setAddress(u.shippingAddress);
        }
        if (u) {
          setCardHolder(`${u.firstName} ${u.lastName}`);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const res = await checkout({
        shippingAddress: address,
        paymentMethod,
        cardNumber: cardNumber || undefined,
        cardHolder: cardHolder || undefined,
        cardExpiry: cardExpiry || undefined,
      });
      setResult(res);
      setActiveStep(2);
    } catch (e: unknown) {
      setResult({ success: false, status: 'Failed' as never, message: String(e) });
      setActiveStep(2);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>{t('cart.empty')}</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>{t('checkout.backToHome')}</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>{t('checkout.title')}</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {[t('checkout.shipping'), t('checkout.payment'), t('checkout.confirmation')].map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Step 0: Shipping */}
      {activeStep === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{t('checkout.shippingAddress')}</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label={t('checkout.street')} value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label={t('checkout.city')} value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label={t('checkout.postalCode')} value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label={t('checkout.country')} value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
            </Grid>
          </Grid>

          {/* Order summary */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {cart.itemCount} {cart.itemCount > 1 ? t('cart.articles') : t('cart.article')} — {t('cart.total')} : {cart.total.toFixed(2)} €
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => navigate('/cart')}>{t('checkout.backToCart')}</Button>
            <Button variant="contained" onClick={() => setActiveStep(1)}
              disabled={!address.street || !address.city || !address.postalCode}
            >
              {t('checkout.continue')}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Step 1: Payment */}
      {activeStep === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{t('checkout.paymentMethod')}</Typography>

          <ToggleButtonGroup
            value={paymentMethod}
            exclusive
            onChange={(_, v) => { if (v) { setPaymentMethod(v); setPaypalConnected(false); setApplePayAuthorized(false); setGooglePayReady(false); } }}
            sx={{ mb: 3, flexWrap: 'wrap' }}
          >
            <ToggleButton value="CreditCard">{t('checkout.creditCard')}</ToggleButton>
            <ToggleButton value="PayPal">🅿️ PayPal</ToggleButton>
            <ToggleButton value="ApplePay"> Apple Pay</ToggleButton>
            <ToggleButton value="GooglePay">🔵 Google Pay</ToggleButton>
          </ToggleButtonGroup>

          {/* ── Credit Card ─────────────────────────────────── */}
          {paymentMethod === 'CreditCard' && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CreditCard sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight={600}>{t('checkout.creditCard')}</Typography>
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
                      }}
                      placeholder="4242 4242 4242 4242"
                      helperText={t('checkout.cardNumberHint')}
                      slotProps={{ input: { endAdornment: <Lock fontSize="small" color="action" /> } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label={t('checkout.cardHolder')} value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="JEAN DUPONT" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField fullWidth label={t('checkout.cardExpiry')} value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                        setCardExpiry(v);
                      }}
                      placeholder="MM/AA" />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField fullWidth label={t('checkout.cardCvv')} value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                      type="password"
                      helperText={t('checkout.cardCvvHint')}
                      slotProps={{ input: { endAdornment: <Security fontSize="small" color="action" /> } }} />
                  </Grid>
                </Grid>
              </Paper>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
                <Lock sx={{ fontSize: 14, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">SSL / TLS — {t('checkout.pay')}</Typography>
              </Box>
            </Box>
          )}

          {/* ── PayPal ──────────────────────────────────────── */}
          {paymentMethod === 'PayPal' && (
            <Box>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center', bgcolor: '#FFF8E1' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#003087', fontWeight: 700 }}>
                  🅿️ PayPal
                </Typography>

                {!paypalConnected ? (
                  <Box sx={{ maxWidth: 360, mx: 'auto' }}>
                    <TextField fullWidth size="small" label={t('checkout.paypalEmail')} value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="jean.dupont@email.com"
                      sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }} />
                    <TextField fullWidth size="small" label={t('checkout.paypalPassword')} value={paypalPassword}
                      onChange={(e) => setPaypalPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }} />
                    {paypalLoading && <LinearProgress sx={{ mb: 2 }} />}
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={!paypalEmail || !paypalPassword || paypalLoading}
                      sx={{ bgcolor: '#0070BA', '&:hover': { bgcolor: '#005EA6' }, textTransform: 'none', fontWeight: 600 }}
                      onClick={() => {
                        setPaypalLoading(true);
                        setTimeout(() => { setPaypalConnected(true); setPaypalLoading(false); }, 1500);
                      }}
                    >
                      {t('checkout.paypalLogin')}
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                    <Typography variant="body1" fontWeight={600}>
                      {t('checkout.paypalConnected')} {paypalEmail}
                    </Typography>
                    <Chip label="PayPal Balance: 1 247,50 €" size="small" sx={{ mt: 1 }} />
                    <Box sx={{ mt: 2 }}>
                      <Button size="small" color="inherit" onClick={() => { setPaypalConnected(false); setPaypalEmail(''); setPaypalPassword(''); }}>
                        {t('checkout.paypalLogout')}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          {/* ── Apple Pay ───────────────────────────────────── */}
          {paymentMethod === 'ApplePay' && (
            <Box>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center', bgcolor: '#000', color: '#fff' }}>
                <PhoneIphone sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                   {t('checkout.applePayTitle')}
                </Typography>

                {!applePayAuthorized ? (
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                      {t('checkout.applePayConfirm')}
                    </Typography>
                    <Paper sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: '#1a1a1a', color: '#fff', borderRadius: 2, mb: 2 }}>
                      <CreditCard fontSize="small" />
                      <Typography variant="body2">{t('checkout.applePayCard')}</Typography>
                    </Paper>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', my: 2 }} />
                    {applePayLoading ? (
                      <Box sx={{ py: 2 }}>
                        <CircularProgress size={36} sx={{ color: '#fff' }} />
                        <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>Face ID...</Typography>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<Fingerprint />}
                        sx={{ bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#e0e0e0' }, textTransform: 'none', fontWeight: 600, px: 4 }}
                        onClick={() => {
                          setApplePayLoading(true);
                          setTimeout(() => { setApplePayAuthorized(true); setApplePayLoading(false); }, 2000);
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
                    <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', mt: 0.5 }}>{t('checkout.applePayCard')}</Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          {/* ── Google Pay ──────────────────────────────────── */}
          {paymentMethod === 'GooglePay' && (
            <Box>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#3c4043' }}>
                  🔵 {t('checkout.googlePayTitle')}
                </Typography>

                {!googlePayReady ? (
                  <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                    <Stack spacing={1.5} sx={{ mb: 3, textAlign: 'left' }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">{t('checkout.googlePayAccount')}</Typography>
                        <Typography variant="body2" fontWeight={600}>jean.dupont@gmail.com</Typography>
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">{t('checkout.googlePayCard')}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <CreditCard fontSize="small" color="primary" />
                          <Typography variant="body2" fontWeight={600}>Visa ····4242</Typography>
                          <Chip label="Par défaut" size="small" color="primary" variant="outlined" sx={{ ml: 'auto' }} />
                        </Box>
                      </Paper>
                    </Stack>
                    {googlePayLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={googlePayLoading}
                      sx={{ bgcolor: '#1a73e8', '&:hover': { bgcolor: '#1565c0' }, textTransform: 'none', fontWeight: 600, borderRadius: 2, py: 1.2 }}
                      onClick={() => {
                        setGooglePayLoading(true);
                        setTimeout(() => { setGooglePayReady(true); setGooglePayLoading(false); }, 1500);
                      }}
                    >
                      {t('checkout.googlePayReady')}
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <CheckCircle sx={{ fontSize: 48, color: '#1a73e8', mb: 1 }} />
                    <Typography variant="body1" fontWeight={600} color="primary">{t('checkout.googlePayReady')}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>Visa ····4242 — jean.dupont@gmail.com</Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">{t('checkout.totalToPay')} : {cart.total.toFixed(2)} €</Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setActiveStep(0)}>{t('checkout.back')}</Button>
            <Button variant="contained" onClick={handleCheckout} disabled={processing}
              startIcon={processing ? <CircularProgress size={20} /> : <CreditCard />}
            >
              {processing ? t('checkout.processing') : t('checkout.pay')}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Step 2: Confirmation */}
      {activeStep === 2 && result && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {result.success ? (
            <>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>{t('checkout.confirmed')}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {result.message}
              </Typography>
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
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => navigate('/profile')}>
                  {t('checkout.viewOrders')}
                </Button>
                <Button onClick={() => navigate('/')}>{t('checkout.backToHome')}</Button>
              </Box>
            </>
          ) : (
            <>
              <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>{t('checkout.paymentFailed')}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {result.message}
              </Typography>
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
