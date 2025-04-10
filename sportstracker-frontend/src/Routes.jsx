import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Impressum from "./pages/Impressum/Impressum";
import Datenschutz from "./pages/Datenschutz/Datenschutz";
import Dashboard from "./pages/Dashboard/Dashboard"; 
import EditProfile from "./pages/EditProfile/EditProfile"; 
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx"; 

export default function AppRoutes() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      {/* Öffentliche Seiten */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/imprint"
        element={<Impressum />}
      />
            <Route
        path="/privacy-policy"
        element={<Datenschutz />}
      />

      {/* Geschützte Seiten */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}
