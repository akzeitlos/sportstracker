// controllers/activityController.js
import db from '../config/db.js'; // db = createPool().promise()

// Aktivität speichern
export const createActivity = async (req, res) => {
  const { type, sets, reps, total, date } = req.body;
  const userId = req.user.userId;

  console.log('Received data:', req.body);

  if (!type || !sets || !reps || !total || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = `
    INSERT INTO activities (type, sets, reps, total, user_id, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    console.log('Executing query:', query);
    const [result] = await db.query(query, [type, sets, reps, total, userId, date]);

    console.log('Activity saved, ID:', result.insertId);

    res.status(200).json({
      message: 'Activity saved successfully',
      activityId: result.insertId,
    });
  } catch (err) {
    console.error("Error saving activity:", err);
    res.status(500).json({ message: 'Error saving activity' });
  }
};

// User Stats abrufen
export const getUserStats = async (req, res) => {
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
    default:
      break;
  }

  const query = `
    SELECT id, type, sets, reps, date
    FROM activities
    WHERE user_id = ?
    ${dateCondition}
  `;

  try {
    const [results] = await db.query(query, [userId]);

    const groupedStats = results.reduce((acc, activity) => {
      if (!acc[activity.type]) acc[activity.type] = [];
      acc[activity.type].push(activity);
      return acc;
    }, {});

    const stats = Object.keys(groupedStats).map(type => {
      const activities = groupedStats[type];
      const typeStats = activities.map(a => ({
        id: a.id,
        sets: a.sets,
        reps: a.reps,
        total_reps: a.sets * a.reps,
        date: a.date,
      }));

      const maxReps = Math.max(...activities.map(a => a.reps));
      const totalReps = typeStats.reduce((sum, s) => sum + s.total_reps, 0);

      return { type, totalReps, maxReps, stats: typeStats };
    });

    res.status(200).json(stats);
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Error fetching user stats' });
  }
};

// Leaderboard abrufen
export const getLeaderboardStats = async (req, res) => {
  const { range = 'alltime', type = null } = req.query;

  let conditions = [];
  let params = [];

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
    default:
      break;
  }

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

  try {
    const [results] = await db.query(query, params);

    const groupedByUser = results.reduce((acc, activity) => {
      const userId = activity.user_id;
      const activityTotal = activity.sets * activity.reps;

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          username: activity.username,
          firstname: activity.firstname,
          lastname: activity.lastname,
          totalReps: 0,
        };
      }

      acc[userId].totalReps += activityTotal;
      return acc;
    }, {});

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
  } catch (err) {
    console.error('Error fetching leaderboard stats:', err);
    res.status(500).json({ message: 'Error fetching leaderboard stats' });
  }
};

// Aktivität löschen
export const deleteActivity = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Missing activity ID' });
  }

  const query = `
    DELETE FROM activities 
    WHERE id = ? AND user_id = ?
  `;

  try {
    const [result] = await db.query(query, [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activity not found or not authorized' });
    }

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).json({ message: 'Error deleting activity' });
  }
};
