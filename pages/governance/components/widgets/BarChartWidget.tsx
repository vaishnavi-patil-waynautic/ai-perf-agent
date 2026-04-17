// import { Box } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// export const BarChartWidget = ({ data }: any) => {
//   return (
//     <Box sx={{ height: 250, width: '100%' }}>
//       <ResponsiveContainer>
//         <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
//           <XAxis dataKey="build" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
//           <YAxis hide />
//           <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
//           <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
//             {data.map((entry: any, index: number) => (
//               <Cell key={`cell-${index}`} fill={entry.compliance > 90 ? '#4caf50' : '#1976d2'} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// import { Box } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// export const BarChartWidget = ({ data }: any) => {
//   // Custom tooltip
//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <Box
//           sx={{
//             background: 'rgba(15, 23, 42, 0.95)',
//             backdropFilter: 'blur(12px)',
//             borderRadius: '12px',
//             padding: '12px 16px',
//             border: '1px solid rgba(255, 255, 255, 0.1)',
//             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
//           }}
//         >
//           <Box sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>
//             {payload[0].payload.build}
//           </Box>
//           <Box sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
//             Compliance: <span style={{ color: '#3b82f6', fontWeight: 700 }}>{payload[0].value}%</span>
//           </Box>
//         </Box>
//       );
//     }
//     return null;
//   };

//   return (
//     <Box sx={{ height: 240, width: '100%', px: 1 }}>
//       <ResponsiveContainer>
//         <BarChart 
//           data={data} 
//           margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
//         >
//           <defs>
//             <linearGradient id="barGradientHigh" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9}/>
//               <stop offset="100%" stopColor="#16a34a" stopOpacity={1}/>
//             </linearGradient>
//             <linearGradient id="barGradientNormal" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
//               <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
//             </linearGradient>
//           </defs>
          
//           <XAxis 
//             dataKey="build" 
//             tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
//             axisLine={false}
//             tickLine={false}
//             dy={10}
//           />
          
//           <YAxis 
//             tick={{ fontSize: 11, fill: '#64748b' }}
//             axisLine={false}
//             tickLine={false}
//             dx={-5}
//           />
          
//           <Tooltip 
//             content={<CustomTooltip />}
//             cursor={{ fill: 'rgba(148, 163, 184, 0.1)', radius: 8 }}
//           />
          
//           <Bar 
//             dataKey="compliance" 
//             radius={[8, 8, 0, 0]}
//             maxBarSize={60}
//           >
//             {data.map((entry: any, index: number) => (
//               <Cell 
//                 key={`cell-${index}`} 
//                 fill={entry.compliance > 90 ? 'url(#barGradientHigh)' : 'url(#barGradientNormal)'}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };


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