// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthState, User } from "./types";

// // Load persisted auth state
// const storedToken = localStorage.getItem("access_token");
// const storedUser = localStorage.getItem("user");

// const initialState: AuthState = {
//   user: storedUser ? JSON.parse(storedUser) : null,
//   token: storedToken,
//   isAuthenticated: false,
//   loading: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginStart: (state) => {
//       state.loading = true;
//     },

//     loginSuccess: (
//       state,
//       action: PayloadAction<{ user: User; access: string }>
//     ) => {
//       state.loading = false;
//       state.isAuthenticated = true;
//       state.user = action.payload.user;
//       state.token = action.payload.access;

//       // Persist redux state
//       localStorage.setItem("access_token", action.payload.access);
//       localStorage.setItem("user", JSON.stringify(action.payload.user));
//     },

//     authChecked: (state, action: PayloadAction<boolean>) => {
//   state.isAuthenticated = action.payload;
//   state.loading = false;
// },

//     loginFailure: (state) => {
//       state.loading = false;
//       state.isAuthenticated = false;
//       state.user = null;
//       state.token = null;
//     },

//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.token = null;

//       // Clear ALL auth storage
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("selectedProjectId");
//     },
//   },
// });

// export const { loginStart, loginSuccess, loginFailure, logout, authChecked } =
//   authSlice.actions;

// export default authSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "./types";

const storedToken = localStorage.getItem("access_token");
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: false,
  authLoading: true,     // bootstrap only
  loginLoading: false,   // login only
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔹 Login Flow
    loginStart: (state) => {
      state.loginLoading = true;
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; access: string }>
    ) => {
      state.loginLoading = false;
      state.authLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.access;

      localStorage.setItem("access_token", action.payload.access);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    loginFailure: (state) => {
      state.loginLoading = false;
      state.isAuthenticated = false;
    },

    // 🔹 Bootstrap Flow
    authChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      state.authLoading = false;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.authLoading = false;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  authChecked,
} = authSlice.actions;

export default authSlice.reducer;
