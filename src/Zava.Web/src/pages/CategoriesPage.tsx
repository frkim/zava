import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Grid, Card, CardContent, CardActionArea, CircularProgress,
} from '@mui/material';
import { getCategories } from '../api';
import type { Category } from '../types';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Catégories</Typography>
      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid key={cat.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card>
              <CardActionArea onClick={() => navigate(`/search?categoryId=${cat.id}`)}>
                <Box sx={{ height: 120, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h2" sx={{ color: 'white', opacity: 0.3 }}>{cat.icon || cat.name.charAt(0)}</Typography>
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>{cat.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cat.productCount} produit{cat.productCount > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {cat.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
