import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Tooltip, Typography, Box 
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
    <TableContainer sx={{ maxHeight: 300 }}>
      <Table stickyHeader size="small">
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                    {row.name}
                  </Typography>
                  {row.status === 'success' ? (
                    <CheckCircleOutline sx={{ color: '#4caf50', fontSize: 18 }} />
                  ) : (
                    <ErrorOutline sx={{ color: '#ef5350', fontSize: 18 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                  {row.status === 'success' && (
                    <Tooltip title="Download">
                      <IconButton size="small" color="primary">
                        <FileDownloadOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton size="small" sx={{ color: '#94a3b8' }}>
                      <DeleteOutline fontSize="small" />
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