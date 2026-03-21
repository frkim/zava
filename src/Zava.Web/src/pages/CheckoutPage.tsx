import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, TextField, Stepper, Step, StepLabel,
  CircularProgress, Grid, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import { CreditCard, CheckCircle, ErrorOutline } from '@mui/icons-material';
import { getCart, getUser, checkout } from '../api';
import type { Cart, User, PaymentResult, PaymentMethod, Address } from '../types';

const steps = ['Livraison', 'Paiement', 'Confirmation'];

export default function CheckoutPage() {
  const navigate = useNavigate();
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
        <Typography variant="h5" gutterBottom>Votre panier est vide</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Commande</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Step 0: Shipping */}
      {activeStep === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Adresse de livraison</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Rue" value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Ville" value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label="Code postal" value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label="Pays" value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
            </Grid>
          </Grid>

          {/* Order summary */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {cart.itemCount} article{cart.itemCount > 1 ? 's' : ''} — Total : {cart.total.toFixed(2)} €
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => navigate('/cart')}>Retour au panier</Button>
            <Button variant="contained" onClick={() => setActiveStep(1)}
              disabled={!address.street || !address.city || !address.postalCode}
            >
              Continuer
            </Button>
          </Box>
        </Paper>
      )}

      {/* Step 1: Payment */}
      {activeStep === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Moyen de paiement</Typography>

          <ToggleButtonGroup
            value={paymentMethod}
            exclusive
            onChange={(_, v) => v && setPaymentMethod(v)}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="CreditCard">💳 Carte bancaire</ToggleButton>
            <ToggleButton value="PayPal">🅿️ PayPal</ToggleButton>
            <ToggleButton value="ApplePay"> Apple Pay</ToggleButton>
            <ToggleButton value="GooglePay">🔵 Google Pay</ToggleButton>
          </ToggleButtonGroup>

          {paymentMethod === 'CreditCard' && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Numéro de carte" value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  helperText="Terminez par 0000 pour simuler un échec de paiement" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Titulaire" value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Expiration" value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/AA" />
              </Grid>
            </Grid>
          )}

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Total à payer : {cart.total.toFixed(2)} €</Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setActiveStep(0)}>Retour</Button>
            <Button variant="contained" onClick={handleCheckout} disabled={processing}
              startIcon={processing ? <CircularProgress size={20} /> : <CreditCard />}
            >
              {processing ? 'Traitement...' : 'Payer'}
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
              <Typography variant="h5" gutterBottom>Commande confirmée !</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {result.message}
              </Typography>
              {result.orderId && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Numéro de commande : <strong>#{result.orderId}</strong>
                </Typography>
              )}
              {result.transactionId && (
                <Typography variant="caption" color="text.secondary">
                  Transaction : {result.transactionId}
                </Typography>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => navigate('/orders')}>
                  Voir mes commandes
                </Button>
                <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
              </Box>
            </>
          ) : (
            <>
              <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Paiement échoué</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {result.message}
              </Typography>
              <Button variant="contained" onClick={() => setActiveStep(1)}>
                Réessayer
              </Button>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}
