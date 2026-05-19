import * as React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    OutlinedInput,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from "@mui/material";

import { RootState } from '../store/store';
import { selectApplication } from '../pages/project/store/project.slice';
import { Application } from '../pages/project/types/project.types';
import { useDispatch, useSelector } from "react-redux";

const ADD_NEW_VALUE = '__add_new__';

export default function ApplicationSelect() {
  const dispatch = useDispatch();

  // ✅ Redux state
  const applications = useSelector(
    (state: RootState) => state.project.applications
  );

  const selectedApp = useSelector(
    (state: RootState) => state.project.selectedApp
  );

  // Local dialog state
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newAppName, setNewAppName] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;

    if (selectedValue === ADD_NEW_VALUE) {
      setOpenDialog(true);
      return;
    }

    dispatch(selectApplication(Number(selectedValue)));
  };

  const handleCreateApplication = () => {
    if (!newAppName.trim()) return;

    console.warn('Create application API not implemented yet');

    setNewAppName('');
    setOpenDialog(false);
  };

  const handleClose = () => {
    setNewAppName('');
    setOpenDialog(false);
  };

    return (
        <>
            <FormControl size="small" sx={{ width: 200, minWidth: 200, maxWidth: 200 }}>
                <InputLabel shrink id="application-select-label">
                    Application
                </InputLabel>

                <Select
                    labelId="application-select-label"
                    value={selectedApp?.id?.toString() ?? ''}
                    onChange={handleChange}
                    input={<OutlinedInput notched label="Application" />}
                    displayEmpty
                    renderValue={(selected) => {
                        if (!selected) return <em>Default Application</em>;
                        const app = applications?.find(a => a.id?.toString() === selected);
                        return (
                            <Box
                                component="span"
                                sx={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                                title={app?.name ?? ''}
                            >
                                {app?.name ?? ''}
                            </Box>
                        );
                    }}
                >
                    <MenuItem value="">
                        <em>Default Application</em>
                    </MenuItem>

                    {applications?.map((app) => (
                        <MenuItem key={app.id} value={app.id} title={app.name}>
                            {app.name}
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>

            
        </>
    );
}



