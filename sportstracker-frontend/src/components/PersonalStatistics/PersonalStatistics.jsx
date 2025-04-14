import { useState, useEffect } from "react";
import "./PersonalStatistics.css";

const timeRanges = ["day", "week", "month", "year", "alltime"];

export default function PersonalStatistics({ type }) {
  const [range, setRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [totalReps, setTotalReps] = useState(0);
  const [maxReps, setMaxReps] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = `${apiUrl}/user/stats?range=${range}`;

    setLoading(true);
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find((d) => d.type === type);

        if (selected) {
          setStats(selected.stats);
          setTotalReps(selected.totalReps);
          setMaxReps(selected.maxReps);
        } else {
          setStats([]);
          setTotalReps(0);
          setMaxReps(0);
        }

        setDetailsOpen(false); // reset collapse on range/type change
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching personal stats:", err);
        setLoading(false);
      });
  }, [type, range]);

  return (
    <div className="personalStatistics">
      <h2>{type} Statistics</h2>

      {/* Range Switcher */}
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
        <p>Loading...</p>
      ) : (
        <>
          <section className="summary-section">
            <div className="total-reps">Total Reps: {totalReps}</div>
            <div className="max-reps">Max Reps in one set: {maxReps}</div>
          </section>

          <section className={`details-section ${detailsOpen ? "details-open" : ""}`}>
  {stats.length > 0 && (
    <button
      className={`toggle-btn ${detailsOpen ? "open" : ""}`}
      onClick={() => setDetailsOpen(!detailsOpen)}
    >
      {detailsOpen ? "Hide Details" : "Show Details"}
    </button>
  )}

  {detailsOpen && stats.length > 0 && (
    <div className="stats-container open">
      <ul>
        {stats.map((stat, index) => (
          <li key={index} className="activity-item">
            <span className="date">
              {new Date(stat.date).toLocaleDateString()}
            </span>
            <span className="sets-reps">
              {stat.sets} x {stat.reps} Reps
            </span>
            <span className="totalcount">Total: {stat.total_reps}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</section>
        </>
      )}
    </div>
  );
}
