import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/pushAndPullLogoSmall.svg";
import ProfileIcon from "../../assets/icons/profile-icon.svg";

import "./Navbar.css";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Verhindert, dass der Klick `closeDropdown` triggert
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = (e) => {
    if (!e.target.closest(".profile-menu") && !e.target.closest(".profile-icon")) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={Logo} alt="Push&Pull Logo" />
      </div>
      <div className="nav-profile">
        <img src={ProfileIcon} alt="Profile" className="profile-icon" onClick={toggleDropdown} />
        {dropdownOpen && (
          <div className="profile-menu">
            <Link to="/edit-profile" className="profile-menu-item">Edit Profile</Link>
            <button className="profile-menu-item logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
