import { Box, Typography } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const LineChartWidget = ({
  data,
  yLabel = 'Value',
}: any) => {
  const chartData = data ?? [];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Box sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>
            {payload[0].payload.name}
          </Box>
          <Box sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
            {yLabel}: <span style={{ color: '#3b82f6', fontWeight: 700 }}>{payload[0].value}</span>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: 260, width: '100%', px: 1 }}>
      <ResponsiveContainer>
        <AreaChart 
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorBlueModern" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#e2e8f0"
            strokeOpacity={0.5}
          />
          
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            dx={-5}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="linear"
            dataKey="value"
            stroke="#3b82f6"
            fill="url(#colorBlueModern)"
            strokeWidth={3}
            dot={{ 
              r: 4, 
              fill: '#3b82f6',
              stroke: '#fff',
              strokeWidth: 2
            }}
            activeDot={{ 
              r: 6, 
              fill: '#3b82f6',
              stroke: '#fff',
              strokeWidth: 3
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};