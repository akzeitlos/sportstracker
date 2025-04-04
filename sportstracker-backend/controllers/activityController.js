// controllers/activityController.js
import db from '../config/db.js';  // Importiere die DB-Verbindung

// Aktivität speichern
export const createActivity = (req, res) => {
  const { type, sets, reps, total, date } = req.body;
  const userId = req.user.userId; // Benutzer-ID aus dem JWT-Token

  // Logge die empfangenen Daten (Debugging-Zwecke)
  console.log('Received data:', req.body);

  // Validierung
  if (!type || !sets || !reps || !total || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = `
    INSERT INTO activities (type, sets, reps, total, user_id, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Logge die SQL-Abfrage (Debugging-Zwecke)
  console.log('Executing query:', query);

  db.query(query, [type, sets, reps, total, userId, date], (err, result) => {
    if (err) {
      console.error("Error saving activity:", err);
      return res.status(500).json({ message: 'Error saving activity' });
    }

    // Logge das Ergebnis der Abfrage (Debugging-Zwecke)
    console.log('Activity saved, ID:', result.insertId);

    // Antwort zurücksenden
    res.status(200).json({
      message: 'Activity saved successfully',
      activityId: result.insertId,
    });
  });
};


export const getUserStats = (req, res) => {
  console.log(req.user);
  const userId = req.user.userId; // Benutzer-ID aus dem JWT-Token

  const query = `
    SELECT type, sets, reps, date
    FROM activities
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user stats:', err);
      return res.status(500).json({ message: 'Error fetching user stats' });
    }
  
    // Gruppiere die Ergebnisse nach dem Typ der Aktivität
    const groupedStats = results.reduce((acc, activity) => {
      if (!acc[activity.type]) {
        acc[activity.type] = [];
      }
      acc[activity.type].push(activity);
      return acc;
    }, {});
  
    // Erstelle die Stats mit Sets, Reps und Total Reps für jede Aktivität
    const stats = Object.keys(groupedStats).map(type => {
      const activities = groupedStats[type];
  
      // Erstelle die Statistiken für jede Aktivität
      const typeStats = activities.map(activity => ({
        type: activity.type,
        sets: activity.sets,
        reps: activity.reps,
        total_reps: activity.sets * activity.reps, // Gesamt Reps für diese Aktivität
        date: activity.date,
      }));
  
      // Berechne den Maximalwert für Reps pro Aktivitätstyp
      const maxReps = activities.reduce((max, activity) => {
        return activity.reps > max ? activity.reps : max;
      }, 0);
  
      // Berechne die Gesamtzahl der Reps für den jeweiligen Typ
      const totalReps = typeStats.reduce((total, stat) => total + stat.total_reps, 0);
  
      return { type, stats: typeStats, maxReps, totalReps };
    });
  
    // Antwort mit den gruppierten Statistiken und den Maximal- und Gesamtwerten pro Typ
    res.status(200).json(stats);
  });
  
};
