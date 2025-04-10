import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./Routes";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import backgroundImage from "./assets/images/login-background.jpg"; // falls genutzt
import "./App.css";

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const hideNavbarRoutes = ["/login", "/register", "/imprint", "privacy-policy"];
  const isLoggedIn = !!token;
  const showNavbar = isLoggedIn && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <AppRoutes />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
