import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface PageTitleProps {
  children: React.ReactNode;
  /** Plain-text title used for the browser tab; defaults to the heading when it is a string. */
  documentTitle?: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
}

/** The single h1 of a page. It also updates the document title and receives focus after navigation. */
export default function PageTitle({ children, documentTitle, subtitle, actions, sx }: PageTitleProps) {
  const title = documentTitle ?? (typeof children === 'string' ? children : undefined);

  useEffect(() => {
    if (title) document.title = `${title} · Zava`;
  }, [title]);

  return (
    <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3, ...sx }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" component="h1" tabIndex={-1} data-page-title sx={{ fontSize: { xs: '1.6rem', sm: '2.125rem' }, outline: 'none' }}>
          {children}
        </Typography>
        {subtitle && <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{actions}</Box>}
    </Box>
  );
}
