import { Box, useTheme } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';

export const BarChartWidget = ({ data = [] }: any) => {
  const theme = useTheme();

  // Modern color palette
  const COLORS = [
    '#3b82f6', // Blue
    '#22c55e', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#14b8a6', // Teal
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <Box
          sx={{
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(15, 23, 42, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            px: 1.5,
            py: 1,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[3],
          }}
        >
          <Box
            sx={{
              color: theme.palette.text.primary,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {item.build}
          </Box>
          <Box
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.7rem',
            }}
          >
            Compliance:{' '}
            <span
              style={{
                color: theme.palette.primary.main,
                fontWeight: 700,
              }}
            >
              {item.compliance}%
            </span>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: 220, width: '100%', px: 0.5 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical" // Horizontal bars
          margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
        >
          {/* Subtle Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke={theme.palette.divider}
            opacity={0.4}
          />

          {/* X-Axis (Values) */}
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{
              fontSize: 10,
              fill: theme.palette.text.secondary,
            }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y-Axis (Categories) */}
          <YAxis
            type="category"
            dataKey="build"
            width={90}
            tick={{
              fontSize: 10,
              fill: theme.palette.text.secondary,
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: theme.palette.action.hover }}
          />

          {/* Bars */}
          <Bar
            dataKey="compliance"
            radius={[0, 6, 6, 0]}
            barSize={10} // Narrow bars
            animationDuration={800}
          >
            {data.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};