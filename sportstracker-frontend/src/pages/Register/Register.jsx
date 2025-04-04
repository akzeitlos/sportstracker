import { useState } from "react";
import axios from "axios";
import Logo from '../../assets/logo/pushAndPullLogo.svg';
import "./Register.css";  // Importiere das CSS für Styling

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", { firstname, lastname, username, email, password });
      alert("Registrierung erfolgreich! Jetzt einloggen.");
      window.location.href = "/";
    } catch (err) {
      alert("Fehler: " + err.response.data.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <img className="login-logo" src={Logo} alt="Push&Pull Logo" />
        <h2>Sign up</h2>
        <input type="text" placeholder="First name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        <input type="text" placeholder="Last name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
