import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import {getUsers, getUser, createUser, deleteUser, checkUserData,} from './database.js'

const app = express();

//for testing
app.use((req, res, next) => {
  console.log(`Server got: ${req.method} ${req.url}`);
  next();
});

app.use(express.json())

app.use(cors({
  //temporary you need to change that to specific orgin
  origin: 'http://localhost:5173',
  credentials: true
})) 

app.use(cookieParser());


function cookieJwtAuth(req, res, next){
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    res.status(401).json({ error: "Unauthorized"} );
  }
}

//prevents server crashing
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//for login
app.post('/api/checkUserData', async (req, res) => {
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

  const userData = {id: result.id, name: result.name, email: result.email};
  //the expires time is for testing purposes
  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30s' })

  res.cookie('token', token, {
    httpOnly: true,
  })
  //200 - OK
  res.status(200).json({success: true});

});
  
app.get('/api/getUsers', async (req, res) => {
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
});

app.get('/api/isUserLoggedIn', cookieJwtAuth, (req, res) => {
  res.status(200).json({ success: true })
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
})