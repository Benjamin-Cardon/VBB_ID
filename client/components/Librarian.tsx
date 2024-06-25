import React, { useState } from "react";
import LibrarianLogin from "./librarian/LibrarianLogin";
import LibrarianMenu from "./librarian/LibrarianMenu";
import PatronLogin from "./librarian/PatronLogin";
import RegisterPatron from "./librarian/RegisterPatron";
import { AuthProvider } from "./librarian/AuthContext";
import Patrons from "./librarian/Patrons";

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