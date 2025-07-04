import React, { createContext, useContext, useState, useMemo } from "react";

const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {
  const [mode, setMode] = useState("light");
  const value = useMemo(() => ({
    mode,
    setThemeMode: setMode,
    resolvedMode: mode,
  }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeContext); 