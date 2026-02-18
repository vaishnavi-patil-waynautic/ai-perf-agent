// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from "@mui/material";
// import { useEffect, useState } from "react";


// type Props = {
//   open: boolean;
//   onClose: () => void;
//   integrationId?: number;
//   type : string;
//   projectId : number;
// };

// export default function IntegrationTokenDialog({
//   open,
//   onClose,
//   integrationId,
//   type,
//   projectId
// }: Props) {
//   const [token, setToken] = useState("");

//   useEffect(() => {
//     setToken(initialToken || "");
//   }, [initialToken, open]);

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
//       <DialogTitle sx={{ color: "primary.main" }}>
//         {initialToken ? "Edit Token" : "Connect Integration"}
//       </DialogTitle>

//       <DialogContent sx={{ pt: 2 }}>
//         <TextField
//           label="Access Token"
//           type="password"
//           fullWidth
//           size="small"
//           margin="normal"
//           value={token}
//           onChange={e => setToken(e.target.value)}
//         />
//       </DialogContent>


//       <DialogActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button
//           variant="contained"
//           disabled={!token.trim()}
//           onClick={() => {
//             onSave(token);
//             onClose();
//           }}
//         >
//           Save
//         </Button>
//       </DialogActions>

//     </Dialog>
//   );
// }


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {integrationService} from "../services/integration.service";
import { showSnackbar } from "@/store/snackbarStore";
import { useDispatch } from "react-redux";

type Props = {
  open: boolean;
  onClose: () => void;
  integrationId?: number;
  type: string;
  projectId: number;
};

export default function IntegrationTokenDialog({
  open,
  onClose,
  integrationId,
  type,
  projectId,
}: Props) {

  const dispatch = useDispatch();

  const [token, setToken] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [adoPat, setAdoPat] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= Fetch existing token (EDIT mode) ================= */
  useEffect(() => {
    if (!open) return;

    const fetchToken = async () => {
      // NEW token → clear fields
      if (!integrationId) {
        setToken("");
        setApiKey("");
        setApiSecret("");
        setAdoPat("");
        return;
      }

      try {
        setLoading(true);

        const data = await integrationService.getIntegration(projectId, integrationId);

        setToken(data?.token || "");
        setApiKey(data?.api_key || "");
        setApiSecret(data?.api_secret || "");
        setAdoPat(data?.ado_pat || "");

      } catch (err) {
        console.error("Failed to fetch token", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [open, integrationId, projectId]);

  /* ================= Save ================= */
  // const handleSave = async () => {
  //   try {
  //     const payload: any = { integration_type: type };

  //     if (type === "github" || type === "jira" || type === "datadog") {
  //       payload.token = token;
  //     }

  //     if (type === "blazemeter") {
  //       payload.api_key = apiKey;
  //       payload.api_secret = apiSecret;
  //     }

  //     if (type === "ado") {
  //       payload.ado_pat = adoPat;
  //     }

  //     console.log("Saving payload:", payload);

  //     // TODO: call create/update API here

  //     onClose();
  //   } catch (err) {
  //     console.error("Save failed:", err);
  //   }
  // };


  const handleSave = async () => {
  try {
    const payload: any = { integration_type: type };

    if (type === "github" || type === "jira" || type === "datadog") {
      payload.token = token;
    }

    if (type === "blazemeter") {
      payload.api_key = apiKey;
      payload.api_secret = apiSecret;
    }

    if (type === "ado") {
      payload.ado_pat = adoPat;
    }

    console.log("Saving payload:", payload);

    // TODO: call create/update API here
    // await dispatch(saveIntegration(payload)).unwrap();

    onClose();

    dispatch(
      showSnackbar({
        message: "Integration saved successfully",
        type: "success",
      })
    );
  } catch (err: any) {
    console.error("Save failed:", err);

    dispatch(
      showSnackbar({
        message: err?.message || "Failed to save integration",
        type: "error",
      })
    );
  }
};

  /* ================= UI (UNCHANGED LOOK) ================= */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: "primary.main" }}>
        {integrationId ? "Edit Token" : "Connect Token"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>

        {/* GitHub / Jira / Datadog */}
        {(type === "github" || type === "jira" || type === "datadog") && (
          <TextField
            label="Access Token"
            type="password"
            fullWidth
            size="small"
            margin="normal"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        )}

        {/* BlazeMeter */}
        {type === "blazemeter" && (
          <>
            <TextField
              label="API Key"
              type="password"
              fullWidth
              size="small"
              margin="normal"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />

            <TextField
              label="API Secret"
              type="password"
              fullWidth
              size="small"
              margin="normal"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </>
        )}

        {/* Azure DevOps */}
        {type === "ado" && (
          <TextField
            label="Personal Access Token"
            type="password"
            fullWidth
            size="small"
            margin="normal"
            value={adoPat}
            onChange={(e) => setAdoPat(e.target.value)}
          />
        )}

      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          disabled={
            (type === "blazemeter" && (!apiKey || !apiSecret)) ||
            (type === "ado" && !adoPat) ||
            ((type === "github" || type === "jira" || type === "datadog") &&
              !token.trim())
          }
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
