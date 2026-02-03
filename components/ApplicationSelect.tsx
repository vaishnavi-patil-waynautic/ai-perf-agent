// import * as React from "react";
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   SelectChangeEvent,
//   OutlinedInput
// } from "@mui/material";

// type Application = {
//   id: string;
//   name: string;
// };

// type Props = {
//   value: string;
//   onChange: (value: string) => void;
// };

// const dummyApplications: Application[] = [
//   { id: "app-1", name: "Trading Engine" },
//   { id: "app-2", name: "Risk Manager" },
//   { id: "app-3", name: "Order Gateway" }
// ];

// export default function ApplicationSelect({
//   value,
//   onChange
// }: Props) {
//   const handleChange = (event: SelectChangeEvent) => {
//     onChange(event.target.value);
//   };

//   return (
//     <FormControl size="small" fullWidth>
//       <InputLabel shrink id="application-select-label">
//         Application
//       </InputLabel>

//       <Select
//         labelId="application-select-label"
//         value={value}
//         onChange={handleChange}
//         input={<OutlinedInput notched label="Application" />}
//         displayEmpty
//       >
//         <MenuItem value="">
//           <em>Default Application</em>
//         </MenuItem>

//         {dummyApplications.map((app) => (
//           <MenuItem key={app.id} value={app.id}>
//             {app.name}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// }


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

// type Application = {
//     id: string;
//     name: string;
// };

// type Props = {
//     value: string;
//     onChange: (value: string) => void;
// };

// const dummyApplications: Application[] = [
//     { id: "app-1", name: "Trading Engine" },
//     { id: "app-2", name: "Risk Manager" },
//     { id: "app-3", name: "Order Gateway" }
// ];

// const ADD_NEW_VALUE = "__add_new__";

// export default function ApplicationSelect({ value, onChange }: Props) {
//     const [openDialog, setOpenDialog] = React.useState(false);
//     const [newAppName, setNewAppName] = React.useState("");

//     const handleChange = (event: SelectChangeEvent) => {
//         const selectedValue = event.target.value;

//         if (selectedValue === ADD_NEW_VALUE) {
//             setOpenDialog(true);
//             return;
//         }

//         onChange(selectedValue);
//     };

//     const handleCreateApplication = () => {
//         if (!newAppName.trim()) return;

//         const newId = `app-${Date.now()}`;
//         onChange(newId);

//         setNewAppName("");
//         setOpenDialog(false);
//     };

//     const handleClose = () => {
//         setNewAppName("");
//         setOpenDialog(false);
//     };


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

    /**
     * TEMP behavior:
     * Backend API for creating application not ready.
     * Once ready, replace this with API call + refetch project.
     */
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
            <FormControl size="small" fullWidth>
                <InputLabel shrink id="application-select-label">
                    Application
                </InputLabel>

                <Select
                    labelId="application-select-label"
                    value={selectedApp?.id?.toString() ?? ''}
                    onChange={handleChange}
                    input={<OutlinedInput notched label="Application" />}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Default Application</em>
                    </MenuItem>

                    {applications?.map((app) => (
                        <MenuItem key={app.id} value={app.id}>
                            {app.name}
                        </MenuItem>
                    ))}

                    {/* Modern subtle action */}
                    <MenuItem
                        value={ADD_NEW_VALUE}
                        sx={{
                            fontStyle: "italic",
                            color: "primary.main",
                            opacity: 0.9
                        }}
                    >
                        + Add new application
                    </MenuItem>
                </Select>
            </FormControl>

            {/* Minimal dialog */}
            <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{ pb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    Add application
                </DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        variant="outlined"
                        placeholder="Application name"
                        value={newAppName}
                        onChange={(e) => setNewAppName(e.target.value)}
                        margin="dense"
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancel
                    </Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="contained"
                        onClick={handleCreateApplication}
                        disabled={!newAppName.trim()}
                    >
                        Create
                    </Button>
                </DialogActions>


            </Dialog>
        </>
    );
}



