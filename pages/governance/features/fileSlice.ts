import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileItem {
  id: string;
  fileName: string;
  size: string;
  progress: number;
}

interface FileState {
  stagedFiles: FileItem[]; // The .har files being uploaded
  generatedScripts: any[];  // The history of JMX files
}

const initialState: FileState = {
  stagedFiles: [],
  generatedScripts: [],
};

export const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addStagedFile: (state, action: PayloadAction<FileItem>) => {
      state.stagedFiles.push(action.payload);
    },
    removeStagedFile: (state, action: PayloadAction<string>) => {
      state.stagedFiles = state.stagedFiles.filter(f => f.id !== action.payload);
    },
    setHistory: (state, action: PayloadAction<any[]>) => {
      state.generatedScripts = action.payload;
    }
  }
});

export default fileSlice.reducer;