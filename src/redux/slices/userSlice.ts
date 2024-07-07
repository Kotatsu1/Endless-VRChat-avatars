import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
      userId: "no user id",
  },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    }
  }
})


export const {
    reducer: userReducer,
    actions: userActions,
} = userSlice
