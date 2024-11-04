import { useState } from "react"
import { invoke } from "./api";
import styles from "./styles/app.module.css"
import classNames from 'classnames';


export const App = () => {
  const [hello, setHello] = useState("");


  const getHello = async () => {
    const hello = await invoke("say_hello", "kotatsu")
    setHello(hello)
  }



  return (
    <>
      <div className={styles.background}>


        <div className={classNames(styles.anyBlock, styles.sidebar)}>
          <button onClick={getHello}>get hello {hello}</button>
        </div>

        <div className={classNames(styles.anyBlock, styles.container)}>
          <div>
            qweqweqe
          </div>

        </div>
        
      </div>
    </>
  )
}

