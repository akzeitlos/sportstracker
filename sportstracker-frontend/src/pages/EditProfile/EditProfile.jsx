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

  // Dynamische Basis-URL für die API je nach Umgebung
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";  // Falls keine Umgebungsvariable gesetzt ist, verwende localhost

  useEffect(() => {
    // Lade die aktuellen Benutzerdaten
    axios.get("${apiUrl}/api/user", {
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
      alert("Failed to load profile information.");
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Check if no changes were made to avoid unnecessary API calls
    if (firstname === "" || lastname === "" || username === "" || email === "") {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // Sende die aktualisierten Benutzerdaten an das Backend
      await axios.put("${apiUrl}/api/user/update", 
        { firstname, lastname, username, email, password },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Profile updated successfully!");
      window.location.href = "/dashboard"; // Zurück zum Dashboard
    } catch (err) {
      alert("Error: " + err.response.data.message); // Fehlerbehandlung
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleUpdate}>
        <img className="login-logo" src={Logo} alt="Push&Pull Logo" />
        <h2>Edit Profile</h2>

        <div className="form-group">
          <label htmlFor="firstname">First name</label>
          <input 
            type="text" 
            id="firstname"
            placeholder="First name" 
            value={firstname} 
            onChange={(e) => setFirstname(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last name</label>
          <input 
            type="text" 
            id="lastname"
            placeholder="Last name" 
            value={lastname} 
            onChange={(e) => setLastname(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username"
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">New password (leave empty to keep current)</label>
          <input 
            type="password" 
            id="password"
            placeholder="New password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
