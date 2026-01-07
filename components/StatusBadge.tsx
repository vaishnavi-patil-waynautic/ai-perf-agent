// import React from 'react';
// import { Chip } from '@mui/material';

// interface Props {
//   status: string;
// }

// export const StatusBadge: React.FC<Props> = ({ status }) => {
//   const isConfigured = status === 'configured';
//   return (
//     <Chip
//       label={isConfigured ? 'Configured' : 'Unconfigured'}
//       size="small"
//       sx={{
//         backgroundColor: isConfigured ? '#e8eeeaff' : '#f5f5f5',
//         color: isConfigured ? '#1976d2' : '#757575',
//         fontWeight: 600,
//         textTransform: 'uppercase',
//         fontSize: '0.7rem',
//       }}
//     />
//   );
// };

import React from 'react';
import { Chip } from '@mui/material';

interface Props {
  status: string;
}

const STATUS_STYLES: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  configured:      { label: 'Configured',      bg: '#d3f9d8', color: '#1b873f' },
  completed:       { label: 'Completed',       bg: '#d3f9d8', color: '#1b873f' },
  done:            { label: 'Done',            bg: '#d3f9d8', color: '#1b873f' },

  unconfigured:    { label: 'Unconfigured',    bg: '#fff4cc', color: '#d99400' },
  not_configured:  { label: 'Not Configured',  bg: '#fff4cc', color: '#d99400' },
  pending:         { label: 'Pending',         bg: '#fff4cc', color: '#d99400' },
  incomplete:      { label: 'Incomplete',      bg: '#fff4cc', color: '#d99400' },

  // ⭐ Should now work regardless of input variation
  in_process:      { label: 'In Process',      bg: '#fff4cc', color: '#d99400' },
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const key = status
    .toLowerCase()
    .trim()
    .replace(/[\s\-]+/g, '_'); 

  const style =
    STATUS_STYLES[key] ||
    ({
      label: status,
      bg: '#f0f0f0',
      color: '#7a7a7a',
    } as const);

  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: 600,
        textTransform: 'uppercase',
        fontSize: '0.7rem',
      }}
    />
  );
};

