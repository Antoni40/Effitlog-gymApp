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

export async function deleteUser(id){
  const result = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
}

// const exercises = await getExercises();
// console.log(exercises);
// const user = await createUser("Jan", "Kowalski", "Jan@Kowalski.pl", "PFD312FSDA3");
// console.log(user);


