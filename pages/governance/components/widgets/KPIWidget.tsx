// import { Typography, Box } from '@mui/material';
// import { WidgetConfig } from '../../types/widget';
// import { TrendingUp, TrendingDown } from '@mui/icons-material';

// export const KPIWidget = ({ config, data }: { config: WidgetConfig; data?: { value: string; trend: number } }) => {
//   const value = data?.value ?? '—';
//   const trend = data?.trend ?? 0;
//   const isPositive = trend >= 0;

//   return (
//     // <Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
//     <Box
//   sx={{
//     textAlign: 'center',
//     py: 3,
//     px: 2,
//     border: '1px solid #e0e0e0',
//     borderRadius: 3,
//     backgroundColor: '#fff',
//     boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
//     transition: '0.3s',
//     '&:hover': {
//       transform: 'translateY(-4px)',
//       boxShadow: '0 6px 14px rgba(0,0,0,0.1)',
//     },
//   }}
// >
//       <Typography variant="h3" sx={{ fontWeight: 700, color: config.visuals?.color ?? 'primary.main', mb: 0.5 }}>
//         {value}
//       </Typography>
//       <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//         {config.title}
//       </Typography>
//       <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5,
//         color: isPositive ? '#4caf50' : '#ef5350',
//         fontSize: 13, fontWeight: 600 }}>
//         {isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
//         {Math.abs(trend)}% vs last period
//       </Box>
//     </Box>
//   );
// };


// import { Typography, Box } from '@mui/material';
// import { WidgetConfig } from '../../types/widget';
// import { TrendingUp, TrendingDown } from '@mui/icons-material';

// export const KPIWidget = ({ config, data }: { config: WidgetConfig; data?: { value: string; trend: number } }) => {
//   const value = data?.value ?? '—';
//   const trend = data?.trend ?? 0;
//   const isPositive = trend >= 0;

//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         height: '100%',
//         // background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//         backdropFilter: 'blur(10px)',
//         borderRadius: '16px',
//         border: '1px solid rgba(255,255,255,0.3)',
//         boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
//         overflow: 'hidden',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
//           '&::before': {
//             opacity: 1,
//           }
//         },
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           height: '4px',
//           // background: `linear-gradient(90deg, ${config.visuals?.color ?? '#2563eb'}, ${config.visuals?.color ?? '#3b82f6'})`,
//           opacity: 0.7,
//           transition: 'opacity 0.3s ease',
//         }
//       }}
//     >
//       <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '60%' }}>
//         {/* Label */}
//         <Typography 
//           variant="caption" 
//           sx={{ 
//             color: '#64748b',
//             fontWeight: 600,
//             textTransform: 'uppercase',
//             letterSpacing: '0.5px',
//             fontSize: '0.7rem',
//             mb: 2
//           }}
//         >
//           {config.title}
//         </Typography>

//         {/* Value */}
//         <Typography 
//           variant="h3" 
//           sx={{ 
//             fontWeight: 500,
//             background : "black",
//             // background: `linear-gradient(135deg, ${config.visuals?.color ?? '#2563eb'} 0%, black

//             // 100%)`,
//                         // ${config.visuals?.color ?? '#3b82f6'} 
//             backgroundClip: 'text',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             mb: 'auto',
//             lineHeight: 1.2
//           }}
//         >
//           {value}
//         </Typography>

//         {/* Trend */}
//         <Box 
//           sx={{ 
//             display: 'inline-flex', 
//             alignItems: 'center', 
//             gap: 0.5,
//             px: 1.5,
//             py: 0.75,
//             borderRadius: '8px',
//             backgroundColor: isPositive 
//               ? 'rgba(34, 197, 94, 0.1)' 
//               : 'rgba(239, 68, 68, 0.1)',
//             alignSelf: 'flex-start',
//             transition: 'all 0.2s ease',
//           }}
//         >
//           {isPositive ? (
//             <TrendingUp sx={{ fontSize: 16, color: '#22c55e' }} />
//           ) : (
//             <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
//           )}
//           <Typography
//             sx={{
//               color: isPositive ? '#22c55e' : '#ef4444',
//               fontSize: '0.75rem',
//               fontWeight: 700,
//             }}
//           >
//             {Math.abs(trend)}%
//           </Typography>
//           <Typography
//             sx={{
//               color: isPositive ? '#22c55e' : '#ef4444',
//               fontSize: '0.65rem',
//               fontWeight: 500,
//               opacity: 0.8,
//             }}
//           >
//             vs last period
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };


import { Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { WidgetConfig } from '../../types/widget';

export const KPIWidget = ({
  config,
  data,
}: {
  config: WidgetConfig;
  data?: { value: string; trend: number };
}) => {
  const value = data?.value ?? '—';
  const trend = data?.trend ?? 0;
  const isPositive = trend >= 0;
  const accent = config.visuals?.color || '#4F46E5';

  return (
    <Box
      sx={(theme) => ({
        height: '100%',
        minHeight: 95,
        px: 2,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #1e293b, #0f172a)'
            : 'linear-gradient(145deg, #ffffff, #f8fafc)',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 4px 14px rgba(0,0,0,0.4)'
            : '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.25s ease-in-out',

        '&:hover': {
          transform: 'translateY(-3px) scale(1.01)',
          boxShadow: `0 10px 24px ${accent}22`,
        },

        // Subtle accent glow
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: '20px',
          background: `radial-gradient(circle at top right, ${accent}15, transparent 60%)`,
          pointerEvents: 'none',
        },
      })}
    >
      {/* Title */}
      <Typography
        variant="caption"
        sx={{
          pb:1,
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          color: 'text.secondary',
        }}
      >
        {config.title}
      </Typography>

      {/* KPI Value */}
      <Typography
        sx={{
          pb:1,
          fontSize: '1.6rem',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          lineHeight: 1.1,
          background: `linear-gradient(135deg, ${accent}, ${
            accent + '99'
          })`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {value}
      </Typography>

      {/* Trend Indicator */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.4,
          px: 0.8,
          py: 0.2,
          borderRadius: '999px',
          width: 'fit-content',
          backgroundColor: isPositive
            ? 'rgba(34, 197, 94, 0.12)'
            : 'rgba(239, 68, 68, 0.12)',
        }}
      >
        {isPositive ? (
          <TrendingUp sx={{ fontSize: 12, color: '#22c55e' }} />
        ) : (
          <TrendingDown sx={{ fontSize: 12, color: '#ef4444' }} />
        )}

        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 600,
            color: isPositive ? '#16a34a' : '#dc2626',
          }}
        >
          {Math.abs(trend)}%
        </Typography>
      </Box>
    </Box>
  );
};