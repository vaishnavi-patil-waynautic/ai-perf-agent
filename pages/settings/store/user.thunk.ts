import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../services/user.service";
import { User } from "../types/settings.types";
import { logout } from "@/store/authSlice";



export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await userService.getMe();
       return res;
    } catch (err: any) {
      dispatch(logout());          // 🔴 important
      return rejectWithValue(err);
    }
  }
);

export const updateCurrentUser = createAsyncThunk(
  "user/updateCurrentUser",
  async (payload: Partial<User>) => {
    return await userService.updateMe(payload);
  }
);
