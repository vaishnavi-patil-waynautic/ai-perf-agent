import { createSlice } from "@reduxjs/toolkit";
import { fetchModels, createModel, deleteModel } from "./aiModel.thunk";

interface ModelState {
  models: any[];
  loading: boolean;
}

const initialState: ModelState = {
  models: [],
  loading: false,
};

const aiModelSlice = createSlice({
  name: "aiModel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
  state.loading = false;
  state.models = action.payload.data; // ✅ FIX
})
      .addCase(fetchModels.rejected, (state) => {
        state.loading = false;
      })

      // POST
      .addCase(createModel.fulfilled, (state, action) => {
  state.models.push(action.payload.data); // ✅ FIX
})

      // DELETE
      .addCase(deleteModel.fulfilled, (state, action) => {
        state.models = state.models.filter(
          (m) => m.id !== action.payload
        );
      });
  },
});

export default aiModelSlice.reducer;