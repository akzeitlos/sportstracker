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
  const userId = req.user.userId;
  const { range = 'alltime' } = req.query;

  let dateCondition = '';
  switch (range) {
    case 'day':
      dateCondition = "AND DATE(date) = CURDATE()";
      break;
    case 'week':
      dateCondition = "AND YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)";
      break;
    case 'month':
      dateCondition = "AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())";
      break;
    case 'year':
      dateCondition = "AND YEAR(date) = YEAR(CURDATE())";
      break;
    case 'alltime':
    default:
      break;
  }

  const query = `
    SELECT id, type, sets, reps, date
    FROM activities
    WHERE user_id = ?
    ${dateCondition}
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user stats:', err);
      return res.status(500).json({ message: 'Error fetching user stats' });
    }

    const groupedStats = results.reduce((acc, activity) => {
      if (!acc[activity.type]) {
        acc[activity.type] = [];
      }
      acc[activity.type].push(activity);
      return acc;
    }, {});

    const stats = Object.keys(groupedStats).map(type => {
      const activities = groupedStats[type];

      const typeStats = activities.map(activity => ({
        id: activity.id,
        sets: activity.sets,
        reps: activity.reps,
        total_reps: activity.sets * activity.reps,
        date: activity.date,
      }));

      const maxReps = activities.reduce((max, a) => Math.max(max, a.reps), 0);
      const totalReps = typeStats.reduce((sum, s) => sum + s.total_reps, 0);

      return {
        type,
        totalReps,
        maxReps,
        stats: typeStats
      };
    });

    res.status(200).json(stats);
  });
};



export const getLeaderboardStats = (req, res) => {
  const { range = 'alltime', type = null } = req.query;

  let conditions = [];
  let params = [];

  // Zeitbereichsbedingung
  switch (range) {
    case 'day':
      conditions.push("DATE(a.date) = CURDATE()");
      break;
    case 'week':
      conditions.push("YEARWEEK(a.date, 1) = YEARWEEK(CURDATE(), 1)");
      break;
    case 'month':
      conditions.push("MONTH(a.date) = MONTH(CURDATE()) AND YEAR(a.date) = YEAR(CURDATE())");
      break;
    case 'year':
      conditions.push("YEAR(a.date) = YEAR(CURDATE())");
      break;
    case 'alltime':
    default:
      break;
  }

  // Aktivitäts-Typ
  if (type) {
    conditions.push("a.type = ?");
    params.push(type);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : '';

  const query = `
    SELECT 
      a.user_id, a.type, a.sets, a.reps,
      u.username, u.firstname, u.lastname
    FROM activities a
    JOIN users u ON a.user_id = u.id
    ${whereClause}
  `;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching leaderboard stats:', err);
      return res.status(500).json({ message: 'Error fetching leaderboard stats' });
    }

    // Gruppieren nach Benutzer
    const groupedByUser = results.reduce((acc, activity) => {
      const userId = activity.user_id;
      const activityTotal = activity.sets * activity.reps;

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          username: activity.username,
          firstname: activity.firstname,
          lastname: activity.lastname,
          totalReps: 0
        };
      }

      acc[userId].totalReps += activityTotal;
      return acc;
    }, {});

    // Leaderboard sortieren & kürzen
    const leaderboard = Object.values(groupedByUser)
      .sort((a, b) => b.totalReps - a.totalReps)
      .slice(0, 10)
      .map(user => ({
        userId: user.userId,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        totalReps: user.totalReps,
        type
      }));

    res.status(200).json(leaderboard);
  });
};

// Aktivität löschen
export const deleteActivity = (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Missing activity ID' });
  }

  const query = `
    DELETE FROM activities 
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [id, userId], (err, result) => {
    if (err) {
      console.error('Error deleting activity:', err);
      return res.status(500).json({ message: 'Error deleting activity' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activity not found or not authorized' });
    }

    res.status(200).json({ message: 'Activity deleted successfully' });
  });
};
