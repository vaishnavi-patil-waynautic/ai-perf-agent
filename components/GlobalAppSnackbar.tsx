// components/GlobalAppSnackbar.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { hideSnackbar } from "../store/snackbarStore";
import AppSnackbar from "./AppSnackbar";

export default function GlobalAppSnackbar() {
  const dispatch = useDispatch();
  const { open, message, type } = useSelector(
    (state: RootState) => state.appSnackbar
  );

  return (
    <AppSnackbar
      open={open}
      message={message}
      type={type}
      onClose={() => dispatch(hideSnackbar())}
    />
  );
}
