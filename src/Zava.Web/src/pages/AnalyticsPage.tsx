import { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Grid, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { getAnalytics } from '../api';
import type { AnalyticsDashboard } from '../types';

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#06b6d4', '#f97316',
  '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16', '#f43f5e',
];

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
          { label: 'Chiffre d\'affaires', value: `${data.totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, color: '#6366f1' },
          { label: 'Commandes', value: data.totalOrders.toString(), color: '#f59e0b' },
          { label: 'Panier moyen', value: `${data.averageOrderValue.toFixed(2)} €`, color: '#10b981' },
          { label: 'Produits', value: data.totalProducts.toString(), color: '#06b6d4' },
          { label: 'Clients', value: data.totalCustomers.toString(), color: '#8b5cf6' },
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
            <ReactECharts style={{ height: 300 }} option={{
              color: COLORS,
              tooltip: { trigger: 'axis', formatter: (params: { name: string; value: number }[]) => `${params[0].name}: ${params[0].value.toFixed(2)} €` },
              grid: { bottom: 80 },
              xAxis: { type: 'category', data: categoryData.map(d => d.name), axisLabel: { rotate: 45, fontSize: 10 } },
              yAxis: { type: 'value' },
              series: [{
                type: 'bar',
                data: categoryData.map((d, i) => ({ value: d.revenue, itemStyle: { color: COLORS[i % COLORS.length] } })),
                animationDelay: (idx: number) => idx * 50,
              }],
            }} />
          </Paper>
        </Grid>

        {/* Orders by Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Commandes par statut</Typography>
            <ReactECharts style={{ height: 300 }} option={{
              color: COLORS,
              tooltip: { trigger: 'item' },
              legend: { bottom: 0 },
              series: [{
                type: 'pie',
                radius: '65%',
                data: statusData.map(d => ({ name: d.name, value: d.count })),
                label: { show: true },
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' } },
              }],
            }} />
          </Paper>
        </Grid>

        {/* Daily Sales */}
        {data.recentSales.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Ventes récentes (30 derniers jours)</Typography>
              <ReactECharts style={{ height: 300 }} option={{
                color: ['#6366f1', '#f59e0b'],
                tooltip: { trigger: 'axis' },
                legend: { data: ['CA (€)', 'Commandes'] },
                xAxis: { type: 'category', data: data.recentSales.map(d => d.date), axisLabel: { fontSize: 10 } },
                yAxis: [
                  { type: 'value', name: 'CA (€)' },
                  { type: 'value', name: 'Commandes' },
                ],
                series: [
                  { name: 'CA (€)', type: 'line', smooth: true, data: data.recentSales.map(d => d.revenue) },
                  { name: 'Commandes', type: 'line', smooth: true, yAxisIndex: 1, data: data.recentSales.map(d => d.orders) },
                ],
              }} />
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
