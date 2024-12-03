import styles from "../styles/windowFrame.module.css"
import { invoke } from "../api"
import { CloseFrame } from "../assets/CloseFrame"
import { MinimizeFrame } from "../assets/MinimizeFrame"
import { MaximizeFrame } from "../assets/MaximizeFrame"


export const WindowFrame = () => {
  const minimize = async () => {
    await invoke("navigation.minimize_window")
  } 

  const toggleMaximize = async () => {
    await invoke("navigation.maximize_window")
  } 

  const close = async () => {
    await invoke("navigation.close_window")
  } 

  return (
      <div className="pywebview-drag-region">
        <div className={styles.title}>
          EVA
        </div>
        <div className={styles.controls}>
          <div className={styles.minimize} onClick={minimize}><MinimizeFrame /></div>
          <div className={styles.maximize} onClick={toggleMaximize}><MaximizeFrame /></div>
          <div className={styles.close} onClick={close}><CloseFrame /></div>
        </div>
      </div>

  )
}
