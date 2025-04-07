import { useState } from "react";
import axios from "axios";
import Logo from '../../assets/logo/pushAndPullLogo.svg';

import './Login.css';  // Importiere die CSS-Datei für das Styling

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState(""); // Kann E-Mail oder Benutzername sein
  const [password, setPassword] = useState("");

  // Dynamische Basis-URL für die API je nach Umgebung
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";  // Falls keine Umgebungsvariable gesetzt ist, verwende localhost

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/login`, { emailOrUsername, password });
      localStorage.setItem("token", res.data.token);
      alert("Login erfolgreich!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Fehler: " + err.response.data.message);
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = '/register';  // Verwende window.location.href für die Navigation zur Registrierungsseite
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img className="login-logo" src={Logo} alt="Push&Pull Logo" />
        <p className="slogan">Push your limits &<br/>Pull your potential!</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign in</button>
        </form>
        {/* Registrierungsbutton */}
        <button className="register-button" onClick={handleRegisterRedirect}>
        Not registered yet? Sign up
        </button>
      </div>
    </div>
  );
}
