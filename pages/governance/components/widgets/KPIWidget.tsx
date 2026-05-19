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
        // background:
        //   theme.palette.mode === 'dark'
        //     ? 'linear-gradient(145deg, #1e293b, #0f172a)'
        //     : 'linear-gradient(145deg, #ffffff, #f8fafc)',
        // border: `1px solid ${theme.palette.divider}`,
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