import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { RootState } from '../../../store/store'; 
import { deleteStrategy } from '../slices/nfrListSlice';

const NFRPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { strategies } = useSelector((state: RootState) => state.nfrList);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Completed': return 'success';
          case 'In Process': return 'warning';
          case 'Failed': return 'error';
          default: return 'default';
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center mb-10 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Performance Strategy Hub</h1>
        <Button 
            variant="contained" 
            size="large" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/nfr/wizard')}
            className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 py-3 text-lg shadow-lg"
        >
            Generate Performance Test Strategy
        </Button>
      </div>

      {/* Table Section */}
      <Paper elevation={2} className="overflow-hidden rounded-xl border border-gray-200">
          <div className="p-4 bg-gray-50 border-b font-semibold text-gray-700">
              Generated Performance Test Strategies
          </div>
          <TableContainer>
            <Table>
                <TableHead>
                    <TableRow className="bg-gray-100">
                        <TableCell className="font-bold">App Name</TableCell>
                        <TableCell className="font-bold">Created On</TableCell>
                        <TableCell className="font-bold">Status</TableCell>
                        <TableCell className="font-bold">Created By</TableCell>
                        <TableCell className="font-bold text-center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {strategies.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell>{row.appName}</TableCell>
                            <TableCell>{row.createdOn}</TableCell>
                            <TableCell>
                                <Chip label={row.status} color={getStatusColor(row.status) as any} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>{row.createdBy}</TableCell>
                            <TableCell align="center">
                                <div className="flex justify-center gap-2">
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => navigate(`/nfr/result/${row.id}`)}
                                        disabled={row.status !== 'Completed'}
                                    >
                                        View
                                    </Button>
                                    <IconButton color="primary" disabled={row.status !== 'Completed'}>
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => dispatch(deleteStrategy(row.id))}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {strategies.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center" className="py-10 text-gray-500">
                                No strategies generated yet. Click the button above to start.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </TableContainer>
      </Paper>
    </div>
  );
};

export default NFRPage;