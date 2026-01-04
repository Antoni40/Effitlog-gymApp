import express from 'express'
import cors from 'cors'
import {getUsers, getUser, createUser, deleteUser, checkUserData,} from './database.js'

const app = express();

app.use(express.json())

app.use(cors({
  //temporary you need to change that to specific orgin
  origin: '*'
}))

//prevents server crashing
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//for login
app.post('/api/checkuserdata', async (req, res) => {
  const { email, password } = req.body;
  const result = await checkUserData(email, password);

  if(!result){
    //401 - not valid authentication
    res.status(401).json({success: false});
  } else {
    //200 - OK
    res.status(200).json({success: true});
  }
});

app.get('/api/getusers', async (req, res) => {
    const result = await getUsers();
    res.status(200).json(result);
});

app.post('/api/registerUser', async (req, res) => {
  const { first_name, surname, email, password} = req.body;
  const result = await createUser(first_name, surname, email, password);

  if(!result){
    //400 - bad request
    res.status(400).json({success: false});
  } else {
    //201 - created
    res.status(201).json({success: true});
  }
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
})