import { Route, Routes } from "react-router-dom";
import { Main, CustomCatalog, IngameCatalog, SearchAvatars, Support } from "./components"


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="/" element={<CustomCatalog />} />
          <Route path="/ingame" element={<IngameCatalog />} />
          <Route path="/search" element={<SearchAvatars />} />
          <Route path="/support" element={<Support />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
