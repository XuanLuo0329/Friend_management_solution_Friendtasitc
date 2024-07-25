import React from "react";
import useGet from "./useGet";
import { useLocalStorage } from "./useLocalStorage";

export const AppContext = React.createContext({});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export function AppContextProvider({ children }) {

  const context = {
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
