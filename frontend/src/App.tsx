import { useState } from "react"
import { invoke } from "./api";


export const App = () => {
  const [hello, setHello] = useState("");
  const [bye, setBye] = useState("");


  const getHello = async () => {
    const hello = await invoke("say_hello", "kotatsu")
    setHello(hello)
  }

  const getBye = async () => {
    const bye = await invoke("bye.say_bye", "kotatsu")

    setBye(bye)
  }


  return (
    <>
      <div>
        <button onClick={getHello}>get hello</button>
        {hello}
        <button onClick={getBye}>get bye</button>
        {bye}
      </div>
    </>
  )
}

