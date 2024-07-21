import { authReducer } from "./slices/authSlice"
import { userReducer } from "./slices/userSlice"
import { searchReducer } from "./slices/searchSlice"


export const rootReducer = {
  auth: authReducer,
  user: userReducer,
  search: searchReducer
}
