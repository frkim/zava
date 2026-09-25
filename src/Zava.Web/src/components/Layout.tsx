import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Box, InputBase, Container,
  Drawer, List, ListItemButton, ListItemText, ListItemIcon, Divider, Paper,
  MenuItem, Select, Button, ListSubheader,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  ShoppingCart, Person, Search, Menu as MenuIcon, Home, Category,
  Settings, Analytics, Close, Inventory, RestaurantMenu,
  Devices, Kitchen, Spa, ElectricalServices, Construction, LocalGroceryStore,
} from '@mui/icons-material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { getCart, getSuggestions } from '../api';
import { CART_UPDATED_EVENT } from '../cartEvents';
import { useSite } from '../context/SiteContext';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import { surfaceForWhiteText } from '../theme';
import type { Cart, SearchSuggestion } from '../types';
import type { Lang } from '../i18n';
import type { SvgIconComponent } from '@mui/icons-material';
import type { SiteType } from '../types';

const siteTypeIcons: Record<SiteType, SvgIconComponent> = {
  Electronics: Devices,
  Appliances: Kitchen,
  Cosmetics: Spa,
  Electrical: ElectricalServices,
  DIY: Construction,
  Grocery: LocalGroceryStore,
};

const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
};

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.16),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.24) },
  flexGrow: 1,
  width: '100%',
  minHeight: 44,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  minWidth: 44,
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  minHeight: 44,
  width: '100%',
  '& .MuiInputBase-input': {
    minHeight: 44,
    boxSizing: 'border-box',
    padding: theme.spacing(1, 6, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const { config, siteName, siteVersion } = useSite();
  const { lang, setLang, t } = useLanguage();
  const { price } = useFormatters();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [searchState, setSearchState] = useState({ value: '', syncedQuery: '' });
  const [suggestionsState, setSuggestionsState] = useState<{ query: string; items: SearchSuggestion[] }>({ query: '', items: [] });
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const previousPathnameRef = useRef(location.pathname);

  const urlSearchQuery = location.pathname === '/search' ? (searchParams.get('q') ?? '') : '';
  let searchQuery = searchState.value;
  if (searchState.syncedQuery !== urlSearchQuery) {
    searchQuery = urlSearchQuery;
    setSearchState({ value: urlSearchQuery, syncedQuery: urlSearchQuery });
  }

  const trimmedSearchQuery = searchQuery.trim();
  const currentSiteInfo = config?.availableSiteTypes.find((site) => site.type === config.currentSiteType);
  const storeTypeLabel = currentSiteInfo
    ? (lang === 'en' && currentSiteInfo.nameEn ? currentSiteInfo.nameEn : currentSiteInfo.name)
    : siteName;
  const SiteIcon = config?.currentSiteType ? siteTypeIcons[config.currentSiteType] : null;
  const displayedSuggestions = trimmedSearchQuery.length >= 2 && suggestionsState.query === trimmedSearchQuery
    ? suggestionsState.items
    : [];
  const listboxId = 'header-search-suggestions';
  const searchInputId = 'header-search-input';
  const suggestionListOpen = suggestionsOpen && displayedSuggestions.length > 0;
  const activeSuggestion = activeSuggestionIndex >= 0 ? displayedSuggestions[activeSuggestionIndex] : undefined;
  const itemCount = cart?.itemCount ?? 0;
  const cartLabel = lang === 'fr'
    ? `Panier, ${itemCount} article${itemCount > 1 ? 's' : ''}`
    : `Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`;
  const currentLanguageLabel = lang === 'fr' ? 'Français' : 'English';
  const footerBackground = surfaceForWhiteText(theme.palette.primary.dark);

  useEffect(() => {
    let cancelled = false;
    const loadCart = async () => {
      try {
        const c = await getCart();
        if (!cancelled) setCart(c);
      } catch { /* ignore */ }
    };

    void loadCart();
    const interval = window.setInterval(() => {
      void loadCart();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [siteVersion]);

  useEffect(() => {
    const onCartUpdated = (event: Event) => setCart((event as CustomEvent<Cart>).detail);
    window.addEventListener(CART_UPDATED_EVENT, onCartUpdated);
    return () => window.removeEventListener(CART_UPDATED_EVENT, onCartUpdated);
  }, []);

  useEffect(() => {
    if (trimmedSearchQuery.length < 2) return undefined;

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      try {
        const s = await getSuggestions(trimmedSearchQuery);
        if (!cancelled) setSuggestionsState({ query: trimmedSearchQuery, items: s });
      } catch { /* ignore */ }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [trimmedSearchQuery]);

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) return;
    previousPathnameRef.current = location.pathname;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      const pageTitle = document.querySelector<HTMLElement>('[data-page-title]');
      const main = document.getElementById('main-content');
      (pageTitle ?? main)?.focus({ preventScroll: true });
    });
  }, [location.pathname]);

  const setSearchValue = (value: string) => {
    setSearchState({ value, syncedQuery: urlSearchQuery });
  };

  const submitSearch = (query: string) => {
    const nextQuery = query.trim();
    setSuggestionsOpen(false);
    setActiveSuggestionIndex(-1);
    navigate(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : '/search');
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    submitSearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSuggestionsOpen(false);
    setActiveSuggestionIndex(-1);
    setSearchValue('');
    navigate(`/products/${suggestion.productId}`);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSuggestionsOpen(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (event.key === 'ArrowDown' && displayedSuggestions.length > 0) {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestionIndex((current) => (current + 1) % displayedSuggestions.length);
      return;
    }

    if (event.key === 'ArrowUp' && displayedSuggestions.length > 0) {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestionIndex((current) => (current <= 0 ? displayedSuggestions.length - 1 : current - 1));
      return;
    }

    if (event.key === 'Enter' && activeSuggestion && suggestionListOpen) {
      event.preventDefault();
      handleSuggestionClick(activeSuggestion);
    }
  };

  const handleSearchBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    const nextFocus = event.relatedTarget;
    if (!(nextFocus instanceof Node) || !event.currentTarget.contains(nextFocus)) {
      setSuggestionsOpen(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const isActivePath = (path: string) => (
    path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  const buyerNavItems = [
    { text: t('nav.home'), icon: <Home />, path: '/' },
    { text: t('nav.categories'), icon: <Category />, path: '/categories' },
    { text: t('nav.allProducts'), icon: <Inventory />, path: '/search' },
    ...(config?.currentSiteType === 'Grocery'
      ? [{ text: t('recipe.title'), icon: <RestaurantMenu />, path: '/recipe-basket' }]
      : []),
    { text: t('nav.profile'), icon: <Person />, path: '/profile' },
  ];
  const demoNavItems = [
    { text: t('nav.analytics'), icon: <Analytics />, path: '/analytics' },
    { text: t('nav.settings'), icon: <Settings />, path: '/settings' },
  ];
  const desktopNavItems = buyerNavItems.filter((item) => item.path === '/categories' || item.path === '/search' || item.path === '/recipe-basket');

  const languageSelect = (compact = false) => (
    <Select
      value={lang}
      onChange={(event: SelectChangeEvent) => setLang(event.target.value as Lang)}
      size="small"
      variant={compact ? 'outlined' : 'standard'}
      disableUnderline={!compact}
      inputProps={{ 'aria-label': lang === 'fr' ? `Langue : ${currentLanguageLabel}` : `Language: ${currentLanguageLabel}` }}
      renderValue={(value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <img
            src={`https://flagcdn.com/w40/${value === 'fr' ? 'fr' : 'gb'}.png`}
            alt=""
            width={20}
            height={15}
            style={{ borderRadius: 2 }}
          />
          {value.toUpperCase()}
        </Box>
      )}
      sx={compact
        ? { minWidth: 160 }
        : { color: 'white', ml: 1, '& .MuiSelect-icon': { color: 'white' }, '& .MuiSelect-select': { minHeight: 32, py: 0.5, display: 'flex', alignItems: 'center' } }}
    >
      <MenuItem value="fr">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="https://flagcdn.com/w40/fr.png" alt="" width={20} height={15} style={{ borderRadius: 2 }} />
          Français
        </Box>
      </MenuItem>
      <MenuItem value="en">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="https://flagcdn.com/w40/gb.png" alt="" width={20} height={15} style={{ borderRadius: 2 }} />
          English
        </Box>
      </MenuItem>
    </Select>
  );

  const renderNavList = (items: typeof buyerNavItems) => items.map((item) => {
    const active = isActivePath(item.path);
    return (
      <ListItemButton
        key={item.path}
        component={RouterLink}
        to={item.path}
        selected={active}
        aria-current={active ? 'page' : undefined}
        onClick={() => setDrawerOpen(false)}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          ...visuallyHidden,
          '&:focus': {
            clip: 'auto',
            height: 'auto',
            m: 1,
            overflow: 'visible',
            p: 1.5,
            width: 'auto',
            zIndex: theme.zIndex.tooltip,
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderRadius: 1,
          },
        }}
      >
        {t('common.skipToContent')}
      </Box>

      <AppBar component="header" position="sticky">
        <Toolbar
          sx={{
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            gap: { xs: 1, md: 0 },
            alignItems: 'center',
            py: { xs: 1, md: 0 },
          }}
        >
          <IconButton color="inherit" edge="start" aria-label={t('nav.menu')} onClick={() => setDrawerOpen(true)} sx={{ mr: { xs: 0.5, md: 1 } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            component={RouterLink}
            to="/"
            aria-label={`Zava ${storeTypeLabel}`}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0,
              flexShrink: 1,
              mr: { xs: 'auto', md: 2 },
            }}
          >
            {SiteIcon ? <SiteIcon fontSize="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }} /> : null}
            <Box sx={{ minWidth: 0 }}>
              <Typography component="span" variant="h6" sx={{ display: 'block', lineHeight: 1.1, fontWeight: 800 }}>
                Zava
              </Typography>
              <Typography component="span" variant="caption" sx={{ display: 'block', lineHeight: 1, opacity: 0.92 }} noWrap>
                {storeTypeLabel}
              </Typography>
            </Box>
          </Typography>

          <Box
            component="nav"
            aria-label={t('shell.primaryNavLabel')}
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, mr: 2 }}
          >
            {desktopNavItems.map((item) => {
              const active = isActivePath(item.path);
              return (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  size="small"
                  startIcon={item.path === '/recipe-basket' ? <RestaurantMenu /> : undefined}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    minHeight: 44,
                    borderBottom: active ? 2 : 0,
                    borderRadius: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>

          <Box
            component="form"
            role="search"
            onSubmit={handleSearch}
            onBlur={handleSearchBlur}
            sx={{
              order: { xs: 2, md: 0 },
              flexGrow: 1,
              minWidth: { xs: '100%', md: 220 },
              maxWidth: { xs: 'none', md: 560 },
              display: 'flex',
              color: 'inherit',
              mx: { xs: 0, md: 1 },
            }}
          >
            <SearchBox>
              <Box component="label" htmlFor={searchInputId} sx={visuallyHidden}>
                {t('shell.searchLabel')}
              </Box>
              <SearchIconWrapper aria-hidden="true"><Search /></SearchIconWrapper>
              <StyledInputBase
                id={searchInputId}
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setSuggestionsOpen(true);
                  setActiveSuggestionIndex(-1);
                }}
                onFocus={() => {
                  if (trimmedSearchQuery.length >= 2) setSuggestionsOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
                inputProps={{
                  role: 'combobox',
                  'aria-label': t('shell.searchLabel'),
                  'aria-autocomplete': 'list',
                  'aria-expanded': suggestionListOpen,
                  'aria-controls': listboxId,
                  'aria-activedescendant': activeSuggestion ? `header-search-suggestion-${activeSuggestion.productId}` : undefined,
                }}
              />
              <IconButton
                type="submit"
                color="inherit"
                aria-label={t('shell.searchSubmit')}
                sx={{ position: 'absolute', right: 0, top: 0, minWidth: 44, minHeight: 44 }}
              >
                <Search />
              </IconButton>
              {suggestionListOpen && (
                <Paper
                  id={listboxId}
                  role="listbox"
                  aria-label={t('shell.suggestionsLabel')}
                  sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: theme.zIndex.modal, maxHeight: 400, overflow: 'auto', mt: 0.5 }}
                >
                  {displayedSuggestions.map((suggestion, index) => (
                    <MenuItem
                      key={suggestion.productId}
                      id={`header-search-suggestion-${suggestion.productId}`}
                      role="option"
                      aria-selected={index === activeSuggestionIndex}
                      selected={index === activeSuggestionIndex}
                      onMouseEnter={() => setActiveSuggestionIndex(index)}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{ minHeight: 56 }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{suggestion.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{suggestion.brand} — {price(suggestion.price)}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Paper>
              )}
            </SearchBox>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 'auto' }}>
            {languageSelect()}
            <IconButton color="inherit" aria-label={t('shell.profileLabel')} onClick={() => navigate('/profile')} sx={{ ml: 1 }}>
              <Person />
            </IconButton>
          </Box>
          <IconButton color="inherit" aria-label={cartLabel} onClick={() => navigate('/cart')} sx={{ ml: { xs: 0, md: 0.5 } }}>
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, pt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
            <Typography variant="h6" fontWeight={700}>{t('nav.menu')}</Typography>
            <IconButton aria-label={t('common.close')} onClick={() => setDrawerOpen(false)}><Close /></IconButton>
          </Box>
          <Divider />
          <Box component="nav" aria-label={t('shell.drawerNavLabel')}>
            <List
              subheader={<ListSubheader component="div">{t('shell.buyGroup')}</ListSubheader>}
            >
              {renderNavList(buyerNavItems)}
            </List>
            <Divider />
            <List
              subheader={<ListSubheader component="div">{t('shell.demoToolsGroup')}</ListSubheader>}
            >
              {renderNavList(demoNavItems)}
            </List>
          </Box>
          <Divider />
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="subtitle2" gutterBottom>{t('shell.languageGroup')}</Typography>
            {languageSelect(true)}
          </Box>
        </Box>
      </Drawer>

      <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: 1 }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>

      <Box component="footer" sx={{ bgcolor: footerBackground, color: 'common.white', py: 4, mt: 'auto' }}>
        <Container maxWidth="xl">
          <Box
            component="nav"
            aria-label={t('shell.footerNavLabel')}
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mb: 3 }}
          >
            {([
              { label: t('footer.freeDelivery'), path: '/info/delivery' },
              { label: t('footer.premium'), path: '/info/premium' },
              { label: t('footer.returns'), path: '/info/returns' },
              { label: t('footer.support'), path: '/info/after-sales' },
              { label: t('footer.bestPrices'), path: '/info/best-prices' },
              { label: t('footer.drive'), path: '/info/drive' },
            ]).map((item) => (
              <Typography
                key={item.path}
                variant="body2"
                component={RouterLink}
                to={item.path}
                sx={{ color: 'common.white', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
          <Divider sx={{ bgcolor: alpha(theme.palette.common.white, 0.3), my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'common.white' }}>
              © {new Date().getFullYear()} Zava — {t('footer.demo')}
            </Typography>
            <Box
              component="nav"
              aria-label={t('shell.legalNavLabel')}
              sx={{ display: 'flex', gap: 1, color: 'common.white' }}
            >
              {([
                { label: t('footer.terms'), path: '/info/terms' },
                { label: t('footer.legalNotice'), path: '/info/legal' },
                { label: t('footer.privacy'), path: '/info/privacy' },
              ]).map((item, index, arr) => (
                <Typography key={item.path} variant="caption" component="span">
                  <RouterLink to={item.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {item.label}
                  </RouterLink>
                  {index < arr.length - 1 ? ' · ' : ''}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export { type LayoutProps };
