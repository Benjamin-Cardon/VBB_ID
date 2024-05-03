import React, { useState, createContext, useContext } from "react";

const authContext = createContext({});

export const useAuth = () => {
  return useContext(authContext);
}
interface authInterface {
  children: React.JSX.Element
}
interface userDataInterface {
  session_id?: string
}
export const AuthProvider = ({ children }: authInterface) => {
  const [user, setUser] = useState({});
  const login = (userData: userDataInterface) => {
    setUser(userData);
  }
  const logout = () => {
    setUser({});
  }
  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  )
}