import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Box, InputBase, Container,
  Drawer, List, ListItemButton, ListItemText, ListItemIcon, Divider, Paper,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart, Person, Search, Menu as MenuIcon, Home, Category,
  Settings, Analytics, Close, Inventory,
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { getCart, getSuggestions } from '../api';
import { useSite } from '../context/SiteContext';
import type { Cart, SearchSuggestion } from '../types';

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  flexGrow: 1,
  maxWidth: 600,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { siteName, siteVersion } = useSite();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  const fetchCart = useCallback(async () => {
    try {
      const c = await getCart();
      setCart(c);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchCart();
    const interval = setInterval(fetchCart, 5000);
    return () => clearInterval(interval);
  }, [fetchCart, siteVersion]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const s = await getSuggestions(searchQuery);
        setSuggestions(s);
        setShowSuggestions(true);
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId: number) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/products/${productId}`);
  };

  const navItems = [
    { text: 'Accueil', icon: <Home />, path: '/' },
    { text: 'Catégories', icon: <Category />, path: '/categories' },
    { text: 'Tous les produits', icon: <Inventory />, path: '/search' },
    { text: 'Mon profil', icon: <Person />, path: '/profile' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Paramètres', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            {siteName}
          </Typography>

          <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <SearchBox>
              <SearchIconWrapper><Search /></SearchIconWrapper>
              <StyledInputBase
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, maxHeight: 400, overflow: 'auto' }}>
                  {suggestions.map((s) => (
                    <MenuItem key={s.productId} onMouseDown={() => handleSuggestionClick(s.productId)}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{s.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.brand} — {s.price.toFixed(2)} €</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Paper>
              )}
            </SearchBox>
          </Box>

          <IconButton color="inherit" onClick={() => navigate('/profile')} sx={{ ml: 1 }}>
            <Person />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cart?.itemCount ?? 0} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
            <Typography variant="h6" fontWeight={700}>Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={RouterLink}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', py: 4, mt: 'auto' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', mb: 3 }}>
            {[
              '🚚 Livraison offerte* — Partout en France',
              '⭐ Abonnement Premium — Tous les avantages',
              '↩️ Retours sous 15 jours',
              '🛠️ Service après-vente',
              '💰 Meilleurs prix garantis',
              '🚗 Le Drive — Gagner du temps',
            ].map((text) => (
              <Typography key={text} variant="body2" sx={{ opacity: 0.8 }}>{text}</Typography>
            ))}
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              © {new Date().getFullYear()} Zava — Site de démonstration e-commerce
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Conditions Générales · Mentions Légales · Politique de Confidentialité
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export { type LayoutProps };
