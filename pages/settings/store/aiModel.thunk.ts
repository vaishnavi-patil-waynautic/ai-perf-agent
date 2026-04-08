import { createAsyncThunk } from "@reduxjs/toolkit";
import { aiModelService } from "../services/aiModel.service";
import { showSnackbar } from "@/store/snackbarStore";

// GET
export const fetchModels = createAsyncThunk(
  "aiModel/fetchAll",
  async ( projectId : Number, { dispatch, rejectWithValue }) => {
    try {
      const data = await aiModelService.getAll(projectId);

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

export const createModel = createAsyncThunk(
  "aiModel/create",
  async (
    { payload, projectId }: { payload: any; projectId: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await aiModelService.create(payload, projectId);

      console.log("__________Data return__________ : ", data);

      return data;
    } catch (error: any) {
      console.log("__________Error found service__________ : ", error);
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