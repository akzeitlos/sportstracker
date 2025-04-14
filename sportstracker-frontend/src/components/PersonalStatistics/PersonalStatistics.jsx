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
  const [swipedIndex, setSwipedIndex] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  let touchStartX = 0;

  const getLabel = (label) => {
    if (window.innerWidth <= 480) {
      switch (label) {
        case "alltime": return "All";
        case "month": return "M";
        case "week": return "W";
        case "day": return "D";
        case "year": return "Y";
        default: return label;
      }
    }
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const fetchStats = () => {
    const token = localStorage.getItem("token");
    const url = `${apiUrl}/user/stats?range=${range}`;

    setLoading(true);
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 400) {
            console.warn("Unauthorized or invalid token. Redirecting to login...");
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
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
        setDetailsOpen(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching personal stats:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, [type, range]);

  const handleTouchStart = (e, index) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e, index) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;
    if (delta > 50) {
      setSwipedIndex(index);
    } else if (delta < -50) {
      setSwipedIndex(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.innerWidth >= 801) {
      const confirmDelete = window.confirm("Do you really want to delete this activity?");
      if (!confirmDelete) return;
    }
  
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiUrl}/activity/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete activity");
      }
  
      setStats(prev => prev.filter(stat => stat.id !== id));
    } catch (err) {
      console.error("Failed to delete activity:", err);
      alert("Could not delete the activity. Please try again.");
    }
  };
  

  return (
    <div className="personalStatistics">
      <h2>{type} Statistics</h2>

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
                    <li
                    key={stat.id}
                    className="activity-item"
                    onTouchStart={(e) => handleTouchStart(e, index)}
                    onTouchEnd={(e) => handleTouchEnd(e, index)}
                  >
                    <div className="swipe-wrapper">
                      <div className={`swipeable-content ${swipedIndex === index ? "swiped" : ""}`}>
                        <span className="date">
                          {new Date(stat.date).toLocaleDateString()}
                        </span>
                        <span className="sets-reps">
                          {stat.sets} x {stat.reps} Reps
                        </span>
                        <span className="totalcount">Total: {stat.total_reps}</span>
                      </div>
                  
                      <div className="delete-background">
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(stat.id)}
                          aria-label="Delete activity"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            width="24"
                            height="24"
                            fill="white"
                          >
                            <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
                        </button>
                      </div>
                    </div>
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
