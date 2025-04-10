import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
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
<footer className="footer">
  <div className="footer-links">
    <NavLink
      to="/imprint"
      className={({ isActive }) => isActive ? "footer-link active" : "footer-link"}
    >
      Imprint
    </NavLink>
    <NavLink
      to="/privacy-policy"
      className={({ isActive }) => isActive ? "footer-link active" : "footer-link"}
    >
      Privacy Policy
    </NavLink>
  </div>
</footer>
  );
}
