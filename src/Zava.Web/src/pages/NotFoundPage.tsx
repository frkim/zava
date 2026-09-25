import { Button } from '@mui/material';
import { Home, Search } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { EmptyState } from '../components/PageState';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageTitle>{t('notFound.title')}</PageTitle>
      <EmptyState
        title="404"
        description={t('notFound.desc')}
        action={(
          <>
            <Button variant="contained" component={RouterLink} to="/" startIcon={<Home />} sx={{ m: 0.5 }}>{t('notFound.home')}</Button>
            <Button variant="outlined" component={RouterLink} to="/search" startIcon={<Search />} sx={{ m: 0.5 }}>{t('notFound.catalog')}</Button>
          </>
        )}
      />
    </>
  );
}
