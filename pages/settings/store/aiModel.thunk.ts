import { createAsyncThunk } from "@reduxjs/toolkit";
import { aiModelService } from "../services/aiModel.service";
import { showSnackbar } from "@/store/snackbarStore";

// GET
export const fetchModels = createAsyncThunk(
  "aiModel/fetchAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await aiModelService.getAll();

      console.log("API RESPONSE:", data);

      return data;
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error.message,
          type: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

// POST
export const createModel = createAsyncThunk(
  "aiModel/create",
  async (payload: any, { dispatch, rejectWithValue }) => {
    try {
      const data = await aiModelService.create(payload);

      dispatch(
        showSnackbar({
          message: "Model added successfully",
          type: "success",
        })
      );

      return data;
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error.message,
          type: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

// DELETE
export const deleteModel = createAsyncThunk(
  "aiModel/delete",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await aiModelService.delete(id);

      dispatch(
        showSnackbar({
          message: "Model deleted successfully",
          type: "success",
        })
      );

      return id;
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error.message,
          type: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);