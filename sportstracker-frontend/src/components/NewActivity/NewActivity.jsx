import { useState, useEffect } from "react";
import CircularSwipeCounter from "../CircularSwipeCounter/CircularSwipeCounter";
import "./NewActivity.css";

export default function NewActivity({ type }) {
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [total, setTotal] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setTotal(sets * reps);
  }, [sets, reps]);

  const handleSave = () => {
    const parsedSets = parseInt(sets);
    const parsedReps = parseInt(reps);
  
    if (
      isNaN(parsedSets) || isNaN(parsedReps) ||
      parsedSets < 1 || parsedReps < 1
    ) {
      setSuccessMessage("Please enter valid Sets and Reps greater than 0.");
      return;
    }
  
    const calculatedTotal = parsedSets * parsedReps;
  
    const activity = {
      type,
      sets: parsedSets,
      reps: parsedReps,
      total: calculatedTotal,
      date: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
  
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
    fetch(`${apiUrl}/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(activity),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 400) {
            // 🛑 Unauthorized → redirect
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSuccessMessage("Activity saved successfully!");
        setSets(0);
        setReps(0);
        setTotal(0);
      })
      .catch((error) => {
        console.error("Error saving activity:", error);
        setSuccessMessage("Failed to save activity. Please try again.");
      });
  };
  

  return (
    <div className="new-activity">
      <h2>New {type} Activity</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="fields-container">
  <div className="sets-counter">
    <CircularSwipeCounter label="Sets" value={sets} onChange={setSets} min={0} max={10} />
  </div>

  <div className="total-field">
    <label className="total">Total: {total}</label>
  </div>

  <div className="reps-counter">
    <CircularSwipeCounter label="Reps" value={reps} onChange={setReps} min={0} max={50} />
  </div>
</div>

      <button onClick={handleSave}>Save Activity</button>
    </div>
  );
}
