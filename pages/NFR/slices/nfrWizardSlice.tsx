import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WizardState, ExternalItem } from '../types/nfrTypes';

const initialState: WizardState = {
  selectedItems: [],
  uploadedFiles: [],
  questionnaire: { targetUsers: '', peakLoad: '', environment: '' },
  additionalInstructions: '',
};

const nfrWizardSlice = createSlice({
  name: 'nfrWizard',
  initialState,
  reducers: {
    toggleItemSelection: (state, action: PayloadAction<ExternalItem>) => {
      const exists = state.selectedItems.find(i => i.id === action.payload.id);
      if (exists) {
        state.selectedItems = state.selectedItems.filter(i => i.id !== action.payload.id);
      } else {
        state.selectedItems.push(action.payload);
      }
    },
    setUploadedFiles: (state, action: PayloadAction<string[]>) => {
      state.uploadedFiles = action.payload;
    },
    updateQuestionnaire: (state, action: PayloadAction<Partial<WizardState['questionnaire']>>) => {
      state.questionnaire = { ...state.questionnaire, ...action.payload };
    },
    setInstructions: (state, action: PayloadAction<string>) => {
      state.additionalInstructions = action.payload;
    },
    resetWizard: () => initialState,
  },
});

export const { toggleItemSelection, setUploadedFiles, updateQuestionnaire, setInstructions, resetWizard } = nfrWizardSlice.actions;
export default nfrWizardSlice.reducer;