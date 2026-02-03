import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WizardState } from '../types/nfrTypes';




const initialState: WizardState = {
  selectedItemIds: [],
  uploadedFiles: [],
  questionnaireResponses: [],
  additionalInstructions: '',
  selectedApplicationId: null,
};

const nfrWizardSlice = createSlice({
  name: 'nfrWizard',
  initialState,
  reducers: {
    // Step 1: Toggle Jira / ADO IDs
    toggleItemId: (state, action: PayloadAction<string>) => {
      if (state.selectedItemIds.includes(action.payload)) {
        state.selectedItemIds = state.selectedItemIds.filter(
          id => id !== action.payload
        );
      } else {
        state.selectedItemIds.push(action.payload);
      }
    },

    // Step 2: Documents
    setUploadedFiles: (state, action: PayloadAction<File[]>) => {
      state.uploadedFiles = action.payload;
    },

    // Step 3: Questionnaire (upsert answer)
    upsertQuestionAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: string }>
    ) => {
      const existing = state.questionnaireResponses.find(
        q => q.questionId === action.payload.questionId
      );

      if (existing) {
        existing.answer = action.payload.answer;
      } else {
        state.questionnaireResponses.push(action.payload);
      }
    },

    // Step 4: Additional instructions
    setAdditionalInstructions: (state, action: PayloadAction<string>) => {
      state.additionalInstructions = action.payload;
    },

    // Step 4: Application selection
    setSelectedApplication: (state, action: PayloadAction<string>) => {
      state.selectedApplicationId = action.payload;
    },

    // Reset everything
    resetWizard: () => initialState,
  },
});

export const {
  toggleItemId,
  setUploadedFiles,
  upsertQuestionAnswer,
  setAdditionalInstructions,
  setSelectedApplication,
  resetWizard,
} = nfrWizardSlice.actions;

export default nfrWizardSlice.reducer;
