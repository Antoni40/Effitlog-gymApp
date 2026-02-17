import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config() 

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

//idk if it's needed
export async function getUsers() {
  const conn = await pool.getConnection();
  try {
    const [users] = await conn.query("SELECT id, name, surname, emailFROM users");
    return users;
  } finally {
  conn.release();
  }
}

export async function getUser(id){
  const conn = await pool.getConnection();
  try {
    const [user] = await conn.query(`
      SELECT * 
      FROM users 
      WHERE id = ?`, [id]);
    return user.length ? user[0] : null;
  } finally {
    conn.release();
  }
}

export async function createUser(name, surname, email, password){
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`
    INSERT INTO users(name, surname, email, password) 
    VALUES (?, ?, ?, ?)`, [name, surname, email, password]);
    const id = result.insertId;
    
    return getUser(id);
  } finally {
    conn.release();
  }
}

export async function checkUserData(email){
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`
      SELECT * FROM users WHERE email= ?
    `, [email]);

    return result[0];
  } finally {
    conn.release();
  }
}

export async function deleteUser(id){
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`DELETE FROM users WHERE id = ?`, [id]);

    return result;
  } finally {
    conn.release();
  }
}

//needed data are 
// Training date, training exercises
export async function getWorkouts(userId){
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`
    SELECT users_workouts.id AS user_workout_id, users_workouts.workout_date AS workout_date, workouts.name AS workout_name 
    FROM workouts
    INNER JOIN users_workouts 
    ON workouts.id = users_workouts.workout_id
    WHERE users_workouts.user_id = ? AND
    users_workouts.is_completed != true`, [userId]);

    return result;
  } finally {
    conn.release();
  }
}

//exercises in workout
export async function getWorkout(userWorkoutID, userID){
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`
          SELECT exercises.id AS exercise_id ,workouts.name AS workout_name, users_workouts.id AS user_workout_id, workouts.id AS workout_id, workouts.description AS description, exercises_in_workouts.sets AS sets, users_workouts.workout_date AS date,
          exercises_in_workouts.reps AS reps, exercises_in_workouts.exercise_order AS exercise_order, exercises.name AS exercise_name
          FROM users_workouts 
          INNER JOIN workouts ON users_workouts.workout_id = workouts.id
          INNER JOIN exercises_in_workouts ON workouts.id = exercises_in_workouts.workout_id
          INNER JOIN exercises ON exercises.id = exercises_in_workouts.exercise_id
          INNER JOIN users ON users.id = users_workouts.user_id
          WHERE users_workouts.user_id = ? AND users_workouts.id = ?
          AND users_workouts.is_completed != true
      `, [userID, userWorkoutID]);

    return result;
  } finally {
    conn.release();
  }
} 

export async function getNextWorkoutID(userWorkoutID, userID){
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`SELECT id FROM users_workouts WHERE id > ? AND user_id = ? 
      ORDER BY workout_id ASC LIMIT 1`, [userWorkoutID, userID]);
    
    return result[0] ? result[0].id : null;
  } finally {
    conn.release();
  }
}

export async function getPrevWorkoutID(userWorkoutID, userID){
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`SELECT id FROM users_workouts WHERE id < ? AND user_id = ? 
      ORDER BY workout_id DESC LIMIT 1`, [userWorkoutID, userID]);

    return result[0] ? result[0].id : null; 
  } finally {
    conn.release();
  }
}

export async function setUserWorkoutDone(userID, userWorkoutID, exercises){

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(`SELECT users_workouts.id, exercises_in_workouts.exercise_id, exercises_in_workouts.sets, exercises_in_workouts.reps, users_workouts.workout_comment 
    FROM users_workouts
    INNER JOIN workouts ON users_workouts.workout_id = workouts.id
    INNER JOIN exercises_in_workouts ON workouts.id = exercises_in_workouts.workout_id
    WHERE users_workouts.user_id = ? AND users_workouts.id = ?`, [userID, userWorkoutID]);

    for(const exercise of exercises) {
      const insertData = await conn.query(`INSERT INTO workouts_results(user_workout_id, exercise_id, sets, reps, used_weight) VALUES (?, ?, ?, ?, ?)`, [userWorkoutID, exercise.exerciseID, exercise.sets, exercise.reps, exercise.load]);
      console.log("dodawane dane ćwiczenia");
      console.log(insertData)
    };

    await conn.query(`UPDATE users_workouts SET is_completed = true WHERE id = ?`, [result[0].id]);

    await conn.commit();
    //there should be different return 
    return {success: true};
  } catch(err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function  getExercises(){
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`SELECT * FROM exercises ORDER BY muscle_group`);
    return result;
  } finally {
    conn.release();
  }
}

export async function addWorkout(date, workout_title, exercises, user_id){
  const conn = await pool.getConnection();

  try {
  await conn.beginTransaction();

  const [result] = await conn.query(`INSERT INTO workouts(name) VALUES(?)`, [workout_title]);
  let exercise_order = 1;
  for(const exercise of exercises) {
    await conn.query(`INSERT INTO exercises_in_workouts(workout_id, exercise_id, sets, reps, exercise_order) VALUES(?, ?, ?, ?, ?)`, 
      [result.insertId, exercise.id, exercise.sets, exercise.reps, exercise_order]);
      exercise_order++;
  }
  const [userWorkout] = await conn.query(`INSERT INTO users_workouts(user_id, workout_id, workout_date) VALUES(?, ?, ?)`, [user_id, result.insertId, date]);
    
    await conn.commit();
    return userWorkout;
  } catch(err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function setWorkoutChanges(workoutID, workout_title, workout_date, workout_exercises, userID) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    
    await conn.query('UPDATE users_workout SET workout_date = ?  WHERE user_id = ? AND workout_id = ?', [workout_date, userID, workoutID]);
    await conn.query('UPDATE workouts SET name = ? WHERE workouts.id = ?', [workout_title, workoutID]);
    for(exercise of workout_exercises) {
      await conn.query('UPDATE exercises_in_workouts SET exercise_id = ?, sets = ?, reps = ?, exercise_order = ?', [exercise.id, exercise.sets, exercise.reps])
    }
    
    await conn.commit();
  } catch(err){
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function deleteWorkout(user_workout_id){
  const conn = await pool.getConnection();

  try{
    await conn.beginTransaction();
    const [result] = await conn.query(`DELETE FROM users_workouts WHERE id = ?`, [user_workout_id]);
    console.log(result);
    await conn.query(`ALTER TABLE users_workouts AUTO_INCREMENT = ?`, result.insertId);
    console.log(result);
    await conn.commit();
    return result;
  } catch(err){
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getWorkoutsResults(userID){
  const conn = await pool.getConnection();
  try{
    //maybe I should use aliases
    const [results] = await conn.query(`SELECT workouts_results.id AS workout_results_id, workouts_results.user_workout_id, workouts_results.exercise_id, 
      workouts_results.sets, workouts_results.reps, workouts_results.used_weight 
      FROM workouts_results
      INNER JOIN users_workouts ON users_workouts.id = workouts_results.user_workout_id
      WHERE users_workouts.user_id = ?
      ORDER BY workouts_results.user_workout_id`, [userID]);
    return results;
  } finally {
    conn.release();
  }
}
