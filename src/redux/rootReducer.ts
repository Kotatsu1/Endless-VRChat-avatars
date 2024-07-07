import { authReducer } from "./slices/authSlice"
import { userReducer } from "./slices/userSlice"


export const rootReducer = {
  auth: authReducer,
  user: userReducer
}
