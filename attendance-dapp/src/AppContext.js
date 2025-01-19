import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [generatedPwd, setGeneratedPwd] = useState("");

  return (
    <AppContext.Provider value={{ generatedPwd, setGeneratedPwd }}>
      {children}
    </AppContext.Provider>
  );
};
