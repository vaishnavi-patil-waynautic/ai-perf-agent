import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  initialToken?: string;
  onSave: (token: string) => void;
};

export default function IntegrationTokenDialog({
  open,
  onClose,
  initialToken,
  onSave,
}: Props) {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(initialToken || "");
  }, [initialToken, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: "primary.main" }}>
        {initialToken ? "Edit Token" : "Connect Integration"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="Access Token"
          type="password"
          fullWidth
          size="small"
          margin="normal"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
      </DialogContent>


      <DialogActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          disabled={!token.trim()}
          onClick={() => {
            onSave(token);
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>

    </Dialog>
  );
}
