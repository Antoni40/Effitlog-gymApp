import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config() 

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

export async function getUsers() {
  const [exercises] = await pool.query("SELECT * FROM users");
  return exercises;
}

export async function getUser(id){
  const [user] = await pool.query(`
    SELECT * 
    FROM users 
    WHERE id = ?`, [id]);
  return user[0];
}

export async function createUser(name, surname, email, password){
  const [result] = await pool.query(`
    INSERT INTO users(name, surname, email, password) 
    VALUES (?, ?, ?, ?)`, [name, surname, email, password]);
    const id = result.insertId;
    
    return getUser(id);
}

export async function checkUserData(email){
  const [result] = await pool.query(`
    SELECT * FROM users WHERE email= ?
  `, [email]);

  return result[0];
}

export async function deleteUser(id){
  const result = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
}

//needed data are 
// Training date, training exercises
export async function getWorkouts(userId){
  const [result] = await pool.query(`
    SELECT users_workouts.workout_date, workouts.name 
    FROM workouts
    INNER JOIN users_workouts 
    ON workouts.id = users_workouts.workout_id
    WHERE users_workouts.user_id = ?`, [userId]);
    return result;
}

//exercises in workout
export async function getWorkout(workoutID, userID){
  const [result] = await pool.query(`
        SELECT users_workouts.id AS user_workout_id, workouts.id AS workout_id, workouts.name AS name, workouts.description AS description, exercises_in_workouts.sets AS sets,
        exercises_in_workouts.reps AS reps, exercises_in_workouts.exercise_order AS exercise_order, exercises.name AS exercise_name
        FROM users_workouts 
        INNER JOIN workouts ON users_workouts.workout_id = workouts.id
        INNER JOIN exercises_in_workouts ON workouts.id = exercises_in_workouts.workout_id
        INNER JOIN exercises ON exercises.id = exercises_in_workouts.exercise_id
        INNER JOIN users ON users.id = users_workouts.user_id
        WHERE users_workouts.user_id = ? AND users_workouts.id = ?
    `, [userID, workoutID]);

    return result;
} 

export async function setUserWorkoutDone(userID, userWorkoutID){
  //id	user_workout_id	exercise_id	set_nr	reps	used_weight	difficulty
  //bardzo skomplikowana relacja


  const [result] = await pool.query(`SELECT users_workouts.id, exercises_in_workouts.exercise_id, exercises_in_workouts.sets, exercises_in_workouts.reps, users_workouts.workout_comment 
  FROM users_workouts
  INNER JOIN workouts ON users_workouts.workout_id = workouts.id
  INNER JOIN exercises_in_workouts ON workouts.id = exercises_in_workouts.workout_id
  WHERE users_workouts.user_id = ? AND users_workouts.id = ?`, [userID, userWorkoutID]);

  // const [deleteResult] = await pool.query(`DELETE FROM users_workouts WHERE id = ?`, [result[0].id])

  result.forEach(async (exercise) => {
    const [insertResult] = await pool.query(`INSERT INTO workouts_results(user_workout_id, exercise_id, set_nr, reps) VALUES (?, ?, ?, ?)`, [exercise.id, exercise.exercise_id, exercise.sets, exercise.reps]);
    console.log(insertResult);
  });

  return result;
}

export async function  getExercises(){
  const [result] = await pool.query(`SELECT * FROM exercises ORDER BY muscle_group`);
  return result;
}

export async function addWorkout(date, workout_title, exercises, user_id){
  const [result] = await pool.query(`INSERT INTO workouts(name) VALUES(?)`, [workout_title]);
  console.log(result);
  if (result) {
    exercises.forEach(async (exercise, index) => {
      const [result2] = await pool.query(`INSERT INTO exercises_in_workouts(workout_id, exercise_id, sets, reps, exercise_order) VALUES(?, ?, ?, ?, ?)`, [result.insertId, exercise.id, exercise.sets, exercise.reps, index + 1]);
      console.log(result2);
    })
      const [result3] = await pool.query(`INSERT INTO users_workouts(user_id, workout_id, workout_date) VALUES(?, ?, ?)`, [user_id, result.insertId, date]);
      return result3;
    }
    return -1;
  }


