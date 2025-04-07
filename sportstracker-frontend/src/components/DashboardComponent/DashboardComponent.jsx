import { useState, useEffect } from "react";
import "./DashboardComponent.css";

export default function DashboardComponent({ type }) {
  const [stats, setStats] = useState([]); // Alle Statistiken des Benutzers
  const [maxReps, setMaxReps] = useState(0); // Maximalwert für den gewählten Typ
  const [totalReps, setTotalReps] = useState(0); // Gesamt-Reps für den gewählten Typ
  const [loading, setLoading] = useState(true);

  // Dynamische Basis-URL für die API je nach Umgebung
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";  // Falls keine Umgebungsvariable gesetzt ist, verwende localhost

  // Hole die Benutzerdaten und Stats
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/api/user/stats`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Find the stats for the selected type
        const typeStats = data.find((statGroup) => statGroup.type === type);

        if (typeStats) {
          setStats(typeStats.stats); // Set stats for the selected type
          setMaxReps(typeStats.maxReps); // Set max reps for the selected type
          setTotalReps(typeStats.totalReps); // Set total reps for the selected type
        }else {
            // If no stats for the selected type, reset stats to empty
            setStats([]);
            setMaxReps(0);
            setTotalReps(0);
          }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setLoading(false);
      });
  }, [type]); // Use the type as a dependency to refetch when it changes

  return (
    <div className="dashboard">
      <h2>{type} Dashboard</h2>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="stats-container">
          <ul>
            {stats.length > 0 ? (
              stats.map((stat, index) => (
                <li key={index} className="activity-item">
                  <span className="date">
                    {new Date(stat.date).toLocaleDateString()} {/* Formatierte Datumsausgabe */}
                  </span>
                  <span className="sets-reps">
                    {stat.sets} Sets x {stat.reps} Reps
                  </span>
                  <span className="total">
                    Total Reps: {stat.total_reps}
                  </span>
                </li>
              ))
            ) : (
              <p>No stats available for {type}.</p>
            )}
          </ul>
          <div className="total-reps">
            <p>All Time Reps: {totalReps}</p> {/* Gesamt-Reps für den gewählten Typ */}
          </div>
          <div className="max-reps">
            <p>Max Reps in one set: {maxReps}</p> {/* Max Reps für den gewählten Typ */}
          </div>
        </div>
      )}
    </div>
  );
}
