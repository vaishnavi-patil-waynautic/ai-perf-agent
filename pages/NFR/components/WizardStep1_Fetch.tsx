import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, MenuItem, Select, TextField, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Chip, TableContainer, CircularProgress } from '@mui/material';
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
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);


  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
  const [loading, setLoading] = React.useState<boolean>(false);

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    dispatch(fetchAdoItems(selectedProject.id));
  }, []);

  //   const handleFetch = async () => {
  //     // Determine which service to call based on dummy logic
  //     // In real app, you might mix both
  //    const data = await dispatch(fetchAdoItems(selectedProject.id)).unwrap();
  // setItems(data);

  //   };

  const handleFetch = async () => {
  setLoading(true);

  const response = await dispatch(fetchAdoItems(selectedProject.id)).unwrap();
  const allRecords = response;

  let result = [...allRecords];

  // 🔍 Apply search filter
  if (searchText.trim() !== '') {
    const search = searchText.toLowerCase();

    result = result.filter((item: any) =>
      item.tags &&
      item.tags.some((tag: string) =>
        tag.toLowerCase().includes(search)
      )
    );
  }

  // 🎯 Apply work item type filter
  if (filterType !== 'All') {

    console.log("filter Type : ", filterType, " result : ", result )
    result = result.filter((item: any) =>
  item.type?.toLowerCase() === filterType.toLowerCase()
);
  }

  setItems(allRecords);        // original data
  setFilteredData(result);     // filtered data

  setLoading(false);

  console.log("Final Result:", result);
};


  // const handleFetch = async () => {

  //   console.log(searchText, filterType);

  //   setLoading(true);

  //   const response = await dispatch(fetchAdoItems(selectedProject.id)).unwrap(); // your existing API call
  //   const allRecords = response;   // adjust based on your API structure
  //   setItems(response);


  //   console.log("Search Text : ", searchText, " response : ", response)

  //   if (searchText.trim() === '') {

  //     console.log("Empty search")
  //     setFilteredData(response);

  //   }
  //   else {
  //     const search = searchText.toLowerCase();

  //     const filtered = allRecords.filter((item: any) =>
  //       item.tags &&
  //       item.tags.some((tag: string) =>
  //         tag.toLowerCase().includes(search)
  //       )
  //     );

  //     setFilteredData(filtered);


  //     console.log("Filtered Data : ", filteredData);
  //   }

    
  //   console.log("2 Search Text : ", searchText, " response : ", filteredData)


  //   if (filterType == 'ALL') {
  //     setLoading(false);
  //     return;
  //   }


  //   const filtered = filteredData.filter((item: any) =>
  //     item.work_item_type &&
  //     item.work_item_type.toLowerCase().includes(filterType.toLowerCase())
  //   );

  //   setFilteredData(filtered);


  //   setLoading(false);

    
  //   console.log("Search Type : ", filterType, " response : ", filteredData)

  // };

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
      {/* <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-200 text-xs"> */}

      {/* <div className="flex flex-col gap-1 w-48">
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
            > */}
      {/* <MenuItem value="Jira" sx={{ fontSize: '0.75rem' }}>Jira</MenuItem> */}
      {/* <MenuItem value="ADO" sx={{ fontSize: '0.75rem' }}>Azure DevOps</MenuItem>
            </Select>
          </div> */}

      {/* <div className="flex flex-col gap-1 w-48">
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
          </div> */}

      {/* <div className="flex items-center gap-3 mb-3">
            <TextField
              size="small"
              label="Search by Tag"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              variant="outlined"
            />

            <Button
              variant="contained"
              onClick={handleFetch}
            >
              Fetch Items
            </Button>
          </div> */}

      {/* <Button
          variant="contained"
          onClick={handleFetch}
          className="h-9 bg-blue-600 hover:bg-blue-700"
          sx={{ fontSize: '0.70rem', padding: '4px 10px' }}
        >
          Fetch Items
        </Button> */}
      {/* </div> */}

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


      {/* <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-200 text-xs">

  <div className="flex flex-col gap-1 w-48">
    <label className="text-xs font-medium text-gray-600">Source</label>
    <Select
      size="small"
      value={source}
      onChange={(e) => setSource(e.target.value as any)}
      className="bg-white h-9"
      fullWidth
      sx={{
      height: 32,
      fontSize: "11px",
      "& .MuiSelect-select": {
        fontSize: "11px",
        padding: "6px 10px",
      },
    }}
    >
      <MenuItem value="ADO">Azure DevOps</MenuItem>
    </Select>
  </div>

  <div className="flex flex-col gap-1 w-48">
    <label className="text-xs font-medium text-gray-600">Type</label>
    <Select
      size="small"
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
      className="bg-white h-9 text-sm"
      fullWidth
       sx={{
      height: 32,
      fontSize: "11px",
      "& .MuiSelect-select": {
        fontSize: "11px",
        padding: "6px 10px",
      },
    }}
    >
      <MenuItem value="All">All Types</MenuItem>
      <MenuItem value="Story">Story</MenuItem>
      <MenuItem value="Task">Task</MenuItem>
      <MenuItem value="Epic">Epic</MenuItem>
    </Select>
  </div>

  <div className="flex flex-col gap-1 w-56">
    <label className="text-xs font-medium text-gray-600">Search Tag</label>
    <TextField
      size="small"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      variant="outlined"
      fullWidth
      sx={{
        'backgroundColor': "white",
        '& .MuiInputBase-root': { height: 36 },
        '& input': { fontSize: '1rem', padding: '6px 8px' },
      }}
    />
  </div>

  <div className="flex flex-col gap-1 w-48">
    <label className="opacity-0 text-xs">.</label>

<Button
  variant="contained"
  onClick={handleFetch}
  disabled={loading}   // prevent multiple clicks
  className="h-9 whitespace-nowrap flex gap-2"
  sx={{ fontSize: '0.75rem', padding: '6px 4px' }}
>
  {loading ? (
    <>
      <CircularProgress size={16} color="inherit" />
      Searching...
    </>
  ) : (
    'Fetch Items'
  )}
</Button>
  </div>

</div> */}


      <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-200">

        {/* Source */}
        <div className="flex flex-col gap-1 w-48">
          <label className="text-[11px] font-medium text-gray-600">Source</label>
          <Select
            size="small"
            value={source}
            onChange={(e) => setSource(e.target.value as any)}
            fullWidth
            sx={{
              height: 34,
              fontSize: "11px",
              backgroundColor: "white",
              "& .MuiSelect-select": {
                fontSize: "11px",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <MenuItem value="ADO" sx={{ fontSize: "11px" }}>
              Azure DevOps
            </MenuItem>
          </Select>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1 w-48">
          <label className="text-[11px] font-medium text-gray-600">Type</label>
          <Select
            size="small"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            fullWidth
            sx={{
              height: 34,
              fontSize: "11px",
              backgroundColor: "white",
              "& .MuiSelect-select": {
                fontSize: "11px",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <MenuItem value="All" sx={{ fontSize: "11px" }}>All</MenuItem>
            <MenuItem value="Issue" sx={{ fontSize: "11px" }}>Issue</MenuItem>
            <MenuItem value="Task" sx={{ fontSize: "11px" }}>Task</MenuItem>
            <MenuItem value="Epic" sx={{ fontSize: "11px" }}>Epic</MenuItem>
            <MenuItem value="Test Case" sx={{ fontSize: "11px" }}>Test Case</MenuItem>
          </Select>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-1 w-56">
          <label className="text-[11px] font-medium text-gray-600">Search Tag</label>
          <TextField
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: "white",
              "& .MuiInputBase-root": {
                height: 34,
                fontSize: "11px",
              },
              "& input": {
                fontSize: "11px",
                padding: "6px 10px",
              },
            }}
          />
        </div>

        {/* Button */}
        <div className="flex flex-col gap-1 w-48">
          <label className="opacity-0 text-[11px]">.</label>

          <Button
            variant="contained"
            onClick={handleFetch}
            disabled={loading}
            className="whitespace-nowrap flex gap-2"
            sx={{
              height: 34,
              fontSize: "11px",
              padding: "0 10px",
              minWidth: "100%",
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={14} color="inherit" />
                Searching...
              </>
            ) : (
              "Fetch Items"
            )}
          </Button>
        </div>

      </div>

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
              {filteredData.length === 0 ? (
                <TableRow className="py-10">
                  <TableCell
                    colSpan={6}
                    align="center"
                    className="py-10 text-gray-500"
                  >
                    No data fetched.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => {
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