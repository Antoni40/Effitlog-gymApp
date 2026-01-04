import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt';

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

  const result = await checkUserData(email);
  console.log(result);

  if(!result){  
    //401 - not valid authentication
    //is it worth to use return there
    return res.status(401).json({success: false, message: "account with that email doesn't exist"});
  }

  const passwordMatch = await bcrypt.compare(password, result.password);

  if (!passwordMatch){
    return res.status(401).json({success: false, message: "wrong password" });
  } 

  //200 - OK
  res.status(200).json({success: true});

});

app.get('/api/getusers', async (req, res) => {
    const result = await getUsers();
    res.status(200).json(result);
});

app.post('/api/registerUser', async (req, res) => {
  const { first_name, surname, email, password} = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const result = await createUser(first_name, surname, email, password_hash);

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