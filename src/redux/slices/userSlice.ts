import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@/types"




const userSlice = createSlice({
  name: "user",
  initialState: {
      info: {} as User,
  },
  reducers: {
    setUserInfo(state, action) {
      state.info = action.payload;
    }
  }
})


export const {
    reducer: userReducer,
    actions: userActions,
} = userSlice
