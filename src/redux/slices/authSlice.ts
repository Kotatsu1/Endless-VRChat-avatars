import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
      isAuth: false,
  },
  reducers: {
    setAuth(state) {
      state.isAuth = true;
    },
    clearAuth(state) {
      state.isAuth = false;
    },
  },
})


export const {
    reducer: authReducer,
    actions: authActions,
} = authSlice
