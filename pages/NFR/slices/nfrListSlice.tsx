import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNfrList,
  deleteNfrById,
  generateNfr,
  fetchNfrReport,
  getNfrById
} from "./nfr.thunks";

interface NFRListState {
  strategies: any[];
  selectedReport?: any;
  loading: boolean;
  error: string | null;
}


const initialState: NFRListState = {
  strategies: [],
  loading: false,
  error: null,
};

const nfrListSlice = createSlice({
  name: "nfrList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 📥 GET ALL
      .addCase(fetchNfrList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNfrList.fulfilled, (state, action) => {
        state.loading = false;
        state.strategies = action.payload;
      })
      .addCase(fetchNfrList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch NFR list";
      })

      .addCase(getNfrById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNfrById.fulfilled, (state, action) => {
        state.loading = false;
        state.strategies = action.payload;
      })
      .addCase(getNfrById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch NFR list";
      })

      // ❌ DELETE
      .addCase(deleteNfrById.fulfilled, (state, action) => {
        state.strategies = state.strategies.filter(
          (s) => s.id !== action.payload
        );
      })

      // ⚙️ GENERATE (optimistic insert)
      .addCase(generateNfr.fulfilled, (state, action) => {
        state.strategies.unshift(action.payload);
      })

      .addCase(fetchNfrReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNfrReport.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchNfrReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default nfrListSlice.reducer;
