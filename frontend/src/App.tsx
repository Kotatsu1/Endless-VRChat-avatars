import { Preloader } from "./components/Preloader";
import { WindowFrame } from "./components/WindowFrame";
import { useEffect, useState } from "react";
import { invoke } from "./api";
import { Main } from "./components/Main";
import { Login } from "./components/Login";



export const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState(false)

  const checkAuth = async () => {
    const result = await invoke('auth.get_user_info');
    console.log('userInfo', result.userInfo)

    setAuthenticated(result.auth)
    setLoading(false);
  };


  useEffect(() => {
    checkAuth()
  }, []);

  return (
    <>
      <WindowFrame />
      {loading ? <Preloader /> : authenticated ? <Main /> : <Login />}
    </>
  );
};

