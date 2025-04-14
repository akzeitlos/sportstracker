import { useEffect, useState } from "react";
import "./DashboardComponent.css";

const timeRanges = ["day", "week", "month", "year", "alltime"];

export default function DashboardComponent({ type }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [range, setRange] = useState("week"); // Default time range
  const [loading, setLoading] = useState(true);
 
  const getLabel = (label) => {
    if (window.innerWidth <= 480) {
      // Shorten for mobile
      switch (label) {
        case "alltime":
          return "All";
        case "month":
          return "M";
        case "week":
          return "W";
        case "day":
          return "D";
        case "year":
          return "Y";
        default:
          return label;
      }
    }
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = `${apiUrl}/leaderboard?range=${range}&type=${type}`;

    setLoading(true);
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeaderboard(data);
        } else {
          console.warn("Leaderboard response was not an array:", data);
          setLeaderboard([]); // fallback to empty
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leaderboard:", err);
        setLeaderboard([]);
        setLoading(false);
      });
  }, [range, type]);

  return (
    <div className="dashboard leaderboard">
      <h2>🏆 {type} Leaderboard</h2>

      {/* Time Range Switcher */}
      <div className="range-switcher">
      {timeRanges.map((r) => (
          <button
            key={r}
            className={`range-btn ${range === r ? "active" : ""}`}
            onClick={() => setRange(r)}
          >
            {getLabel(r)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p class="no-data">
          No leaderboard data available for {type} -{" "}
          {range.charAt(0).toUpperCase() + range.slice(1)}.
        </p>
      ) : (
        <ul className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <li key={user.userId} className="leaderboard-item">
              <span className="rank">#{index + 1}</span>
              <div className="user-info">
                <strong>
                  {user.firstname} {user.lastname}
                </strong>{" "}
                (@{user.username})
              </div>
              <div className="reps-info">{user.totalReps} total reps</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
