import { useState, useEffect } from "react";
import "./NewActivity.css";


export default function NewActivity({ type }) {
  const [sets, setSets] = useState(""); // Initialer Wert: Bitte auswählen
  const [reps, setReps] = useState(""); // Initialer Wert: Bitte auswählen
  const [total, setTotal] = useState(0); // Gesamtzahl startet bei 0
  const [successMessage, setSuccessMessage] = useState(""); // Erfolgsmeldung

  // Berechnet die Gesamtzahl, wenn Sets und Reps geändert werden
  const calculateTotal = () => {
    if (sets && reps) {
      return sets * reps;
    }
    return 0; // Wenn keine gültigen Werte, Gesamtzahl bleibt 0
  };

  useEffect(() => {
    // Wenn Sets oder Reps geändert werden, die Gesamtzahl neu berechnen
    setTotal(calculateTotal());
  }, [sets, reps]);

  // Funktion zum Erstellen der Optionen für die Select-Felder
  const createOptions = (max) => {
    let options = [];
    for (let i = 1; i <= max; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  const handleSetsChange = (e) => {
    setSets(e.target.value);
  };

  const handleRepsChange = (e) => {
    setReps(e.target.value);
  };

  const handleSave = () => {
    const calculatedTotal = sets && reps ? sets * reps : 0; // Berechneter Gesamtwert
  
    const activity = {
      type,
      sets: parseInt(sets),
      reps: parseInt(reps),
      total: calculatedTotal,
      date: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formatierung für MySQL DATETIME
    };
  
    // Dynamische Basis-URL für die API je nach Umgebung
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";  // Falls keine Umgebungsvariable gesetzt ist, verwende localhost

    // API-Aufruf an das Backend
    fetch(`${apiUrl}/activity`, {  // Backend-URL hier
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(activity),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setSuccessMessage("Activity saved successfully!");
        setSets("");
        setReps("");
        setTotal(0);
      })
      .catch((error) => {
        console.error("Error saving activity:", error);
        setSuccessMessage(""); // Erfolgsmeldung zurücksetzen bei Fehler
      });
  };

  return (
    <div className="new-activity">
      <h2>New {type} Activity</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="fields-container">
        <div className="select-field">
          <label htmlFor="sets">Sets:</label>
          <select id="sets" value={sets} onChange={handleSetsChange}>
            <option value="">Please select</option>
            {createOptions(10)} {/* Optionen bis 10 */}
          </select>
        </div>

        <div className="select-field">
          <label htmlFor="reps">Reps:</label>
          <select id="reps" value={reps} onChange={handleRepsChange}>
            <option value="">Please select</option>
            {createOptions(50)} {/* Optionen bis 10 */}
          </select>
        </div>

        <div className="select-field">
          <label htmlFor="total">Total:</label>
          <input
            id="total"
            type="text"
            value={total} // Zeigt die berechnete Gesamtzahl an
            disabled
          />
        </div>
      </div>

      <button onClick={handleSave}>Save Activity</button>
    </div>
  );
}
