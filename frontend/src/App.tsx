import { Preloader } from "./components/Preloader";
import { WindowFrame } from "./components/WindowFrame";
import { useEffect, useState } from "react";
import { invoke } from "./api";
import { Main } from "./components/Main";
import { Login } from "./components/Login";

type SomeType = {
  id: number,
  title: string
}


export const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const timeConsuming = async () => {
    const payload: SomeType = {
      id: 1,
      title: "Kotatsu"
    }
    const res = await invoke('time_consuming', payload);
    console.log(res);
    if (res) {
      setLoading(false);
    }
  };


  useEffect(() => {
    timeConsuming()
  }, []);

  return (
    <>
      <WindowFrame />
      {loading ? <Preloader /> : <Login />}
    </>
  );
};

