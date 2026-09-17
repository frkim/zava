import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert, AlertTitle, Box, Button, Chip, CircularProgress, Collapse, Divider, FormControl,
  FormControlLabel, FormLabel, LinearProgress, Link, Paper, Radio, RadioGroup,
  Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import {
  AddCircleOutline, ArrowForward, CheckCircleOutline, ExpandMore, MenuBook, RemoveCircleOutline,
  RestaurantMenu, ShoppingBasket, ShoppingCartOutlined, VisibilityOff,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { ApiError, commitRecipeBasket, getRecipeBasketOptions, planRecipeBasket } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { useHiddenRecipeProducts } from '../hooks/useHiddenRecipeProducts';
import type {
  RecipeBasketOptions, RecipeBasketPlan, RecipeBrandPreference, RecipeHideScope,
} from '../types';

const defaultSuggestions = ['Lasagnes', 'Blanquette de veau', 'Hachis parmentier', 'Bœuf bourguignon'];
const preferences = ['National', 'PrivateLabel', 'Economy', 'Mix'] as const;
type PlanItem = RecipeBasketPlan['items'][number];
/** Identifies a previewed line, since the same product can appear with different variants. */
const itemKey = (item: { productId: number; variantId?: number | null }) =>
  `${item.productId}:${item.variantId ?? ''}`;
type OptionsState =
  | { status: 'loading' }
  | { status: 'ready'; data: RecipeBasketOptions }
  | { status: 'error'; message: string };

function CatalogueLinks() {
  const { t } = useLanguage();
  return (
    <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
      <Button component={RouterLink} to="/search" variant="outlined">{t('recipe.browse')}</Button>
      <Button component={RouterLink} to="/cart">{t('recipe.viewCart')}</Button>
    </Stack>
  );
}

/** A disclosure panel that keeps secondary product lists out of the way without hiding them. */
function CollapsibleSection({ id, title, count, description, open, onToggle, children, sx }: {
  id: string; title: string; count: number; description: string; open: boolean;
  onToggle: () => void; children: React.ReactNode; sx?: object;
}) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2, ...sx }}>
      <Button fullWidth onClick={onToggle} aria-expanded={open} aria-controls={`${id}-panel`} id={`${id}-button`}
        endIcon={<ExpandMore sx={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />}
        sx={{ justifyContent: 'space-between', textAlign: 'left', px: 2, py: 1.5, color: 'text.primary' }}>
        <Box component="span" sx={{ fontWeight: 600 }}>{title} ({count})</Box>
      </Button>
      <Collapse in={open} unmountOnExit>
        <Box id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} sx={{ px: 2, pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{description}</Typography>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

/** One previewed product, in the selection or moved out of it. */
function PlanItemRow({ item, selected, disabled, hiddenScope, money, onToggleSelection, onHide, onUnhide }: {
  item: PlanItem; selected: boolean; disabled: boolean; hiddenScope: RecipeHideScope | null;
  money: (value: number) => string; onToggleSelection: () => void;
  onHide: (scope: RecipeHideScope) => void; onUnhide: () => void;
}) {
  const { t } = useLanguage();
  const label = `${item.productName}${item.variantName ? ` – ${item.variantName}` : ''}`;
  return (
    <Box component="li" sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{item.ingredient}</Typography>
      <Link component={RouterLink} to={`/products/${item.productId}`} underline="hover" color="text.primary"
        sx={{ display: 'block', fontWeight: 600, overflowWrap: 'anywhere' }}>{item.productName}</Link>
      {item.variantName && <Typography variant="body2" color="text.secondary">{item.variantName}</Typography>}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2" color={selected ? 'text.secondary' : 'text.disabled'}>
          {item.quantity} {t('recipe.pack')} × {money(item.unitPrice)}
        </Typography>
        <Typography variant="body2" fontWeight={700}
          color={selected ? 'text.primary' : 'text.disabled'}
          sx={{ whiteSpace: 'nowrap', textDecoration: selected ? 'none' : 'line-through' }}>
          {money(item.subtotal)}
        </Typography>
      </Box>
      <Button size="small" disabled={disabled} onClick={onToggleSelection}
        startIcon={selected ? <RemoveCircleOutline /> : <AddCircleOutline />}
        aria-label={`${t(selected ? 'recipe.deselect' : 'recipe.reselect')} : ${label}`}
        sx={{ mt: 1, ml: -1 }}>
        {t(selected ? 'recipe.deselect' : 'recipe.reselect')}
      </Button>
      {!selected && (
        <Box sx={{ mt: 1 }}>
          <Typography component="p" variant="caption" color="text.secondary" id={`hide-${itemKey(item)}`} sx={{ mb: 0.5 }}>
            {t('recipe.hideTitle')}
          </Typography>
          <ToggleButtonGroup size="small" exclusive disabled={disabled} value={hiddenScope}
            aria-labelledby={`hide-${itemKey(item)}`}
            onChange={(_, scope: RecipeHideScope | null) => (scope ? onHide(scope) : onUnhide())}>
            <ToggleButton value="session" sx={{ textTransform: 'none' }}>{t('recipe.hideSession')}</ToggleButton>
            <ToggleButton value="forever" sx={{ textTransform: 'none' }}>{t('recipe.hideForever')}</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
    </Box>
  );
}

export default function RecipeBasketPage() {
  const { config, siteVersion } = useSite();
  const { t } = useLanguage();

  if (!config) {
    return <Box role="status" sx={{ textAlign: 'center', py: 8 }}><CircularProgress aria-label={t('recipe.optionsLoading')} /></Box>;
  }
  if (config.currentSiteType !== 'Grocery') {
    return (
      <Paper variant="outlined" sx={{ maxWidth: 760, mx: 'auto', p: { xs: 3, md: 5 } }}>
        <RestaurantMenu color="primary" sx={{ fontSize: 40, mb: 2 }} />
        <Typography component="h1" variant="h4" gutterBottom>{t('recipe.title')}</Typography>
        <Alert severity="info" sx={{ my: 3 }}>
          <AlertTitle>{t('recipe.groceryOnly')}</AlertTitle>
          {t('recipe.groceryOnlyDesc')}
        </Alert>
        <CatalogueLinks />
      </Paper>
    );
  }
  // Remounting invalidates every preview and in-flight response when the catalogue changes.
  return <GroceryRecipeBasket key={siteVersion} />;
}

function GroceryRecipeBasket() {
  const { lang, t } = useLanguage();
  const [options, setOptions] = useState<OptionsState>({ status: 'loading' });
  const [optionsAttempt, setOptionsAttempt] = useState(0);
  const [recipe, setRecipe] = useState('');
  const [servings, setServings] = useState('4');
  const [brandPreference, setBrandPreference] = useState<RecipeBrandPreference>('Mix');
  const [plan, setPlan] = useState<RecipeBasketPlan | null>(null);
  const [planning, setPlanning] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [error, setError] = useState('');
  const [commitError, setCommitError] = useState('');
  const [uncertainCommit, setUncertainCommit] = useState(false);
  const [commitRequiresRefresh, setCommitRequiresRefresh] = useState(false);
  const [expired, setExpired] = useState(false);
  const [deselected, setDeselected] = useState<string[]>([]);
  const [showDeselected, setShowDeselected] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const { hidden, hiddenIds, hide, unhide, scopeOf } = useHiddenRecipeProducts();
  const busy = useRef(false);
  const active = useRef(false);
  const planController = useRef<AbortController | null>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const money = (value: number) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency', currency: 'EUR',
  }).format(value);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      planController.current?.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getRecipeBasketOptions(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setOptions({ status: 'ready', data });
      })
      .catch((e: unknown) => {
        if (!controller.signal.aborted) {
          setOptions({ status: 'error', message: e instanceof Error ? e.message : String(e) });
        }
      });
    return () => controller.abort();
  }, [optionsAttempt]);

  useEffect(() => {
    if (!plan || committed) return;
    const expiry = Date.parse(plan.expiresAt);
    const timeout = window.setTimeout(() => setExpired(true),
      Number.isFinite(expiry) ? Math.max(0, expiry - Date.now()) : 0);
    return () => window.clearTimeout(timeout);
  }, [plan, committed]);

  useEffect(() => {
    if (plan) previewHeading.current?.focus();
  }, [plan]);

  const resetPreview = () => {
    setPlan(null);
    setError('');
    setCommitError('');
    setCommitted(false);
    setUncertainCommit(false);
    setCommitRequiresRefresh(false);
    setExpired(false);
    setDeselected([]);
    setShowDeselected(false);
  };

  const validServings = Number.isInteger(Number(servings)) && Number(servings) >= 1 && Number(servings) <= 20;
  const validForm = recipe.trim().length > 0 && recipe.length <= 200 && validServings;

  const preparePlan = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy.current || !validForm || options.status !== 'ready' || !options.data.available) return;
    busy.current = true;
    resetPreview();
    setPlanning(true);
    const controller = new AbortController();
    planController.current = controller;
    try {
      const result = await planRecipeBasket({
        recipe: recipe.trim(), servings: Number(servings), brandPreference, excludedProductIds: hiddenIds,
      }, controller.signal);
      if (active.current && !controller.signal.aborted) setPlan(result);
    } catch (e) {
      if (active.current && !controller.signal.aborted) setError(e instanceof Error ? e.message : t('recipe.planError'));
    } finally {
      if (active.current) {
        busy.current = false;
        setPlanning(false);
      }
    }
  };

  const planItems = useMemo(() => plan?.items ?? [], [plan]);
  const selectedItems = useMemo(
    () => planItems.filter((item) => !deselected.includes(itemKey(item))),
    [planItems, deselected],
  );
  const deselectedItems = useMemo(
    () => planItems.filter((item) => deselected.includes(itemKey(item))),
    [planItems, deselected],
  );
  const selectedTotal = useMemo(
    () => selectedItems.reduce((total, item) => total + item.subtotal, 0),
    [selectedItems],
  );
  // A commit that may already have been received must be retried with the very same selection.
  const selectionLocked = committing || committed || uncertainCommit || commitRequiresRefresh;

  const toggleSelection = (item: PlanItem) => {
    if (selectionLocked) return;
    const key = itemKey(item);
    setCommitError('');
    setDeselected((previous) => {
      if (previous.includes(key)) return previous.filter((entry) => entry !== key);
      setShowDeselected(true);
      return [...previous, key];
    });
  };

  const hideProduct = (item: PlanItem, scope: RecipeHideScope) => {
    if (selectionLocked) return;
    hide({ productId: item.productId, productName: item.productName }, scope);
    // Hiding only takes effect on the next suggestion, so keep it out of this basket too.
    setDeselected((previous) => [...new Set([
      ...previous,
      ...planItems.filter((entry) => entry.productId === item.productId).map(itemKey),
    ])]);
  };

  const confirmPlan = async () => {
    if (!plan || busy.current || committed || commitRequiresRefresh || !selectedItems.length) return;
    if (!uncertainCommit && (expired || Date.parse(plan.expiresAt) <= Date.now())) {
      setExpired(true);
      return;
    }
    busy.current = true;
    setCommitting(true);
    setCommitError('');
    try {
      const cart = await commitRecipeBasket(plan.planId, deselectedItems.map((item) => ({
        productId: item.productId, variantId: item.variantId ?? null,
      })));
      if (!active.current) return;
      window.dispatchEvent(new CustomEvent('zava:cart-updated', { detail: cart }));
      setCommitted(true);
      setUncertainCommit(false);
    } catch (e) {
      if (!active.current) return;
      setCommitError(e instanceof Error ? e.message : t('common.error'));
      // A lost response may hide a successful commit. Retrying the same plan is idempotent.
      setUncertainCommit((previous) => !(e instanceof ApiError) || e.status >= 500
        || e.status === 408 || (e.status === 429 && previous));
      setCommitRequiresRefresh(e instanceof ApiError && (e.status === 409 || e.status === 410));
      if (e instanceof ApiError && e.status === 410) setExpired(true);
    } finally {
      if (active.current) {
        busy.current = false;
        setCommitting(false);
      }
    }
  };

  const suggestions = options.status === 'ready' && options.data.suggestions.length
    ? [...new Set(options.data.suggestions)].filter((item) => item.trim() && item.length <= 200).slice(0, 4)
    : defaultSuggestions;
  const formDisabled = planning || committing;

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
      <Box component="header" sx={{
        position: 'relative', overflow: 'hidden', borderRadius: 4, mb: 3,
        p: { xs: 3, sm: 4, md: 5 }, color: 'white',
        background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
      }}>
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '100%', md: '76%' } }}>
          <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.85 }}>{t('recipe.eyebrow')}</Typography>
          <Typography component="h1" variant="h3" fontWeight={800} sx={{ mt: 0.5, mb: 1.5, fontSize: { xs: '2.2rem', md: '3rem' } }}>
            {t('recipe.title')}
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 1 }}>{t('recipe.intro')}</Typography>
          <Typography sx={{ opacity: 0.9, maxWidth: 650, lineHeight: 1.7 }}>{t('recipe.description')}</Typography>
        </Box>
        <Box aria-hidden="true" sx={{
          position: 'absolute', right: { xs: -60, md: 36 }, top: { xs: -70, md: 40 },
          width: 190, height: 190, borderRadius: '50%', border: '1px solid rgba(255,255,255,.2)',
          display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,.06)',
          opacity: { xs: 0.25, md: 1 },
        }}>
          <Box sx={{ width: 145, height: 145, display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1px solid rgba(255,255,255,.2)' }}>
            <RestaurantMenu sx={{ fontSize: 70, opacity: 0.85 }} />
          </Box>
        </Box>
      </Box>

      {options.status === 'loading' && (
        <Paper variant="outlined" role="status" sx={{ p: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
          <CircularProgress size={24} aria-label={t('recipe.optionsLoading')} />
          <Typography>{t('recipe.optionsLoading')}</Typography>
        </Paper>
      )}
      {(options.status === 'error' || (options.status === 'ready' && !options.data.available)) && (
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
          <Alert severity={options.status === 'error' ? 'error' : 'info'} sx={{ mb: 3 }}>
            <AlertTitle>{t(options.status === 'error' ? 'recipe.optionsError' : 'recipe.unavailable')}</AlertTitle>
            {options.status === 'error' ? options.message : t('recipe.unavailableDesc')}
          </Alert>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
            <Button onClick={() => { setOptions({ status: 'loading' }); setOptionsAttempt((attempt) => attempt + 1); }}>
              {t('recipe.retry')}
            </Button>
            <CatalogueLinks />
          </Stack>
        </Paper>
      )}
      {options.status === 'ready' && options.data.available && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' }, gap: 3, alignItems: 'start' }}>
          <Paper component="form" onSubmit={preparePlan} variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}>
            <Typography component="h2" variant="h5" gutterBottom>{t('recipe.formTitle')}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{t('recipe.formDesc')}</Typography>

            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>{t('recipe.suggestions')}</Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} sx={{ mb: 3 }}>
              {suggestions.map((suggestion) => (
                <Chip key={suggestion} label={suggestion} clickable disabled={formDisabled}
                  color={recipe === suggestion ? 'primary' : 'default'}
                  variant={recipe === suggestion ? 'filled' : 'outlined'}
                  onClick={() => { resetPreview(); setRecipe(suggestion); }}
                  sx={{ minHeight: 36, height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', py: 0.75 } }} />
              ))}
            </Stack>
            <TextField id="recipe-name" fullWidth required disabled={formDisabled} label={t('recipe.name')}
              placeholder={t('recipe.placeholder')} value={recipe}
              onChange={(event) => { resetPreview(); setRecipe(event.target.value); }}
              slotProps={{ htmlInput: { maxLength: 200 } }}
              helperText={`${t('recipe.nameHelp')} (${recipe.length}/200)`}
              sx={{ mb: 2.5 }} />
            <TextField id="recipe-servings" type="number" required disabled={formDisabled}
              label={t('recipe.servings')} value={servings}
              error={!validServings} helperText={t('recipe.servingsHelp')}
              onChange={(event) => { resetPreview(); setServings(event.target.value); }}
              slotProps={{ htmlInput: { min: 1, max: 20, step: 1 } }}
              sx={{ mb: 3, width: { xs: '100%', sm: 220 } }} />

            <FormControl component="fieldset" fullWidth disabled={formDisabled} sx={{ mb: 3 }}>
              <FormLabel component="legend" id="recipe-brands" sx={{ color: 'text.primary', fontWeight: 600, mb: 1.5 }}>
                {t('recipe.brands')}
              </FormLabel>
              <RadioGroup aria-labelledby="recipe-brands" name="recipe-brand-preference" value={brandPreference}
                onChange={(event) => { resetPreview(); setBrandPreference(event.target.value as RecipeBrandPreference); }}
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25 }}>
                {preferences.map((preference) => (
                  <FormControlLabel key={preference} value={preference} control={<Radio size="small" />}
                    label={<Box sx={{ py: 1.5, pr: 1 }}>
                      <Typography variant="body2" fontWeight={700}>{t(`recipe.${preference}`)}</Typography>
                      <Typography variant="caption" color="text.secondary">{t(`recipe.${preference}Desc`)}</Typography>
                    </Box>}
                    sx={{
                      m: 0, alignItems: 'center', minHeight: 82, border: '1px solid', borderRadius: 2,
                      borderColor: brandPreference === preference ? 'primary.main' : 'divider',
                      bgcolor: (theme) => brandPreference === preference ? alpha(theme.palette.primary.main, 0.045) : 'transparent',
                      '&:focus-within': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                    }} />
                ))}
              </RadioGroup>
            </FormControl>
            {error && <Alert severity="error" sx={{ mb: 2 }}><AlertTitle>{t('recipe.planError')}</AlertTitle>{error}</Alert>}
            <Button type="submit" variant="contained" fullWidth size="large" disabled={!validForm || formDisabled}
              startIcon={planning ? <CircularProgress size={18} color="inherit" /> : <ShoppingBasket />}
              sx={{ py: 1.5 }}>
              {planning ? t('recipe.planning') : plan ? t('recipe.regenerate') : error ? t('recipe.retry') : t('recipe.generate')}
            </Button>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ textAlign: 'center', mt: 1.5 }}>
              {t('recipe.noAdd')}
            </Typography>
          </Paper>

          <Box aria-busy={planning || committing} sx={{ minWidth: 0 }}>
            {!plan && (
              <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.025) }}>
                <Box sx={{ width: 64, height: 64, bgcolor: 'background.paper', borderRadius: 3, display: 'grid', placeItems: 'center', mb: 3 }}>
                  <ShoppingBasket color="primary" sx={{ fontSize: 32 }} />
                </Box>
                <Box role="status" aria-live="polite">
                  <Typography component="h2" variant="h5" gutterBottom>{t(planning ? 'recipe.planning' : 'recipe.previewEmpty')}</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {t(planning ? 'recipe.progressDetail' : 'recipe.previewEmptyDesc')}
                  </Typography>
                </Box>
                {planning && <LinearProgress aria-label={t('recipe.planning')} sx={{ mt: 3, borderRadius: 1 }} />}
                <Divider sx={{ my: 3 }} />
                <Stack gap={2.5}>
                  {[
                    { icon: <MenuBook color="primary" />, title: 'recipe.ingredientAgent', description: 'recipe.ingredientAgentDesc' },
                    { icon: <ShoppingCartOutlined color="primary" />, title: 'recipe.catalogAgent', description: 'recipe.catalogAgentDesc' },
                  ].map((agent, index) => (
                    <Stack key={agent.title} direction="row" gap={2} alignItems="center">
                      {agent.icon}
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{index + 1}. {t(agent.title as 'recipe.ingredientAgent' | 'recipe.catalogAgent')}</Typography>
                        <Typography variant="body2" color="text.secondary">{t(agent.description as 'recipe.ingredientAgentDesc' | 'recipe.catalogAgentDesc')}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            )}
            {plan && (
              <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}>
                <Typography variant="overline" color="primary" fontWeight={700}>
                  {t(committed ? 'recipe.addedButton' : 'recipe.previewBadge')}
                </Typography>
                <Typography component="h2" variant="h5" ref={previewHeading} tabIndex={-1} sx={{ mt: 0.5, mb: 1 }}>
                  {t('recipe.preview')}
                </Typography>
                <Typography fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>{plan.recipe}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('recipe.for')} {plan.servings} {t('recipe.people')} · {t(`recipe.${plan.brandPreference}`)}
                </Typography>
                {committed && <Alert severity="success" sx={{ mt: 2 }} action={
                  <Button component={RouterLink} to="/cart" color="inherit" size="small">{t('recipe.viewCart')}</Button>
                }>{t('recipe.added')}</Alert>}
                {plan.missingIngredients.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <AlertTitle>{t('recipe.missing')}</AlertTitle>
                    {t('recipe.missingDesc')}
                    <Box component="ul" sx={{ pl: 2.5, mb: 0, overflowWrap: 'anywhere' }}>
                      {plan.missingIngredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
                    </Box>
                  </Alert>
                )}
                {plan.warnings.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <AlertTitle>{t('recipe.warnings')}</AlertTitle>
                    <Box component="ul" sx={{ pl: 2.5, my: 0, overflowWrap: 'anywhere' }}>
                      {plan.warnings.map((warning, index) => <li key={index}>{warning}</li>)}
                    </Box>
                  </Alert>
                )}
                <Typography variant="body2" fontWeight={600} sx={{ mt: 3 }}>
                  {t('recipe.selected')} ({selectedItems.length})
                </Typography>
                <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1 }}>
                  {t('recipe.selectedDesc')}
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                  {selectedItems.map((item, index) => (
                    <PlanItemRow key={`${itemKey(item)}-${index}`} item={item} selected disabled={selectionLocked}
                      hiddenScope={scopeOf(item.productId)} money={money}
                      onToggleSelection={() => toggleSelection(item)}
                      onHide={(scope) => hideProduct(item, scope)} onUnhide={() => unhide(item.productId)} />
                  ))}
                </Box>
                {planItems.length > 0 && selectedItems.length === 0 && (
                  <Alert severity="warning" sx={{ my: 2 }}>{t('recipe.noSelection')}</Alert>
                )}
                {deselectedItems.length > 0 && (
                  <CollapsibleSection id="recipe-deselected" title={t('recipe.deselected')}
                    count={deselectedItems.length} description={t('recipe.deselectedDesc')}
                    open={showDeselected} onToggle={() => setShowDeselected((open) => !open)}
                    sx={{ mt: 2 }}>
                    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                      {deselectedItems.map((item, index) => (
                        <PlanItemRow key={`${itemKey(item)}-${index}`} item={item} selected={false} disabled={selectionLocked}
                          hiddenScope={scopeOf(item.productId)} money={money}
                          onToggleSelection={() => toggleSelection(item)}
                          onHide={(scope) => hideProduct(item, scope)} onUnhide={() => unhide(item.productId)} />
                      ))}
                    </Box>
                  </CollapsibleSection>
                )}
                {hidden.length > 0 && (
                  <CollapsibleSection id="recipe-hidden" title={t('recipe.hidden')} count={hidden.length}
                    description={t('recipe.hiddenDesc')} open={showHidden}
                    onToggle={() => setShowHidden((open) => !open)}>
                    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                      {hidden.map((entry) => (
                        <Box component="li" key={entry.productId}
                          sx={{ py: 1.25, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="body2" fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
                            {entry.productName || `#${entry.productId}`}
                          </Typography>
                          <Chip size="small" variant="outlined" icon={<VisibilityOff />} sx={{ mt: 0.5 }}
                            label={t(entry.scope === 'session' ? 'recipe.hiddenSession' : 'recipe.hiddenForever')} />
                          <Button size="small" sx={{ display: 'block', mt: 0.5, ml: -1 }}
                            onClick={() => unhide(entry.productId)}
                            aria-label={`${t('recipe.unhide')} : ${entry.productName || `#${entry.productId}`}`}>
                            {t('recipe.unhide')}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
                      {t('recipe.hiddenRegenerate')}
                    </Typography>
                  </CollapsibleSection>
                )}
                {planItems.length === 0 ? <Alert severity="info" sx={{ my: 2 }}>{t('recipe.noProducts')}</Alert> : (
                  <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2 }}>{t('recipe.packHelp')}</Typography>
                )}
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline" gap={2}>
                    <Typography fontWeight={600}>{t('recipe.total')}</Typography>
                    <Typography variant="h5" color="primary" sx={{ whiteSpace: 'nowrap' }}>{money(selectedTotal)}</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">{t('recipe.totalHelp')}</Typography>
                </Box>
                {expired && !committed && !uncertainCommit && <Alert severity="warning" sx={{ mb: 2 }}>{t('recipe.expired')}</Alert>}
                {commitError && <Alert severity="error" sx={{ mb: 2 }}>
                  <AlertTitle>{commitError}</AlertTitle>
                  {t(commitRequiresRefresh || (expired && !uncertainCommit) ? 'recipe.commitRefreshHelp' : 'recipe.commitRetryHelp')}
                </Alert>}
                <Button fullWidth variant="contained" size="large" onClick={confirmPlan}
                  disabled={committing || committed || commitRequiresRefresh || (expired && !uncertainCommit) || !selectedItems.length}
                  startIcon={committing ? <CircularProgress size={18} color="inherit" /> : committed ? <CheckCircleOutline /> : <ShoppingBasket />}
                  sx={{ py: 1.5 }}>
                  {t(committing ? 'recipe.committing' : committed ? 'recipe.addedButton' : commitError && !commitRequiresRefresh && (!expired || uncertainCommit) ? 'recipe.commitRetry'
                    : plan.missingIngredients.length || deselectedItems.length ? 'recipe.confirmPartial' : 'recipe.confirm')}
                </Button>
                {committed && <Button component={RouterLink} to="/cart" fullWidth endIcon={<ArrowForward />} sx={{ mt: 1 }}>{t('recipe.viewCart')}</Button>}
                {!committed && !expired && <Typography variant="caption" color="text.secondary" component="p" sx={{ textAlign: 'center', mt: 1.5 }}>
                  {t('recipe.expires')} {new Date(plan.expiresAt).toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}
                </Typography>}
              </Paper>
            )}
            <Alert severity="info" variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>{t('recipe.disclaimer')}</Alert>
          </Box>
        </Box>
      )}
    </Box>
  );
}
