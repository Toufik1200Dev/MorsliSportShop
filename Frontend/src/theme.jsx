import React from "react";
import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          text: {
            primary: "#2B3445",
          },
          neutral: {
            main: "#64748B",
          },

          favColor: {
            main: grey[300],
          },
          MyColor:{
            main: "#F6F9FC"
          },
          bg: {
            main: "#F6F9F6",}
        }
      : {
          // palette values for dark mode
          neutral: {
            main: "#64748B",
          },
          bg: {
            main: "#grey[300]",
          },

          favColor: {
            main: grey[800],
          },
          text: {
            primary: "#fff",
          },
          MyColor:{
            main: "#252B32"
          }
        }),
  },
});

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

// New: getThemeWithDirection for RTL and font
export const getThemeWithDirection = (mode, direction, language) => {
  return createTheme({
    ...getDesignTokens(mode),
    direction,
    typography: {
      fontFamily: language === 'ar' ? 'Cairo, Arial, sans-serif' : 'inherit',
    },
  });
};

export const useMode = () => {
  const [mode, setMode] = useState(
    localStorage.getItem("mode") ? localStorage.getItem("mode") : "dark"
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return [theme, colorMode, mode];
};