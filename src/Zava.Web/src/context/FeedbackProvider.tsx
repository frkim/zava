import { useCallback, useMemo, useState } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FeedbackContext, type FeedbackMessage } from './FeedbackContext';
import { useLanguage } from './LanguageContext';

/** One polite, announced toast at a time; errors stay until dismissed. */
export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState<(FeedbackMessage & { key: number }) | null>(null);

  const notify = useCallback((feedback: FeedbackMessage) => {
    setCurrent({ ...feedback, key: Date.now() });
  }, []);
  const close = () => setCurrent(null);
  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <Snackbar
        key={current?.key}
        open={current !== null}
        onClose={(_, reason) => { if (reason !== 'clickaway') close(); }}
        autoHideDuration={current?.severity === 'error' ? null : 5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {current ? (
          <Alert
            severity={current.severity}
            variant="filled"
            onClose={close}
            closeText={t('common.close')}
            role={current.severity === 'error' ? 'alert' : 'status'}
            action={current.actionTo ? (
              <Button color="inherit" size="small" component={RouterLink} to={current.actionTo} onClick={close}>
                {current.actionLabel}
              </Button>
            ) : undefined}
            sx={{ alignItems: 'center', '& .MuiAlert-action': { pt: 0 } }}
          >
            {current.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </FeedbackContext.Provider>
  );
}
