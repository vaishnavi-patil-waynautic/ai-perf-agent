import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: {
    name: string;
    description: string;
  } | null;
};


export default function AddApplicationDialog({
  open,
  onClose,
  onSubmit,
  initialData
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({ name, description });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
  <DialogTitle sx={{ color: "primary.main" }}>
    {initialData ? "Edit Application" : "Add Application"}
  </DialogTitle>

  <DialogContent sx={{ pt: 2 }}>
    <TextField
      label="Application Name"
      fullWidth
      size="small"
      margin="normal"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <TextField
      label="Description"
      fullWidth
      size="small"
      multiline
      minRows={3}
      margin="normal"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
  </DialogContent>

  <DialogActions sx={{ justifyContent: "space-between", paddingX: 3, paddingY: 2 }}>
  <Button onClick={onClose}>Cancel</Button>

  <Button
    variant="contained"
    disabled={!name.trim()}
    onClick={handleSubmit}
  >
    {initialData ? "Save" : "Add"}
  </Button>
</DialogActions>

</Dialog>

  );
}
