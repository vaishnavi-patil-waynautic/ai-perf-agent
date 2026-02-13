import { createAsyncThunk } from "@reduxjs/toolkit";
import { nfrService } from "../services/nfrService";
// import { NFRStrategy } from "../types/nfrTypes";

/**
 * Fetch all NFR documents
 */
export const fetchNfrList = createAsyncThunk<any[]>(
  "nfr/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await nfrService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


export const getNfrById = createAsyncThunk(
  "nfr/getById",
  async (id: number, { rejectWithValue }) => {
    try {
      console.log("NFR get by id : ",id );
      return await nfrService.getNfrListByProjectId(id);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Delete NFR by ID
 */
// export const deleteNfrById = createAsyncThunk<number>(
//   "nfr/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await nfrService.deleteById(id);
//       return id;
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const deleteNfrById = createAsyncThunk<
  number,        // ✅ returns nothing
  number       // ✅ accepts id
>(
  'nfr/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log(" 2 Delete called", id);
      await nfrService.deleteById(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


/**
 * Generate NFR
 */
export const generateNfr = createAsyncThunk<
  any,
  Parameters<typeof nfrService.generate>[0]
>(
  "nfr/generate",
  async (payload, { rejectWithValue }) => {
    try {
      return await nfrService.generate(payload);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchNfrReport = createAsyncThunk(
  "nfr/show",
  async (id: number, { rejectWithValue }) => {
    try {
      return await nfrService.getReportById(id);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

