import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode, getThemeWithDirection } from "./theme";
import { useEffect } from "react";

import Header1 from "./components/header/Header1";
import Header2 from "./components/header/Header2";
import Header3 from "./components/header/Header3";
import Hero from "./components/hero/Hero";
import Main from "./components/main/Main";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./scroll/ScrollToTop";
import ProductDetailsPage from "./components/main/ProductDetailsPage";

import { LanguageProvider, useLanguage } from "./LanguageContext";
import SportHome from "./components/SportHome";
import Contact from "./components/Contact";
import ClientReviews from "./components/ClientReviews";

// @ts-ignore
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:1337";

function App() {
  const [theme, colorMode, mode] = useMode();
  const { currentLanguage } = useLanguage();
  const direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  const themed = getThemeWithDirection(mode, direction, currentLanguage);

  useEffect(() => {
    const keepAlive = () => {
      fetch(`${API_URL.replace(/\/$/, '')}/api/products`) // A lightweight endpoint
        .then(res => {
          if (res.ok) {
            // Backend is awake and responding
          } else {
            // Backend ping failed, server might be down or sleeping
          }
        })
        .catch(err => {
          // Error pinging backend
        });
    };

    const intervalId = setInterval(keepAlive, 300000); // 5 minutes
    keepAlive(); // Initial ping

    return () => clearInterval(intervalId);
  }, []);

  // Set body class for Arabic font
  useEffect(() => {
    if (currentLanguage === 'ar') {
      document.body.classList.add('arabic-font');
    } else {
      document.body.classList.remove('arabic-font');
    }
  }, [currentLanguage]);

  return (
    <LanguageProvider>
      <ColorModeContext.Provider
        // @ts-ignore
        value={colorMode}
      >
        <ThemeProvider
          // @ts-ignore
          theme={themed}
        >
          <CssBaseline />
          <BrowserRouter>
            <ScrollToTop />
            <Box
              sx={{
                bgcolor:
                  // @ts-ignore
                  themed.palette.bg.main,
                direction,
                fontFamily: currentLanguage === 'ar' ? 'Cairo, Arial, sans-serif' : 'inherit',
              }}
            >
              <Header1 />
              <Header2 />
              <Header3 />
              <Routes>
                <Route path="/" element={<SportHome />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/avis-client" element={<ClientReviews />} />
                <Route path="/product/:productId" element={<ProductDetailsPage />} />
              </Routes>
              <Footer />
            </Box>
          </BrowserRouter>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LanguageProvider>
  );
}

export default App;
