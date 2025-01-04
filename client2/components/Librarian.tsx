import React, { useState } from "react";
import { AuthProvider } from "./AuthContext";


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
      </div>
    </AuthProvider>)
};

export default App;