import { Sidebar } from "../components/Sidebar";
import styles from "../styles/main.module.css"
import { useState, useEffect } from "react";
import { Saved } from "../components/Saved";
import { Search } from "../components/Search";
import { Official } from "../components/Official";


enum Catalog {
  OFFICIAL,
  SEARCH,
  SAVED
}

export const Main = () => {
  const [catalog, setCatalog] = useState<Catalog>(Catalog.SAVED)


  useEffect(() => {
    setCatalog(Catalog.SEARCH)
  }, [])

  return (
    <>
      <div className={styles.background}>
        <Sidebar />
        {catalog === Catalog.SAVED ? (
          <Saved />
        ) : catalog === Catalog.OFFICIAL ? (
          <Official />
        ) : (
          <Search />
        )}
      </div>
      
    </>
  )
}

