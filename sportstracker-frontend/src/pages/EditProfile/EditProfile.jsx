import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../../assets/logo/pushAndPullLogo.svg";
import "./EditProfile.css";

export default function EditProfile() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${apiUrl}/user`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((response) => {
      setFirstname(response.data.firstname);
      setLastname(response.data.lastname);
      setUsername(response.data.username);
      setEmail(response.data.email);
    })
    .catch((error) => {
      console.error("Error loading user data:", error);
      setErrors({ general: "Failed to load profile information." });
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset previous errors

    if (!firstname || !lastname || !username || !email) {
      setErrors({ general: "Please fill out all fields." });
      return;
    }

    try {
      await axios.put(`${apiUrl}/user/update`, 
        { firstname, lastname, username, email, password },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      window.location.href = "/dashboard";
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
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleUpdate}>
        <img className="login-logo" src={Logo} alt="Push&Pull Logo" />
        <h2>Edit Profile</h2>

        {errors.general && (
          <div className="form-error" role="alert">
            <strong>Oops!</strong> {errors.general}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="firstname">First name</label>
          <input
            type="text"
            id="firstname"
            placeholder="First name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className={errors.firstname ? "input-error" : ""}
          />
          {errors.firstname && <small className="error-text">{errors.firstname}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last name</label>
          <input
            type="text"
            id="lastname"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className={errors.lastname ? "input-error" : ""}
          />
          {errors.lastname && <small className="error-text">{errors.lastname}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "input-error" : ""}
          />
          {errors.username && <small className="error-text">{errors.username}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="password">New password (leave empty to keep current)</label>
          <input
            type="password"
            id="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <small className="error-text">{errors.password}</small>}
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
