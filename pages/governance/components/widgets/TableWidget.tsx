// import { 
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
//   IconButton, Tooltip, Typography, Box 
// } from '@mui/material';
// import { 
//   CheckCircleOutline, ErrorOutline, 
//   FileDownloadOutlined, DeleteOutline 
// } from '@mui/icons-material';

// interface TableData {
//   id: string;
//   name: string;
//   status: 'success' | 'failed';
//   timestamp: string;
//   size?: string;
// }

// const TableWidget = ({ data }: { data: TableData[] }) => {
//   return (
//     <TableContainer sx={{ maxHeight: 300 }}>
//       <Table stickyHeader size="small">
//         <TableBody>
//           {data.map((row) => (
//             <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//               <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                   <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
//                     {row.name}
//                   </Typography>
//                   {row.status === 'success' ? (
//                     <CheckCircleOutline sx={{ color: '#4caf50', fontSize: 18 }} />
//                   ) : (
//                     <ErrorOutline sx={{ color: '#ef5350', fontSize: 18 }} />
//                   )}
//                 </Box>
//               </TableCell>
//               <TableCell align="right">
//                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
//                   {row.status === 'success' && (
//                     <Tooltip title="Download">
//                       <IconButton size="small" color="primary">
//                         <FileDownloadOutlined fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   )}
//                   <Tooltip title="Delete">
//                     <IconButton size="small" sx={{ color: '#94a3b8' }}>
//                       <DeleteOutline fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                 </Box>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default TableWidget;


import { 
  Table, TableBody, TableCell, TableContainer, TableRow, 
  IconButton, Tooltip, Typography, Box, Chip 
} from '@mui/material';
import { 
  CheckCircleOutline, ErrorOutline, 
  FileDownloadOutlined, DeleteOutline 
} from '@mui/icons-material';

interface TableData {
  id: string;
  name: string;
  status: 'success' | 'failed';
  timestamp: string;
  size?: string;
}

const TableWidget = ({ data }: { data: TableData[] }) => {
  return (
    <TableContainer sx={{ maxHeight: 320 }}>
      <Table size="small">
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={row.id} 
              sx={{ 
                borderBottom: index === data.length - 1 ? 'none' : '1px solid rgba(226, 232, 240, 0.8)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.04)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <TableCell 
                component="th" 
                scope="row" 
                sx={{ 
                  py: 2,
                  px: 2,
                  border: 'none'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: row.status === 'success' 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : 'rgba(239, 68, 68, 0.1)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {row.status === 'success' ? (
                      <CheckCircleOutline sx={{ color: '#22c55e', fontSize: 18 }} />
                    ) : (
                      <ErrorOutline sx={{ color: '#ef4444', fontSize: 18 }} />
                    )}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#0f172a', 
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        mb: 0.25
                      }}
                    >
                      {row.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: '0.75rem'
                      }}
                    >
                      {row.timestamp}
                    </Typography>
                  </Box>

                  <Chip
                    label={row.status === 'success' ? 'Success' : 'Failed'}
                    size="small"
                    sx={{
                      backgroundColor: row.status === 'success' 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : 'rgba(239, 68, 68, 0.1)',
                      color: row.status === 'success' ? '#22c55e' : '#ef4444',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: '24px',
                      borderRadius: '6px',
                      border: 'none',
                    }}
                  />
                </Box>
              </TableCell>

              <TableCell align="right" sx={{ border: 'none', py: 2, px: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                  {row.status === 'success' && (
                    <Tooltip title="Download" arrow>
                      <IconButton 
                        size="small" 
                        sx={{
                          color: '#3b82f6',
                          backgroundColor: 'rgba(59, 130, 246, 0.08)',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            transform: 'scale(1.05)',
                          }
                        }}
                      >
                        <FileDownloadOutlined sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete" arrow>
                    <IconButton 
                      size="small" 
                      sx={{
                        color: '#64748b',
                        backgroundColor: 'rgba(148, 163, 184, 0.08)',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      <DeleteOutline sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableWidget;