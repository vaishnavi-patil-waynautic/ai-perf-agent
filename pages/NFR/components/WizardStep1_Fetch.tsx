import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, MenuItem, Select, TextField, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Chip, TableContainer, CircularProgress } from '@mui/material';
import { fetchJiraItems } from '../services/jiraService';
import { fetchADOItems } from '../services/adoService';
import { ExternalItem } from '../types/nfrTypes';
import { toggleItemId, resetWizard } from '../slices/nfrWizardSlice';
import { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '@/pages/settings/store/hooks';
import { fetchAdoItems } from '../slices/nfr.thunks';
import { showSnackbar } from '@/store/snackbarStore';

const WizardStep1_Fetch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { externalItems, loadingItems } = useAppSelector(s => s.nfrWizard);
  const selectedItems = useSelector((state: RootState) => state.nfrWizard.selectedItemIds);
  const { selectedProject } = useSelector((state: RootState) => state.project);

  const [items, setItems] = useState<ExternalItem[]>([]);
  const [source, setSource] = useState<'ADO'>('ADO');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchText, setSearchText] = useState('');
  // const [filteredData, setFilteredData] = useState<any[]>(externalItems);

  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
  const [loading, setLoading] = React.useState<boolean>(false);

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };



  // useEffect(() => {
  //   if (!selectedProject?.id) return;

  //   // if (externalItems.length === 0) {
  //   //   dispatch(fetchAdoItems(selectedProject.id));
  //   // } else {
  //   setFilteredData(externalItems);
  //   setItems(externalItems);
  //   // }
  // }, [dispatch, externalItems]);

  // Reset all wizard state when project changes
  // useEffect(() => {

  //   if (!selectedProject?.id) return;

  //   dispatch(resetWizard());
  //   setFilteredData([]);
  //   setItems([]);
  //   setSearchText('');
  //   setFilterType('All');
  // }, [selectedProject?.id]);

  const filteredData = items.filter((item: any) => {

    const matchesType =
      filterType === 'All' ||
      item.type?.toLowerCase() === filterType.toLowerCase();

    const matchesSearch =
      searchText.trim() === '' ||
      item.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchText.toLowerCase())
      );

    return matchesType && matchesSearch;
  });



  const handleFetch = async () => {

    setLoading(true);

    try {

      const response = await dispatch(fetchAdoItems(selectedProject?.id)).unwrap();
      const allRecords = response;

      setItems(allRecords);

      // let result = [...allRecords];

      // if (searchText.trim() !== '') {
      //   const search = searchText.toLowerCase();
      //   result = result.filter((item: any) =>
      //     item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(search))
      //   );
      // }

      // if (filterType !== 'All') {
      //   result = result.filter((item: any) =>
      //     item.type?.toLowerCase() === filterType.toLowerCase()
      //   );
      // }

      // setItems(allRecords);
      // setFilteredData(result);


    } catch (err: any) {

      dispatch(showSnackbar({
        message: err?.message || err?.error || 'Failed to fetch ADO items',
        type: 'error',
      }));

    } finally {

      setLoading(false);

    }
  };




  return (
    <div className="space-y-3 text-xs">

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