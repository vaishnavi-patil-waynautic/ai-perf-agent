import { createAsyncThunk } from '@reduxjs/toolkit';
import { GovernanceService } from '../services/governance.service';
import { transformRoiOverview } from '../utils/roiTransformer';

// ROI Overview
export const fetchRoiOverview = createAsyncThunk(
    'dashboard/fetchRoiOverview',
    async (params: { project_id: number; period?: string }, { rejectWithValue }) => {
        try {
            console.log("Calling governance api_____________________________________2")
            const res = await GovernanceService.getRoiOverview(params);
            console.log("Calling governance api_____________________________________4")
            return transformRoiOverview(res);
        } catch (err: any) {
            return rejectWithValue(err);
        }
    }
);

// LLM Summary
export const fetchLlmSummary = createAsyncThunk(
    'dashboard/fetchLlmSummary',
    async (params: { project_id: number }) => {
        const res = await GovernanceService.getLlmUsageSummary(params);
        return res;
    }
);

// LLM Usage Table (optional)
export const fetchLlmUsageList = createAsyncThunk(
    'dashboard/fetchLlmUsageList',
    async (params: any) => {
        const res = await GovernanceService.getLlmUsageList(params);
        return res;
    }
);