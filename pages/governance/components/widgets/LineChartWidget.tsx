import { Box } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const LineChartWidget = ({ data }: { data?: { name: string; value: number }[] }) => {
  const chartData = data ?? [];
  return (
  <Box sx={{ height: 250, width: '100%' }}>
    <ResponsiveContainer>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#1976d2" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorBlue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </Box>
  );
};