import { invoke } from "./api";
import { Preloader } from "./components/Preloader";
//import styles from "./styles/app.module.css"


export const App = () => {
  const minimize = async () => {
    await invoke("minimize_window")
  } 

  const toggleMaximize = async () => {
    await invoke("maximize_window")
  } 

  const close = async () => {
    await invoke("close_window")
  } 


  return (
    <>
      <div className="pywebview-drag-region">
        <button onClick={minimize}>min</button>
        <button onClick={toggleMaximize}>max</button>
        <button onClick={close}>close</button>
      </div>
      <Preloader />
    </>
  )
}

