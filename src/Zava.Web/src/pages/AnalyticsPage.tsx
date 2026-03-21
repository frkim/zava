import { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Grid, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { getAnalytics } from '../api';
import type { AnalyticsDashboard } from '../types';

const COLORS = ['#1a237e', '#534bae', '#ff6f00', '#ffa040', '#4caf50', '#2196f3', '#9c27b0', '#f44336', '#607d8b', '#795548'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!data) return <Alert severity="error">Erreur de chargement</Alert>;

  const categoryData = Object.entries(data.revenueByCategory).map(([name, revenue]) => ({ name, revenue }));
  const statusData = Object.entries(data.ordersByStatus).map(([name, count]) => ({ name, count }));

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>📊 Analytics — Back-office</Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Chiffre d\'affaires', value: `${data.totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, color: '#1a237e' },
          { label: 'Commandes', value: data.totalOrders.toString(), color: '#ff6f00' },
          { label: 'Panier moyen', value: `${data.averageOrderValue.toFixed(2)} €`, color: '#4caf50' },
          { label: 'Produits', value: data.totalProducts.toString(), color: '#2196f3' },
          { label: 'Clients', value: data.totalCustomers.toString(), color: '#9c27b0' },
        ].map((kpi) => (
          <Grid key={kpi.label} size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Paper sx={{ p: 2, borderTop: `4px solid ${kpi.color}` }}>
              <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
              <Typography variant="h5" fontWeight={700}>{kpi.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue by Category */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>CA par catégorie</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(v) => `${Number(v).toFixed(2)} €`} />
                <Bar dataKey="revenue" fill="#1a237e">
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Orders by Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Commandes par statut</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Daily Sales */}
        {data.recentSales.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Ventes récentes (30 derniers jours)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.recentSales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#1a237e" name="CA (€)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#ff6f00" name="Commandes" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* Top Products */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Top 10 produits</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Produit</TableCell>
                    <TableCell>Marque</TableCell>
                    <TableCell align="right">Qté vendue</TableCell>
                    <TableCell align="right">CA</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topProducts.map((p, i) => (
                    <TableRow key={p.productId}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.brand}</TableCell>
                      <TableCell align="right">{p.quantitySold}</TableCell>
                      <TableCell align="right">{p.revenue.toFixed(2)} €</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
