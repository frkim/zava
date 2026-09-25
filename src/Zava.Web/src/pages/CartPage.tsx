import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack,
  Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../api';
import type { Cart, CartItem } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import RecipeBasketLink from '../components/RecipeBasketLink';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { publishCart } from '../cartEvents';

export default function CartPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { price } = useFormatters();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    setError('');
    try {
      setCart(await getCart());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, []);

  const mutateCart = async (operation: () => Promise<Cart>) => {
    if (pending) return;
    setPending(true);
    setError('');
    try {
      const nextCart = await operation();
      setCart(nextCart);
      publishCart(nextCart);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  };

  const changeQuantity = (item: CartItem, quantity: number) =>
    mutateCart(() => updateCartItem(item.productId, quantity, item.variantId, item.offerTriggerProductId));

  const removeLine = (item: CartItem) =>
    mutateCart(() => removeCartItem(item.productId, item.variantId, item.offerTriggerProductId));

  const lineKey = (item: CartItem, index: number) =>
    `${item.productId}-${item.variantId ?? 'no-variant'}-${item.offerTriggerProductId ?? 'regular'}-${index}`;

  const lineDetail = (item: CartItem) => (
    <Stack spacing={0.5}>
      <Button variant="text" sx={{ justifyContent: 'flex-start', p: 0, minWidth: 0, textAlign: 'left' }}
        onClick={() => navigate(`/products/${Math.abs(item.productId)}`)}>
        <Typography variant="subtitle2">{item.productName}</Typography>
      </Button>
      {item.variantName && <Typography variant="caption" color="text.secondary">{item.variantName}</Typography>}
      {item.discountPercent && (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip size="small" color="error" label={`${t('com.cart.offer')} -${item.discountPercent}%`} />
          {item.regularUnitPrice != null && (
            <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              {t('com.cart.regularPrice')} {price(item.regularUnitPrice)}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );

  const quantityStepper = (item: CartItem) => (
    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
      <IconButton size="small" disabled={pending} aria-label={t('cart.decrease')}
        onClick={() => changeQuantity(item, item.quantity - 1)}>
        <Remove fontSize="small" />
      </IconButton>
      <Typography>{item.quantity}</Typography>
      <IconButton size="small" disabled={pending || item.productId < 0} aria-label={t('cart.increase')}
        onClick={() => changeQuantity(item, item.quantity + 1)}>
        <Add fontSize="small" />
      </IconButton>
    </Stack>
  );

  const content = () => {
    if (loading) return <LoadingState />;
    if (!cart) return <ErrorState detail={error} onRetry={() => void loadCart()} />;
    if (cart.items.length === 0) {
      return (
        <>
          <EmptyState
            title={t('cart.empty')}
            description={t('cart.emptyDesc')}
            icon={<ShoppingCart />}
            action={<Button variant="contained" onClick={() => navigate('/')}>{t('cart.continueShopping')}</Button>}
          />
          <Box sx={{ maxWidth: 720, mx: 'auto', mt: 4 }}><RecipeBasketLink /></Box>
        </>
      );
    }

    return (
      <>
        <RecipeBasketLink />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {t('com.api.genericError')} {t('com.api.detailPrefix')} : {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' }, flex: 1 }}>
            {cart.items.map((item, index) => (
              <Paper key={lineKey(item, index)} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.25}>
                  {lineDetail(item)}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t('cart.unitPrice')}</Typography>
                      <Typography fontWeight={600}>{price(item.unitPrice)}</Typography>
                    </Box>
                    {quantityStepper(item)}
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t('com.cart.lineSubtotal')}</Typography>
                      <Typography fontWeight={700}>{price(item.subtotal)}</Typography>
                    </Box>
                    <Button color="error" size="small" startIcon={<Delete />} disabled={pending}
                      onClick={() => removeLine(item)}>
                      {t('cart.remove')}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <TableContainer component={Paper} sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('cart.product')}</TableCell>
                  <TableCell align="right">{t('cart.unitPrice')}</TableCell>
                  <TableCell align="center">{t('cart.quantity')}</TableCell>
                  <TableCell align="right">{t('cart.subtotal')}</TableCell>
                  <TableCell align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item, index) => (
                  <TableRow key={lineKey(item, index)}>
                    <TableCell>{lineDetail(item)}</TableCell>
                    <TableCell align="right">{price(item.unitPrice)}</TableCell>
                    <TableCell align="center">{quantityStepper(item)}</TableCell>
                    <TableCell align="right"><Typography fontWeight={600}>{price(item.subtotal)}</Typography></TableCell>
                    <TableCell align="center">
                      <IconButton color="error" size="small" disabled={pending} aria-label={t('cart.remove')}
                        onClick={() => removeLine(item)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper sx={{ p: 3, width: { xs: '100%', md: 320 }, alignSelf: 'flex-start' }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>{t('cart.orderSummary')}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>{t('cart.subtotal')}</Typography>
              <Typography>{price(cart.total)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>{t('cart.delivery')}</Typography>
              <Typography color="success.main">{t('cart.free')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6">{t('cart.total')}</Typography>
              <Typography variant="h6" fontWeight={700}>{price(cart.total)}</Typography>
            </Box>
            <Button variant="contained" fullWidth size="large" disabled={pending} onClick={() => navigate('/checkout')}>
              {t('cart.checkout')}
            </Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate('/')}>
              {t('cart.continueShopping')}
            </Button>
            <Button fullWidth color="error" size="small" sx={{ mt: 1 }} disabled={pending} onClick={() => setClearConfirmOpen(true)}>
              {t('cart.clear')}
            </Button>
          </Paper>
        </Box>
      </>
    );
  };

  return (
    <Box>
      <PageTitle subtitle={cart ? `${cart.itemCount} ${cart.itemCount > 1 ? t('cart.articles') : t('cart.article')}` : undefined}>
        {t('cart.title')}
      </PageTitle>
      {content()}
      <Dialog open={clearConfirmOpen} onClose={() => setClearConfirmOpen(false)}>
        <DialogTitle>{t('com.cart.confirmClearTitle')}</DialogTitle>
        <DialogContent>
          <Typography>{t('com.cart.confirmClearDesc')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearConfirmOpen(false)}>{t('common.cancel')}</Button>
          <Button color="error" variant="contained" disabled={pending}
            onClick={() => {
              setClearConfirmOpen(false);
              void mutateCart(clearCart);
            }}>
            {t('com.cart.confirmClearAction')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
