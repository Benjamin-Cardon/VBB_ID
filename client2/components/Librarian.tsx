import React, { useState } from "react";
import { AuthProvider } from "./AuthContext";
import LibrarianLogin from "./LibrarianLogin";
import Attendance from "./Attendance";
import NavBar from "./NavBar";


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
      <>
        <NavBar></NavBar>
        <Attendance />
      </>
    </AuthProvider>)
};

export default App;