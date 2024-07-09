import "./styles.css"
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { encodeCredentials } from "@/utils/encoder" 
import { useDispatch } from "react-redux"
import { authActions } from "@/redux"

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authCookie, setAuthCookie] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

 
  const dispatch = useDispatch()

  const setAuthState = () => {
    dispatch(authActions.setAuth())
  }

  const handleLogin = async () => {
    if (twoFactorRequired) {
      const verify: string[] = await invoke("verify_two_factor", { code: twoFactorCode, authCookie, method: twoFactorMethod })
      const completeCookie = `${verify[0]}; ${authCookie}`
      if (completeCookie.length > 300) {
        await invoke("update_auth_cookie_cmd", { authCookie: completeCookie })

        setAuthState()
        return
      }
    }
    const authString = encodeCredentials(login, password)
    const res: [string, string[]] = await invoke("login", { authString })

    const cookie = res[1]
    if (cookie) {
      setAuthCookie(cookie[0])
    }
    
    const parsedRes = JSON.parse(res[0]);

    if (parsedRes.requiresTwoFactorAuth) {
      setTwoFactorMethod(parsedRes.requiresTwoFactorAuth[0]);
      setTwoFactorRequired(true);
    }
  }

  return (
    <>
      <div className="login-container">
        <h2>Login</h2>
        <div className="input-field">
          <input
            type="text"
            placeholder="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {twoFactorRequired &&
          <div className="input-field">
            <input
              type="text"
              placeholder="two factor code"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
            />
          </div>
        }
        <button className="btn login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </>
  )
}

export { Login };
