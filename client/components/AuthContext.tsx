import React, { useState, createContext, useContext } from "react";

const authContext = createContext({} as userDataInterface);

export const useAuth = () => {
  return useContext(authContext);
}
interface authInterface {
  children: React.JSX.Element
}
interface userDataInterface {
  session_id?: string,
  login(userData: string): void,
  logout(): void,
}
export const AuthProvider = ({ children }: authInterface) => {
  const [session_id, set_session_id] = useState("");
  const login = (userData: string) => {
    set_session_id(userData);
  }
  const logout = () => {
    set_session_id('');
  }
  return (
    <authContext.Provider value={{ session_id, login, logout }}>
      {children}
    </authContext.Provider>
  )
}