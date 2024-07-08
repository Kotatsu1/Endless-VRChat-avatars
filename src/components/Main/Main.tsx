import "./styles.css";
import { Sidebar } from ".."
import { Outlet } from "react-router-dom";
import { Login } from "../Login/Login"
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { RootState } from "@/redux"
import { useDispatch, useSelector } from "react-redux"
import { authActions, userActions } from "@/redux"

const Main = () => {
  const authState = useSelector((state: RootState) => state.auth.isAuth)
  const dispatch = useDispatch()

  const setAuthState = () => {
    dispatch(authActions.setAuth())
  }

  const setUserInfo = async () => {
    const rawUserInfo: string = await invoke("get_user_info")
    const parsedUserInfo = JSON.parse(rawUserInfo)

    dispatch(userActions.setUserInfo(parsedUserInfo))
  }

  const setAuth = async () => {
    const auth: string = await invoke("check_auth");

    if (!auth.includes("401")) {
      await setUserInfo();
      setAuthState();
    }
  }

  useEffect(() => {
    setAuth()
  }, [])

  return (
    <>
      {authState ? 
        <div className="base">
          <Sidebar />
          <div className="wrapper">
            <div className="outlet">
              <Outlet />
            </div>
          </div>
        </div>
        : <Login />
      }
    </>
  );
}

export default Main;
