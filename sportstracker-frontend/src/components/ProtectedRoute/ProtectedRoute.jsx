import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Überprüfen, ob der Benutzer eingeloggt ist (Token vorhanden)
  if (!token) {
    // Wenn kein Token vorhanden, zum Login weiterleiten
    return <Navigate to="/" />;
  }

  return children; // Wenn der Benutzer eingeloggt ist, zeige die Kinder-Komponente
}

export default ProtectedRoute;