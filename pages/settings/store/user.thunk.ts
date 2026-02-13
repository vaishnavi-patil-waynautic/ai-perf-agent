import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../services/user.service";
import { User } from "../types/settings.types";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async () => {
    return await userService.getMe();
  }
);

export const updateCurrentUser = createAsyncThunk(
  "user/updateCurrentUser",
  async (payload: Partial<User>) => {
    return await userService.updateMe(payload);
  }
);
