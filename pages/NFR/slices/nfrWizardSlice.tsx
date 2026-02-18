import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExternalItem, WizardState } from '../types/nfrTypes';
import { fetchAdoItems } from './nfr.thunks';



const initialState: WizardState = {
  selectedItemIds: [],
  uploadedFiles: [],
  questionnaireResponses: [],
  additionalInstructions: "",
  selectedApplicationId: null,

  externalItems: [],
  loadingItems: false,
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

    removeUploadedFile: (state, action) => {
  state.uploadedFiles = state.uploadedFiles.filter(
    (_, index) => index !== action.payload
  );
},


    // Reset everything
    resetWizard: () => initialState,
  },

  extraReducers: builder => {
  builder
    .addCase(fetchAdoItems.pending, state => {
      state.loadingItems = true;
    })
    .addCase(fetchAdoItems.fulfilled, (state, action) => {
      state.loadingItems = false;
      state.externalItems = action.payload;
    })
    .addCase(fetchAdoItems.rejected, state => {
      state.loadingItems = false;
    });
}

});

export const {
  toggleItemId,
  setUploadedFiles,
  upsertQuestionAnswer,
  setAdditionalInstructions,
  setSelectedApplication,
  resetWizard,
  removeUploadedFile 
} = nfrWizardSlice.actions;

export default nfrWizardSlice.reducer;
