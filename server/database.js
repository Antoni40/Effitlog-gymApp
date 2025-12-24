import mysql from "mysql2"

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'gym_app'
}).promise();

const [result] = await pool.query("SELECT * FROM exercises");
console.log(result[0]);

