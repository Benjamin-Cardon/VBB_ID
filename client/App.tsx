import React, { useState } from "react";
import LibrarianLogin from "./components/LibrarianLogin";
import LibrarianMenu from "./components/LibrarianMenu";
import PatronLogin from "./components/PatronLogin";
import RegisterPatron from "./components/RegisterPatron";
import { AuthProvider } from "./components/AuthContext";

const App: React.FC = () => {
  const [page, setPage] = useState('LibraryLogin')
  const changePage = (newPage: string) => {
    setPage(newPage);
  }
  return (
    <AuthProvider>
      <div>
        {page == "LibraryLogin" && <LibrarianLogin />}
        {page == "LibrarianMenu" && <LibrarianMenu />}
        {page == "PatronLogin" && <PatronLogin />}
        {page == "RegisterPatron" && <RegisterPatron />}
      </div>
    </AuthProvider>)

};

export default App;