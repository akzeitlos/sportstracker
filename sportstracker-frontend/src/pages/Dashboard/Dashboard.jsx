import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NewActivity from "../../components/NewActivity/NewActivity.jsx";
import DashboardComponent from "../../components/DashboardComponent/DashboardComponent.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeContent, setActiveContent] = useState("dashboard"); // Steuerung des Content-Bereichs (Dashboard oder NewActivity)
  const [activeType, setActiveType] = useState("Pushup"); // Setzen des Initialwerts für den Typ

  // Funktion für die Auswahl der Inhalte im Dashboard
  const handleContentChange = (type, contentType) => {
    setActiveType(type); // Setzt den Typ (Pushup oder Pullup)
    setActiveContent(contentType); // Setzt die Content-Komponente: "dashboard" oder "newActivity"
  };

  return (
    <div>
      <Navbar />
      
      {/* Buttons oben über dem Dashboard */}
      <div className="dashboard-buttons">
        <button
          className={activeType === "Pushup" ? "active" : ""}
          onClick={() => handleContentChange("Pushup", "dashboard")}
        >
          Pushups
        </button>
        <button
          className={activeType === "Pullup" ? "active" : ""}
          onClick={() => handleContentChange("Pullup", "dashboard")}
        >
          Pullups
        </button>
      </div>
      
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          {/* Sidebar */}
          <div className="sidebar">
            <ul className="menu">
              <li>
                <button
                  className={activeContent === "dashboard" ? "active" : ""}
                  onClick={() => handleContentChange(activeType, "dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className={activeContent === "newActivity" ? "active" : ""}
                  onClick={() => handleContentChange(activeType, "newActivity")}
                >
                  New Activity
                </button>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="content">
            {activeContent === "dashboard" && <DashboardComponent type={activeType} />}
            {activeContent === "newActivity" && <NewActivity type={activeType} />}
          </div>
        </div>
      </div>
    </div>
  );
}
