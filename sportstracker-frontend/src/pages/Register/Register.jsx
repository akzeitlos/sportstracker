import { useState } from "react";
import axios from "axios";
import Logo from '../../assets/logo/pushAndPullLogo.svg';
import "./Register.css";

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({}); // vorherige Fehler löschen
  
    try {
      await axios.post(`${apiUrl}/register`, {
        firstname,
        lastname,
        username,
        email,
        password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      window.location.href = "/";
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
  
      if (backendErrors) {
        if (!backendErrors.general) {
          backendErrors.general = "Please check the fields.";
        }
        setErrors(backendErrors);
        return;
      }
  
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <img className="login-logo" src={Logo} alt="Push&Pull Logo" />
        <h2>Sign up</h2>

        {errors.general && (
          <div className="form-error" role="alert">
            <strong>Oops!</strong> {errors.general}
          </div>
        )}

        <div className="form-group">
          <input
            type="text"
            placeholder="First name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className={errors.firstname ? "input-error" : ""}
          />
          {errors.firstname && <small className="error-text">{errors.firstname}</small>}
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className={errors.lastname ? "input-error" : ""}
          />
          {errors.lastname && <small className="error-text">{errors.lastname}</small>}
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "input-error" : ""}
          />
          {errors.username && <small className="error-text">{errors.username}</small>}
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <small className="error-text">{errors.password}</small>}
        </div>

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
