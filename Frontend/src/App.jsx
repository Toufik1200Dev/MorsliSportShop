import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

import Header1 from "./components/header/Header1";
import ScrollToTop from "./scroll/ScrollToTop";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Lazy load components for code splitting
const SportHome = lazy(() => import("./components/SportHome"));
const Contact = lazy(() => import("./components/Contact"));
const ClientReviews = lazy(() => import("./components/ClientReviews"));
const ProductDetailsPage = lazy(() => import("./components/main/ProductDetailsPage"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const ProductsManagement = lazy(() => import("./components/admin/ProductsManagement"));
const OrdersManagement = lazy(() => import("./components/admin/OrdersManagement"));
const Footer = lazy(() => import("./components/footer/Footer"));

// Loading component with Tailwind CSS
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[50vh] bg-gradient-to-br from-black via-gray-900 to-black">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
    </div>
  </div>
);

function App() {
  const { currentLanguage } = useLanguage();
  const direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';

  // Set body class for Arabic font and direction
  useEffect(() => {
    if (currentLanguage === 'ar') {
      document.body.classList.add('arabic-font');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.body.classList.remove('arabic-font');
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', currentLanguage);
    }
  }, [currentLanguage]);

  // Order cleanup is now handled by backend automatically

  return (
    <AdminAuthProvider>
      <div 
        className="min-h-screen bg-black"
        dir={direction}
        lang={currentLanguage}
        style={{ fontFamily: currentLanguage === 'ar' ? 'Cairo, Arial, sans-serif' : 'inherit' }}
      >
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="products" element={<ProductsManagement />} />
                <Route path="orders" element={<OrdersManagement />} />
                <Route index element={<ProductsManagement />} />
              </Route>

              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <div className="min-h-screen bg-black">
                    <Header1 />
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<SportHome />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/avis-client" element={<ClientReviews />} />
                        <Route path="/product/:productId" element={<ProductDetailsPage />} />
                      </Routes>
                    </Suspense>
                    <Suspense fallback={null}>
                      <Footer />
                    </Suspense>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </AdminAuthProvider>
  );
}

export default App;
