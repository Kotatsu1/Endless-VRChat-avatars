import { Sidebar } from "../components/Sidebar";
import styles from "../styles/main.module.css"
import { useState, useEffect } from "react";
import { Endless } from "../components/Endless";
import { Search } from "../components/Search";
import { Official } from "../components/Official";


enum Catalog {
  OFFICIAL,
  SEARCH,
  ENDLESS
}

export const Main = () => {
  const [catalog, setCatalog] = useState<Catalog>(Catalog.ENDLESS)


  useEffect(() => {
    setCatalog(Catalog.OFFICIAL)
  }, [])

  return (
    <>
      <div className={styles.background}>
        <Sidebar />
        {catalog === Catalog.ENDLESS ? (
          <Endless />
        ) : catalog === Catalog.OFFICIAL ? (
          <Official />
        ) : (
          <Search />
        )}
      </div>
      
    </>
  )
}

