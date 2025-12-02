// app.jsx
import React, { useContext, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { UserContext, UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/Themecontext";
import { LanguageProvider } from "./context/LanguageContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import BasketPage from "./pages/BasketPage";  // ✅ IMPORT BASKETPAGE

import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import UserProfileTabs from "./pages/UserProfileTabs";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import HistoryPage from "./pages/HistoryPage";

function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] p-4 transition-colors">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function PrivateRoute({ children }) {
  const { user, isLoading } = useContext(UserContext);
  const location = useLocation();

  if (isLoading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}

function AppRoutes() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === "/login") {
      if (location.state?.from) {
        navigate(location.state.from.pathname || location.state.from, { replace: true });
      } else if (user.role === "admin") {
        navigate("/products", { replace: true });
      }
    }
  }, [user, navigate, location.pathname, location.state]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        
        {/* ✅ NOUVEAU FLUX PANIER (remplace OrderPage) */}
        <Route path="basket" element={<PrivateRoute><BasketPage /></PrivateRoute>} />
        
        <Route path="profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        <Route path="products/profile" element={<PrivateRoute><UserProfileTabs /></PrivateRoute>} />

        <Route path="login" element={<AuthPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* ✅ PAIEMENT & CONFIRMATION */}
        <Route path="payment/:orderId" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="confirmation/:orderId" element={<PrivateRoute><ConfirmationPage /></PrivateRoute>} />
        <Route path="history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        
        {/* ✅ SUPPRIMÉ OrderPage - remplacé par Basket */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
