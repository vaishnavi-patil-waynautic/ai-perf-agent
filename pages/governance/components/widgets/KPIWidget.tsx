import { Typography, Box } from '@mui/material';
import { WidgetConfig } from '../../types/widget';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export const KPIWidget = ({ config, data }: { config: WidgetConfig; data?: { value: string; trend: number } }) => {
  const value = data?.value ?? '—';
  const trend = data?.trend ?? 0;
  const isPositive = trend >= 0;

  return (
    <Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: config.visuals?.color ?? 'primary.main', mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {config.title}
      </Typography>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5,
        color: isPositive ? '#4caf50' : '#ef5350',
        fontSize: 13, fontWeight: 600 }}>
        {isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
        {Math.abs(trend)}% vs last period
      </Box>
    </Box>
  );
};
