"use client"
import { createContext, useState,ReactNode} from "react";

interface ProviderProps {
  children: ReactNode;
}

interface ThemeStyle {
  backgroundColor: string;
  color: string;
}

interface AppContextType {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  themeStyle: ThemeStyle;
}

const themeStyle = {
    Dark : {
        backgroundColor: "black",
        color: "white"
    },
    Light: {
        backgroundColor: "white",
        color: "black"
    }
}

export const contextApp = createContext<AppContextType>({
  isDark: false,
  setIsDark: () => {},
  themeStyle: themeStyle.Light,
});

export const ProviderContextApp = ({children}: ProviderProps) => {
  const [isDark, setIsDark] = useState(false);

  return <contextApp.Provider value={{
          isDark, setIsDark
          , themeStyle : isDark ? themeStyle.Dark : themeStyle.Light
      }}>
      {children}
  </contextApp.Provider>
}