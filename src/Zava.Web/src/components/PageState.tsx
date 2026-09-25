import { Alert, AlertTitle, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';

interface ErrorStateProps {
  /** Technical detail shown under the explanation, when useful. */
  detail?: string | null;
  title?: string;
  onRetry?: () => void;
}

/** A failure is never presented as an empty result: it explains, keeps data intact and offers a retry. */
export function ErrorState({ detail, title, onRetry }: ErrorStateProps) {
  const { t } = useLanguage();
  return (
    <Alert
      severity="error"
      role="alert"
      sx={{ my: 2 }}
      action={onRetry ? (
        <Button color="inherit" size="small" startIcon={<Refresh />} onClick={onRetry}>{t('common.retry')}</Button>
      ) : undefined}
    >
      <AlertTitle>{title ?? t('common.errorTitle')}</AlertTitle>
      {t('common.errorHint')}
      {detail && <Typography variant="caption" component="p" sx={{ mt: 0.5, opacity: 0.85 }}>{detail}</Typography>}
    </Alert>
  );
}

interface EmptyStateProps {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center', my: 2 }}>
      {icon && <Box sx={{ color: 'text.secondary', mb: 1, '& .MuiSvgIcon-root': { fontSize: 56 } }} aria-hidden>{icon}</Box>}
      <Typography variant="h6" component="p" gutterBottom>{title}</Typography>
      {description && <Typography color="text.secondary" sx={{ mb: action ? 2 : 0 }}>{description}</Typography>}
      {action}
    </Paper>
  );
}

export function LoadingState({ label }: { label?: string }) {
  const { t } = useLanguage();
  return (
    <Box role="status" aria-live="polite" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 8 }}>
      <CircularProgress aria-hidden />
      <Typography variant="body2" color="text.secondary">{label ?? t('common.loading')}</Typography>
    </Box>
  );
}
