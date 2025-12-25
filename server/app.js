import express from 'express'
import {getUsers, getUser, createUser, deleteUser} from './database.js'

const app = express();

app.use(express.json())

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.send(users);
})

app.get("/user:id", async (req, res) => {
  const id = req.params.id;
  const user = getUser(id);
  res.send(user);
})

app.post("/users", async (req, res) => {
  const {name, surname, email, password} = req.body;
  const user = await createUser(name, surname, email, password);
  res.status(201).send(user);
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
})