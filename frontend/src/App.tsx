import { useState } from "react"
import { invoke } from "./api";


export const App = () => {
  const [hello, setHello] = useState("");


  const getHello = async () => {
    const hello = await invoke("say_hello", "kotatsu")
    setHello(hello)
  }



  return (
    <>
      <div>
        <button onClick={getHello}>get hello</button>
        {hello}
      </div>
    </>
  )
}

