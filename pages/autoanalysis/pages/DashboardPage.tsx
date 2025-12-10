import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Typography, Box, Toolbar
} from '@mui/material';
import { Add, Settings, Delete, Visibility } from '@mui/icons-material';
import { fetchApps, removeApp } from '../store/autoAnalysisSlice';
import { StatusBadge } from '../components/StatusBadge';
import { AddApplicationModal } from '../components/AddApplicationModal';
import { SettingsModal } from '../components/SettingsModal';
import PrimaryButton from '../components/PrimaryButton';
import { EditIcon, Trash2, TrashIcon } from 'lucide-react';
import AddIcon from '@mui/icons-material/Add';

export const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  // @ts-ignore
  const { applications, loading } = useSelector((state) => state.autoAnalysis);

  const [openAdd, setOpenAdd] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    dispatch(fetchApps());
  }, [dispatch]);

  return (
    <Box >

      <div className="m-auto max-w-6xl p-10 ">
        {/* <Toolbar className="flex justify-between mb-6 px-4 py-2"> */}


        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Auto Analysis Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Configure and run your tests</p>
          </div>

          <Box className="flex items-center gap-2 ">
            {/* <IconButton onClick={() => setOpenSettings(true)} color="primary">
              <Settings />
            </IconButton> */}

            <Button
              variant="contained"
              size="medium"
              startIcon={<AddIcon />}
              className="mt-1 rounded min-w-fit"
              disableElevation
              onClick={() => setOpenAdd(true)}
            >
              Add Application
            </Button>
          </Box>
        </div>

        {/* </Toolbar> */}

        {/* <TableContainer component={Paper} elevation={0} className="border border-slate-200">
          <Table>
            <TableHead className="bg-slate-100">
              <TableRow>
                <TableCell className="font-bold text-slate-600">Application Name</TableCell>
                <TableCell className="font-bold text-slate-600">Status</TableCell>
                <TableCell className="font-bold text-slate-600">Recent Report</TableCell>
                <TableCell className="font-bold text-slate-600" align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center">Loading...</TableCell></TableRow>
              ) : applications.map((app: any) => (
                <TableRow key={app.id} hover>
                  <TableCell className="font-medium text-slate-700">{app.name}</TableCell>
                  <TableCell><StatusBadge status={app.status} /></TableCell>
                  {/* <TableCell>{app.lastReportName || '-'}</TableCell> 

                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => navigate(`/reports/${app.lastReportId}`)}
                      sx={{
                        textTransform: "none",
                        padding: 0,
                        minWidth: "unset",
                        fontSize: "0.875rem",
                        color: "primary.main",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                        '&:hover': {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {app.lastReportName || '-'}
                    </Button>
                  </TableCell>



                  <TableCell align="right">

                    <div className="flex justify-end items-center">

                      <PrimaryButton
                        size="small"
                        onClick={() => navigate(`/autoanalysis/${app.id}`)}
                      >
                        View
                      </PrimaryButton>
                      <button
                        onClick={() => dispatch(removeApp(app.id))}
                        className="text-red-600 hover:text-red-800 p-3 pr-4 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}


        {/* <div className="grid gap-4 justify-items-center">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : applications.map((app: any) => (
            <Paper
              key={app.id}
              elevation={1}
              className="w-8/12 p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start sm:justify-between"
            >
              {/* Left: Title + Status + Build 
              <div className="flex flex-col sm:flex-1">
                <div className="flex items-center space-x-3">
                  <div className="font-medium text-slate-700 text-lg">{app.name}</div>
                  <StatusBadge status={app.status} />
                </div>

                {/* Build / Recent Report below 
                <div className="mt-1">
                  <Button
                    variant="text"
                    onClick={() => navigate(`/reports/${app.lastReportId}`)}
                    sx={{
                      textTransform: "none",
                      padding: 0,
                      minWidth: "unset",
                      fontSize: "0.875rem",
                      color: "primary.main",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {app.lastReportName || "-"}
                  </Button>
                </div>
              </div>

              {/* Right: Action Buttons 
              <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                <PrimaryButton
                  size="small"
                  onClick={() => navigate(`/autoanalysis/${app.id}`)}
                >
                  View
                </PrimaryButton>
                <button
                  onClick={() => dispatch(removeApp(app.id))}
                  className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Paper>
          ))}
        </div> */}



        <div className="space-y-4 w-full mx-auto">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {/* Left section: title and description */}
              <div>

                <div className="flex items-center space-x-3 mb-1">
                  <div className="text-base font-semibold text-gray-900">{app.name}</div>
                  <StatusBadge status={app.status} />
                </div>

                {/* <div 
                onClick={() => navigate(`/reports/${app.lastReportId}`)}
                sx={{
                      textTransform: "none",
                      padding: 0,
                      minWidth: "unset",
                      fontSize: "0.875rem",
                      color: "primary.main",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }} 
                    className="text-sm text-gray-500">{app.lastReportName || "-"}</div>
                <div className="text-xs text-gray-400 mt-0.5">{app.info}</div> */}

                
<div className="mt-2 flex items-center space-x-2">
  <div className="text-xs text-gray-500">
    Recent Build:
  </div>
  <a
    href={`/reports/${app.lastReportId}`}
    onClick={e => {
      e.preventDefault();
      navigate(`/reports/${app.lastReportId}`);
    }}
    className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-semibold"
  >
    {app.lastReportName || "-"}
  </a>
</div>




              </div>

              {/* Right section: icons and button */}
              <div className="flex items-center space-x-3">
                {/* Edit icon */}
                <button
                  onClick={() => navigate(`/autoanalysis/${app.id}`)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Edit"
                >
                  <EditIcon className="w-5 h-5" />
                </button>

                {/* Delete icon */}
                <button
                  onClick={() => navigate(`/autoanalysis/${app.id}`)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>

                {/* View Collection button */}
                <button
                  onClick={() => navigate(`/autoanalysis/${app.id}`)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>




        <AddApplicationModal open={openAdd} onClose={() => setOpenAdd(false)} />
        <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
      </div>

    </Box>
  );
};