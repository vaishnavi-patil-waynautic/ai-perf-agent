import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NFRStrategy } from '../types/nfrTypes';

interface NFRListState {
  strategies: NFRStrategy[];
}

const initialState: NFRListState = {
  strategies: [
    { id: 'STRAT-1234', appName: 'E-Commerce Platform', createdOn: '2023-10-01', status: 'Completed', createdBy: 'Admin', resultContent: 'Dummy Result Content' },
    { id: 'STRAT-5678', appName: 'HR Portal', createdOn: '2023-10-05', status: 'In Process', createdBy: 'John Doe' },
  ],
};

const nfrListSlice = createSlice({
  name: 'nfrList',
  initialState,
  reducers: {
    addStrategy: (state, action: PayloadAction<NFRStrategy>) => {
      state.strategies.unshift(action.payload);
    },
    deleteStrategy: (state, action: PayloadAction<string>) => {
      state.strategies = state.strategies.filter(s => s.id !== action.payload);
    },
    updateStrategyStatus: (state, action: PayloadAction<{id: string, status: NFRStrategy['status']}>) => {
        const item = state.strategies.find(s => s.id === action.payload.id);
        if(item) item.status = action.payload.status;
    }
  },
});

export const { addStrategy, deleteStrategy, updateStrategyStatus } = nfrListSlice.actions;
export default nfrListSlice.reducer;