import cookieService from "@/services/cookies/cookieService";
import { LoginResponse } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      console.log("payload", action.payload);
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      // We can't remove HTTP-only cookies from client-side
      // This will be handled by the logout API endpoint
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
