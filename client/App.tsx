import React, { useState } from "react";
import LibrarianLogin from "./components/LibrarianLogin";
import LibrarianMenu from "./components/LibrarianMenu";
import PatronLogin from "./components/PatronLogin";
import RegisterPatron from "./components/RegisterPatron";
import { AuthProvider } from "./components/AuthContext";
import Patrons from "./components/Patrons";

export type props = {
  changePage: (newPage: string) => void,
}

const App: React.FC = () => {
  const [page, setPage] = useState('LibraryLogin')
  const changePage = (newPage: string) => {
    setPage(newPage);
  }
  return (
    <AuthProvider>
      <div>
        {page == "LibraryLogin" && <LibrarianLogin changePage={changePage} />}
        {page == "LibrarianMenu" && <LibrarianMenu changePage={changePage} />}
        {page == "PatronLogin" && <PatronLogin changePage={changePage} />}
        {page == "RegisterPatron" && <RegisterPatron changePage={changePage} />}
        {page == "Patrons" && <Patrons changePage={changePage} />}
      </div>
    </AuthProvider>)
};

export default App;