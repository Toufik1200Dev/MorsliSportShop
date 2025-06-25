import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { useEffect } from "react";

import Header1 from "./components/header/Header1";
import Header2 from "./components/header/Header2";
import Header3 from "./components/header/Header3";
import Hero from "./components/hero/Hero";
import Main from "./components/main/Main";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./scroll/ScrollToTop";
import Cart from "./components/main/Cart";
import OrderForm from "./components/main/OrderForm";

import { LanguageProvider } from "./LanguageContext";
import SportHome from "./components/SportHome";
import Contact from "./components/Contact";
import ClientReviews from "./components/ClientReviews";

// @ts-ignore
const API_URL = import.meta.env.VITE_BASE_URL || "https://morsli-sport-shop.onrender.com";

function App() {
  const [theme, colorMode] = useMode();

  useEffect(() => {
    const keepAlive = () => {
      fetch(`${API_URL}/api/products`) // A lightweight endpoint
        .then(res => {
          if (res.ok) {
            console.log('Backend ping successful, server is awake.');
          } else {
            console.error('Backend ping failed, server might be down or sleeping.', res.status);
          }
        })
        .catch(err => {
          console.error('Error pinging backend:', err);
        });
    };

    const intervalId = setInterval(keepAlive, 300000); // 5 minutes
    keepAlive(); // Initial ping

    return () => clearInterval(intervalId);
  }, []);

  return (
    <LanguageProvider>
      <ColorModeContext.Provider
        // @ts-ignore
        value={colorMode}
      >
        <ThemeProvider
          // @ts-ignore
          theme={theme}
        >
          <CssBaseline />
          <BrowserRouter>
            <ScrollToTop />
            <Box
              sx={{
                bgcolor:
                  // @ts-ignore
                  theme.palette.bg.main,
              }}
            >
              <Header1 />
              <Header2 />
              <Header3 />
              <Routes>
                <Route path="/" element={<SportHome />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<OrderForm />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/avis-client" element={<ClientReviews />} />
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
