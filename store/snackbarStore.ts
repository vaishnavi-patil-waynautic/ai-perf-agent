// store/appSnackbarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SnackbarType } from "../components/AppSnackbar";

type SnackbarState = {
  open: boolean;
  message: string;
  type: SnackbarType;
};

const initialState: SnackbarState = {
  open: false,
  message: "",
  type: "success",
};

const appSnackbarSlice = createSlice({
  name: "appSnackbar",
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{ message: string; type?: SnackbarType }>
    ) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },
    hideSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = appSnackbarSlice.actions;
export default appSnackbarSlice.reducer;
