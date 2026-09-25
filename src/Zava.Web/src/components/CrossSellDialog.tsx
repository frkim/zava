import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
  Card, CardContent, Stack, Chip, Divider, IconButton, Alert, CircularProgress,
} from '@mui/material';
import { Close, ShoppingCart, Shield, LocalOffer, CheckCircle } from '@mui/icons-material';
import { addCrossSellToCart, addWarrantyToCart } from '../api';
import type { CrossSellOffer } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import { publishCart } from '../cartEvents';

interface CrossSellDialogProps {
  open: boolean;
  onClose: () => void;
  offer: CrossSellOffer;
  productId: number;
  productName: string;
}

export default function CrossSellDialog({ open, onClose, offer, productId, productName }: CrossSellDialogProps) {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { price } = useFormatters();
  const [complementAdded, setComplementAdded] = useState(false);
  const [warrantyAdded, setWarrantyAdded] = useState(false);
  const [complementPending, setComplementPending] = useState(false);
  const [warrantyPending, setWarrantyPending] = useState(false);
  const [error, setError] = useState('');

  const handleAddComplement = async () => {
    if (!offer.complementaryProduct || complementPending) return;
    setComplementPending(true);
    setError('');
    try {
      const cart = await addCrossSellToCart(productId);
      publishCart(cart);
      setComplementAdded(true);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      setError(`${t('com.crossSell.addError')} ${detail}`);
    } finally {
      setComplementPending(false);
    }
  };

  const handleAddWarranty = async () => {
    if (!offer.warranty || warrantyPending) return;
    setWarrantyPending(true);
    setError('');
    try {
      const cart = await addWarrantyToCart(productId);
      publishCart(cart);
      setWarrantyAdded(true);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      setError(`${t('com.crossSell.warrantyError')} ${detail}`);
    } finally {
      setWarrantyPending(false);
    }
  };

  const handleClose = () => {
    setComplementAdded(false);
    setWarrantyAdded(false);
    setError('');
    onClose();
  };

  const comp = offer.complementaryProduct;
  const warranty = offer.warranty;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" />
          <Typography variant="h6">{t('crossSell.title')}</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" aria-label={t('product.close')}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="success" sx={{ mb: 2 }} icon={<ShoppingCart />}>
          <strong>{productName}</strong>
        </Alert>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

        <Stack spacing={3}>
          {/* Complementary product */}
          {comp && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {t('crossSell.complementaryTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {t('crossSell.complementaryDesc')}
              </Typography>
              <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ width: 80, height: 80, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Typography variant="h4" sx={{ opacity: 0.15, fontWeight: 700 }}>
                        {(lang === 'en' && comp.product.nameEn ? comp.product.nameEn : comp.product.name).charAt(0)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">{comp.product.brand}</Typography>
                      <Typography variant="subtitle2" noWrap>
                        {lang === 'en' && comp.product.nameEn ? comp.product.nameEn : comp.product.name}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip
                          icon={<LocalOffer />}
                          label={`-${comp.discountPercent}% ${t('crossSell.discount')}`}
                          size="small"
                          color="error"
                        />
                        <Typography variant="h6" color="primary" fontWeight={700}>
                          {price(comp.discountedPrice)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {price(comp.product.promoPrice ?? comp.product.price)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 1.5, textAlign: 'right' }}>
                    {complementAdded ? (
                      <Chip icon={<CheckCircle />} label={t('crossSell.complementAdded')} color="success" />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCart />}
                        disabled={complementPending}
                        onClick={handleAddComplement}
                      >
                        {complementPending ? t('com.crossSell.adding') : `${t('crossSell.addComplement')} — ${price(comp.discountedPrice)}`}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {comp && warranty && <Divider />}

          {/* Warranty offer */}
          {warranty && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                {t('crossSell.warrantyTitle')}
              </Typography>
              <Card variant="outlined" sx={{ borderColor: 'warning.main', bgcolor: 'warning.lighter' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Shield sx={{ fontSize: 40, color: 'warning.main', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {lang === 'en' ? warranty.nameEn : warranty.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {lang === 'en' ? warranty.descriptionEn : warranty.description}
                      </Typography>
                      <Typography variant="h6" color="warning.dark" fontWeight={700} sx={{ mt: 1 }}>
                        {price(warranty.price)}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 1.5, textAlign: 'right' }}>
                    {warrantyAdded ? (
                      <Chip icon={<CheckCircle />} label={t('crossSell.warrantyAdded')} color="success" />
                    ) : (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        startIcon={warrantyPending ? <CircularProgress size={16} color="inherit" /> : <Shield />}
                        disabled={warrantyPending}
                        onClick={handleAddWarranty}
                      >
                        {warrantyPending ? t('com.crossSell.warrantyAdding') : `${t('crossSell.addWarranty')} — ${price(warranty.price)}`}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleClose} color="inherit">
          {t('crossSell.noThanks')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShoppingCart />}
          onClick={() => { handleClose(); navigate('/cart'); }}
        >
          {t('crossSell.goToCart')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
