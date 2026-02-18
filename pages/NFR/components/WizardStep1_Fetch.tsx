import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, MenuItem, Select, TextField, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Chip, TableContainer } from '@mui/material';
import { fetchJiraItems } from '../services/jiraService';
import { fetchADOItems } from '../services/adoService';
import { ExternalItem } from '../types/nfrTypes';
import { toggleItemId } from '../slices/nfrWizardSlice';
import { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '@/pages/settings/store/hooks';
import { fetchAdoItems } from '../slices/nfr.thunks';

const WizardStep1_Fetch: React.FC = () => {
  const dispatch = useAppDispatch();
const { externalItems, loadingItems } = useAppSelector(s => s.nfrWizard);
  const selectedItems = useSelector((state: RootState) => state.nfrWizard.selectedItemIds);
    const { selectedProject } = useSelector((state: RootState) => state.project);

  const [items, setItems] = useState<ExternalItem[]>([]);
  const [source, setSource] = useState<'ADO'>('ADO');
  const [filterType, setFilterType] = useState<string>('All');


  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
  dispatch(fetchAdoItems(selectedProject.id));
}, []);

  const handleFetch = async () => {
    // Determine which service to call based on dummy logic
    // In real app, you might mix both
   const data = await dispatch(fetchAdoItems(selectedProject.id)).unwrap();
setItems(data);

  };

  //   return (
  //     <div className="space-y-3">
  //       <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-200">
  //         <div className="flex flex-col gap-1 w-48">
  //           <label className="text-xs font-medium text-gray-600">Source</label>
  //           <Select className="text-sm bg-white" size="small" value={source} onChange={(e) => setSource(e.target.value as any)} >
  //             <MenuItem className="text-sm" value="Jira">Jira</MenuItem>
  //             <MenuItem className="text-sm" value="ADO">Azure DevOps</MenuItem>
  //           </Select>
  //         </div>

  //         <div className="flex flex-col gap-1 w-48">
  //            <label className="text-xs font-medium text-gray-600">Type</label>
  //            <Select size="small" value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-white">
  //              <MenuItem value="All">All Types</MenuItem>
  //              <MenuItem value="Story">Story</MenuItem>
  //              <MenuItem value="Task">Task</MenuItem>
  //              <MenuItem value="Epic">Epic</MenuItem>
  //            </Select>
  //         </div>

  //         <Button variant="contained" onClick={handleFetch} className="h-10 bg-blue-600 hover:bg-blue-700">
  //           Fetch Items
  //         </Button>
  //       </div>

  //       <div className="border rounded-md overflow-hidden">
  //         <Table size="small">
  //           <TableHead className="bg-gray-100">
  //             <TableRow>
  //               <TableCell padding="checkbox">Select</TableCell>
  //               <TableCell>ID</TableCell>
  //               <TableCell>Title</TableCell>
  //               <TableCell>Type</TableCell>
  //               <TableCell>Tags</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {items.length === 0 ? (
  //                 <TableRow><TableCell colSpan={5} align="center" className="py-8 text-gray-500">No items fetched yet.</TableCell></TableRow>
  //             ) : (
  //                 items.map((item) => {
  //                   const isSelected = selectedItems.some(i => i.id === item.id);
  //                   return (
  //                     <TableRow key={item.id} hover selected={isSelected}>
  //                       <TableCell padding="checkbox">
  //                         <Checkbox checked={isSelected} onChange={() => dispatch(toggleItemSelection(item))} />
  //                       </TableCell>
  //                       <TableCell>{item.id}</TableCell>
  //                       <TableCell>{item.title}</TableCell>
  //                       <TableCell><Chip label={item.type} size="small" color={item.type === 'Epic' ? 'secondary' : 'default'} /></TableCell>
  //                       <TableCell>{item.tags.join(', ')}</TableCell>
  //                     </TableRow>
  //                   );
  //                 })
  //             )}
  //           </TableBody>
  //         </Table>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="space-y-3 text-xs">   {/* GLOBAL small text */}

      {/* === FILTER BAR === */}
      <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-200 text-xs">

        <div className="flex flex-col gap-1 w-48">
          <label className="text-xs font-medium text-gray-600">Source</label>

          <Select
            size="small"
            value={source}
            onChange={(e) => setSource(e.target.value as any)}
            className="bg-white"
            sx={{
              fontSize: '0.75rem',
              '& .MuiMenuItem-root': { fontSize: '0.75rem' },
            }}
          >
            {/* <MenuItem value="Jira" sx={{ fontSize: '0.75rem' }}>Jira</MenuItem> */}
            <MenuItem value="ADO" sx={{ fontSize: '0.75rem' }}>Azure DevOps</MenuItem>
          </Select>
        </div>

        <div className="flex flex-col gap-1 w-48">
          <label className="text-xs font-medium text-gray-600">Type</label>

          <Select
            size="small"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white"
            sx={{
              fontSize: '0.75rem',
              '& .MuiMenuItem-root': { fontSize: '0.75rem' },
            }}
          >
            <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>All Types</MenuItem>
            <MenuItem value="Story" sx={{ fontSize: '0.75rem' }}>Story</MenuItem>
            <MenuItem value="Task" sx={{ fontSize: '0.75rem' }}>Task</MenuItem>
            <MenuItem value="Epic" sx={{ fontSize: '0.75rem' }}>Epic</MenuItem>
          </Select>
        </div>

        <Button
          variant="contained"
          onClick={handleFetch}
          className="h-9 bg-blue-600 hover:bg-blue-700"
          sx={{ fontSize: '0.70rem', padding: '4px 10px' }}
        >
          Fetch Items
        </Button>
      </div>

      {/* === TABLE === */}
      {/* <div className="border rounded-md overflow-hidden">
        <Table
          size="small"
          sx={{
            '& th, & td': {
              fontSize: '0.75rem',      // <-- shrink everything
              paddingTop: '4px',
              paddingBottom: '4px',
            },
          }}
        > */}

        <div
  className="border rounded-md overflow-hidden"
  style={{ height: 420 }}   // 👈 FIXED HEIGHT (adjust as needed)
>
  <TableContainer
    sx={{
      height: "100%",
      overflowY: "auto",
    }}
  >
    <Table
      stickyHeader   // 👈 makes header fixed
      size="small"
      sx={{
        '& th, & td': {
          fontSize: '0.75rem',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
      }}
    >

          <TableHead
            className="bg-gray-100"
            sx={{
              "& th": {
                color: "#4B5563",  // Tailwind gray-600
                fontWeight: 500,
              }
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">Select</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  className="py-8 text-gray-500"
                >
                  No items fetched yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isSelected = selectedItems.includes(item.id);

                return (
                  // <TableRow key={item.id} hover selected={isSelected}>
                  //   <TableCell padding="checkbox">
                  //     <Checkbox size="small" checked={isSelected} onChange={() => dispatch(toggleItemSelection(item))} />
                  //   </TableCell>

                  //   <TableCell>{item.id}</TableCell>
                  //   <TableCell>{item.title}</TableCell>

                  //   <TableCell>
                  //     <Chip
                  //       label={item.type}
                  //       size="small"
                  //       color={item.type === 'Epic' ? 'secondary' : 'default'}
                  //       sx={{ fontSize: '0.65rem', height: '20px' }}
                  //     />
                  //   </TableCell>

                  //   <TableCell>{item.tags.join(', ')}</TableCell>
                  // </TableRow>

                  <TableRow key={item.id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => dispatch(toggleItemId(item.id))}
                      />
                    </TableCell>

                    {/* JIRA ID (link) */}
                    <TableCell>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.id}
                      </a>
                    </TableCell>

                    {/* Title (link) */}
                    <TableCell>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.title}
                      </a>
                    </TableCell>

                    {/* Description (collapsible) */}
                    <TableCell sx={{ maxWidth: 280 }}>
                      <div className="text-gray-700">
                        <span
                          className={
                            expandedRows[item.id]
                              ? ""
                              : "line-clamp-1"   // Tailwind line clamp
                          }
                        >
                          {item.description || "—"}
                        </span>

                        {item.description?.length > 80 && (
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="ml-1 text-blue-500 text-xs hover:underline"
                          >
                            {expandedRows[item.id] ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Chip
                        label={item.type}
                        size="small"
                        color={item.type === "Epic" ? "secondary" : "default"}
                        sx={{ fontSize: "0.65rem", height: "20px" }}
                      />
                    </TableCell>

                    {/* Tags */}
                    <TableCell>{item.tags.join(", ")}</TableCell>
                  </TableRow>

                );
              })
            )}
          </TableBody>

        </Table>
        </TableContainer>
      </div>
    </div>
  );

};

export default WizardStep1_Fetch;