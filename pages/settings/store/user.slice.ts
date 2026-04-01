import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/settings.types";
import { fetchCurrentUser, updateCurrentUser } from "./user.thunk";

interface UserState {
  profile: User | null;
  loading: boolean;
}

const initialState: UserState = {
  profile: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: () => initialState,
    setAvatar: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.avatar = action.payload;
      }
      localStorage.setItem("user_avatar", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder

      // GET USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        // Restore avatar from localStorage if backend doesn't return one
        const savedAvatar = localStorage.getItem("user_avatar");
        if (savedAvatar && state.profile) {
          state.profile.avatar = savedAvatar;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
      })

      // UPDATE USER
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        const savedAvatar = state.profile?.avatar ?? localStorage.getItem("user_avatar");
        state.profile = action.payload;
        if (savedAvatar && state.profile) {
          state.profile.avatar = savedAvatar;
        }
      });
  },
});

export const { resetUser, setAvatar } = userSlice.actions;
export default userSlice.reducer;
