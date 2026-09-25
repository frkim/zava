import { useEffect, useMemo, useState } from 'react';
import {
  Typography, Box, Paper, Grid, Chip, Button, Collapse,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { getAnalytics } from '../api';
import type { AnalyticsDashboard } from '../types';
import { useFormatters, useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import PageTitle from '../components/PageTitle';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';

const COLORS = [
  '#4f46e5', '#b45309', '#047857', '#0e7490', '#c2410c',
  '#6d28d9', '#be185d', '#0f766e', '#4d7c0f', '#be123c',
];

interface DataSectionProps {
  id: string;
  summary: string;
  children: React.ReactNode;
}

function DataSection({ id, summary, children }: DataSectionProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">{summary}</Typography>
      <Button size="small" sx={{ mt: 1, ml: -1 }} aria-expanded={open} aria-controls={`${id}-data`}
        onClick={() => setOpen((value) => !value)}>
        {t(open ? 'sec.analytics.hideData' : 'sec.analytics.viewData')}
      </Button>
      <Collapse in={open} unmountOnExit>
        <Box id={`${id}-data`} sx={{ mt: 1 }}>{children}</Box>
      </Collapse>
    </Box>
  );
}

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { price, date } = useFormatters();
  const { config } = useSite();
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getAnalytics()
      .then((dashboard) => {
        if (!active) return;
        setData(dashboard);
        setError(null);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : t('common.error'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [attempt, t]);

  const retryAnalytics = () => {
    setLoading(true);
    setError(null);
    setAttempt((value) => value + 1);
  };

  const statusLabels: Record<string, string> = useMemo(() => ({
    Pending: t('status.Pending'),
    Processing: t('status.Processing'),
    Shipped: t('status.Shipped'),
    Delivered: t('status.Delivered'),
    Cancelled: t('status.Cancelled'),
  }), [t]);
  const categoryData = useMemo(() => Object.entries(data?.revenueByCategory ?? {})
    .map(([name, revenue]) => ({ name, revenue })), [data]);
  const statusData = useMemo(() => Object.entries(data?.ordersByStatus ?? {})
    .map(([name, count]) => ({ name: statusLabels[name] ?? name, rawName: name, count })), [data, statusLabels]);
  const recentSales = data?.recentSales ?? [];
  const topProducts = data?.topProducts ?? [];
  const hasData = !!data && (data.totalOrders > 0 || categoryData.length > 0 || statusData.length > 0 || recentSales.length > 0 || topProducts.length > 0);

  if (loading) return <LoadingState />;

  return (
    <Box>
      <PageTitle subtitle={t('sec.analytics.subtitle')}>{t('analytics.title')}</PageTitle>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <Chip label={t('common.demoData')} color="info" variant="outlined" />
          <Chip label={`${t('sec.analytics.store')} : ${config?.currentSiteType ?? '—'}`} variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary">{t('sec.analytics.period')}</Typography>
      </Paper>

      {error && <ErrorState detail={error} onRetry={retryAnalytics} />}
      {!error && !data && <ErrorState onRetry={retryAnalytics} />}
      {!error && data && !hasData && (
        <EmptyState title={t('sec.analytics.empty')} description={t('sec.analytics.emptyDesc')} />
      )}

      {data && hasData && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: t('analytics.revenue'), value: price(data.totalRevenue), color: COLORS[0] },
              { label: t('analytics.orders'), value: data.totalOrders.toString(), color: COLORS[1] },
              { label: t('analytics.avgCart'), value: price(data.averageOrderValue), color: COLORS[2] },
              { label: t('analytics.products'), value: data.totalProducts.toString(), color: COLORS[3] },
              { label: t('analytics.customers'), value: data.totalCustomers.toString(), color: COLORS[5] },
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>{t('analytics.revenueByCategory')}</Typography>
                {categoryData.length === 0 ? <EmptyState title={t('sec.analytics.noChartData')} /> : (
                  <ReactECharts style={{ height: 300 }} option={{
                    color: COLORS,
                    tooltip: { trigger: 'axis', formatter: (params: Array<{ name: string; value: number }>) => `${params[0].name}: ${price(params[0].value)}` },
                    grid: { bottom: 80, left: 72, right: 24 },
                    xAxis: { type: 'category', data: categoryData.map((item) => item.name), axisLabel: { rotate: 45, fontSize: 10 } },
                    yAxis: { type: 'value' },
                    series: [{
                      type: 'bar',
                      data: categoryData.map((item, index) => ({ value: item.revenue, itemStyle: { color: COLORS[index % COLORS.length] } })),
                      label: { show: true, position: 'top', formatter: (params: { value: number }) => price(params.value) },
                    }],
                  }} />
                )}
                <DataSection id="analytics-category" summary={t('sec.analytics.categorySummary')}>
                  <TableContainer>
                    <Table size="small" aria-label={t('analytics.revenueByCategory')}>
                      <TableHead><TableRow><TableCell>{t('analytics.product')}</TableCell><TableCell align="right">{t('analytics.revenueCol')}</TableCell></TableRow></TableHead>
                      <TableBody>{categoryData.map((item) => (
                        <TableRow key={item.name}><TableCell>{item.name}</TableCell><TableCell align="right">{price(item.revenue)}</TableCell></TableRow>
                      ))}</TableBody>
                    </Table>
                  </TableContainer>
                </DataSection>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>{t('analytics.ordersByStatus')}</Typography>
                {statusData.length === 0 ? <EmptyState title={t('sec.analytics.noChartData')} /> : (
                  <ReactECharts style={{ height: 300 }} option={{
                    color: COLORS,
                    tooltip: { trigger: 'item', formatter: (params: { name: string; value: number }) => `${params.name}: ${params.value}` },
                    legend: { bottom: 0, formatter: (name: string) => {
                      const item = statusData.find((entry) => entry.name === name);
                      return item ? `${name} (${item.count})` : name;
                    } },
                    series: [{
                      type: 'pie', radius: '65%',
                      data: statusData.map((item) => ({ name: item.name, value: item.count })),
                      label: { show: true, formatter: '{b}: {c}' },
                    }],
                  }} />
                )}
                <DataSection id="analytics-status" summary={t('sec.analytics.statusSummary')}>
                  <TableContainer>
                    <Table size="small" aria-label={t('analytics.ordersByStatus')}>
                      <TableHead><TableRow><TableCell>{t('order.status')}</TableCell><TableCell align="right">{t('analytics.ordersLabel')}</TableCell></TableRow></TableHead>
                      <TableBody>{statusData.map((item) => (
                        <TableRow key={item.rawName}><TableCell>{item.name}</TableCell><TableCell align="right">{item.count}</TableCell></TableRow>
                      ))}</TableBody>
                    </Table>
                  </TableContainer>
                </DataSection>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>{t('analytics.recentSales')}</Typography>
                {recentSales.length === 0 ? <EmptyState title={t('sec.analytics.noChartData')} /> : (
                  <ReactECharts style={{ height: 300 }} option={{
                    color: [COLORS[0], COLORS[1]],
                    tooltip: { trigger: 'axis' },
                    legend: { data: [t('analytics.caLabel'), t('analytics.ordersLabel')] },
                    xAxis: { type: 'category', data: recentSales.map((item) => date(item.date)), axisLabel: { fontSize: 10 } },
                    yAxis: [
                      { type: 'value', name: t('analytics.caLabel') },
                      { type: 'value', name: t('analytics.ordersLabel') },
                    ],
                    series: [
                      { name: t('analytics.caLabel'), type: 'line', smooth: true, label: { show: true, formatter: (params: { value: number }) => price(params.value) }, data: recentSales.map((item) => item.revenue) },
                      { name: t('analytics.ordersLabel'), type: 'line', smooth: true, yAxisIndex: 1, label: { show: true }, data: recentSales.map((item) => item.orders) },
                    ],
                  }} />
                )}
                <DataSection id="analytics-sales" summary={t('sec.analytics.salesSummary')}>
                  <TableContainer>
                    <Table size="small" aria-label={t('analytics.recentSales')}>
                      <TableHead><TableRow><TableCell>{t('sec.analytics.date')}</TableCell><TableCell align="right">{t('analytics.revenueCol')}</TableCell><TableCell align="right">{t('analytics.ordersLabel')}</TableCell></TableRow></TableHead>
                      <TableBody>{recentSales.map((item) => (
                        <TableRow key={item.date}><TableCell>{date(item.date)}</TableCell><TableCell align="right">{price(item.revenue)}</TableCell><TableCell align="right">{item.orders}</TableCell></TableRow>
                      ))}</TableBody>
                    </Table>
                  </TableContainer>
                </DataSection>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Typography component="h2" variant="h6" sx={{ mb: 1 }}>{t('analytics.topProducts')}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{t('sec.analytics.topProductsSummary')}</Typography>
                {topProducts.length === 0 ? <EmptyState title={t('sec.analytics.noChartData')} /> : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>{t('analytics.product')}</TableCell>
                          <TableCell>{t('analytics.brand')}</TableCell>
                          <TableCell align="right">{t('analytics.qtySold')}</TableCell>
                          <TableCell align="right">{t('analytics.revenueCol')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topProducts.map((product, index) => (
                          <TableRow key={product.productId}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell align="right">{product.quantitySold}</TableCell>
                            <TableCell align="right">{price(product.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
