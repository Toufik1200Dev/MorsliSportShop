import Hero from "./components/hero/Hero";
import Header1 from "./components/header/Header1";
import Header3 from "./components/header/Header3";
import { useMode, ColorModeContext } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Main from "./components/main/Main";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./scroll/ScrollToTop";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Cart from "./components/main/Cart";
import OrderForm from "./components/main/OrderForm";
import Contact from "./components/Contact";
import { LanguageProvider } from "./LanguageContext";
import SportHome from "./components/SportHome";
import ClientReviews from "./components/ClientReviews";

// Component to conditionally render Header3
function HeaderWrapper() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header1 />
      <Header3 />
    </>
  );
}

function App() {
  const [theme, colorMode] = useMode();

  return (
    <LanguageProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <HeaderWrapper />
            <Box sx={{ bgcolor: "background.default" }}>
              <Routes>
                <Route path="/" element={<SportHome />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<OrderForm />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/avis-client" element={<ClientReviews />} />
              </Routes>
            </Box>
            <Footer />
            <ScrollToTop />
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LanguageProvider>
  );
}

export default App;
