import { Preloader } from "./components/Preloader";
import { WindowFrame } from "./components/WindowFrame";
import { useEffect, useState } from "react";
import { invoke } from "./api";
import { Main } from "./components/Main";


export const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const timeConsuming = async () => {
    const res = await invoke('time_consuming', 'qwe');
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
      {loading ? <Preloader /> : <Main />}
    </>
  );
};

