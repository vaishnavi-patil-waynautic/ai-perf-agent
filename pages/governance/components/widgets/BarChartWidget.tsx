import { Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BarChartWidget = ({ data }: any) => {
  return (
    <Box sx={{ height: 250, width: '100%' }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="build" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.compliance > 90 ? '#4caf50' : '#1976d2'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};