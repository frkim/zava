import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, IconButton, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack,
} from '@mui/material';
import { Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../api';
import type { Cart } from '../types';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart().then(setCart).finally(() => setLoading(false));
  }, []);

  const handleUpdateQty = async (productId: number, qty: number) => {
    try {
      const updated = await updateCartItem(productId, qty);
      setCart(updated);
    } catch { /* ignore */ }
  };

  const handleRemove = async (productId: number) => {
    try {
      const updated = await removeCartItem(productId);
      setCart(updated);
    } catch { /* ignore */ }
  };

  const handleClear = async () => {
    try {
      const updated = await clearCart();
      setCart(updated);
    } catch { /* ignore */ }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
        <Typography variant="h5" gutterBottom>Votre panier est vide</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Parcourez notre catalogue et ajoutez des produits
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Continuer mes achats</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Mon panier ({cart.itemCount} article{cart.itemCount > 1 ? 's' : ''})</Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <TableContainer component={Paper} sx={{ flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produit</TableCell>
                <TableCell align="right">Prix unitaire</TableCell>
                <TableCell align="center">Quantité</TableCell>
                <TableCell align="right">Sous-total</TableCell>
                <TableCell align="center" />
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.items.map((item) => (
                <TableRow key={`${item.productId}-${item.variantId}`}>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      {item.productName}
                    </Typography>
                    {item.variantName && (
                      <Typography variant="caption" color="text.secondary">{item.variantName}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{item.unitPrice.toFixed(2)} €</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                      <IconButton size="small" onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600}>{item.subtotal.toFixed(2)} €</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" size="small" onClick={() => handleRemove(item.productId)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Order summary */}
        <Paper sx={{ p: 3, width: { xs: '100%', md: 320 }, alignSelf: 'flex-start' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Résumé de la commande</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Sous-total</Typography>
            <Typography>{cart.total.toFixed(2)} €</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Livraison</Typography>
            <Typography color="success.main">Gratuite</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" fontWeight={700}>{cart.total.toFixed(2)} €</Typography>
          </Box>
          <Button variant="contained" fullWidth size="large" onClick={() => navigate('/checkout')}>
            Passer la commande
          </Button>
          <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate('/')}>
            Continuer mes achats
          </Button>
          <Button fullWidth color="error" size="small" sx={{ mt: 1 }} onClick={handleClear}>
            Vider le panier
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
