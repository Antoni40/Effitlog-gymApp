import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import {getUsers, getUser, createUser, deleteUser, checkUserData, getWorkouts, getWorkout, setUserWorkoutDone, getExercises, addWorkout} from './database.js'

const app = express();


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
    res.status(401).json({ error: "Unauthorized", success: false} );
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
  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' })

  res.cookie('token', token, {
    httpOnly: true
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
});

//maybe I should use the cookieJwtAuth but I don't know now
app.get('/api/logout', (req, res) => {
  if(req.cookies.token){
    res.clearCookie("token");
    res.status(200).json({success: true});
  } else {
    res.status(401).json({success: true});
  }
});

app.get('/api/getName', cookieJwtAuth, (req, res) => {
  
  const decodedUser = jwt.decode(req.cookies.token, process.env.JWT_SECRET);


  console.log(decodedUser);

  res.status(200).json(decodedUser.name);

})

app.get('/api/calendar/getWorkouts', cookieJwtAuth, async (req, res) => {
  console.log(req.user);
  const result = await getWorkouts(req.user.id);
  res.status(200).json({success: true, workouts: result});

})

app.get('/api/getWorkout/:id', cookieJwtAuth, async (req, res) => {
  const workoutID = req.params.id;
  const result = await getWorkout(workoutID, req.user.id);
  res.status(200).json({success: true, result: result});

})

app.get('/api/setWorkoutDone/:id', cookieJwtAuth, async (req, res) => {
  const userWorkoutID = req.params.id;
  const userID = req.user.id;
  console.log(userID, userWorkoutID);
  const result = await setUserWorkoutDone(userID, userWorkoutID);
  res.status(200).json({success: true, result: result});

  
})

app.get('/api/getExercises', cookieJwtAuth, async (req, res) => {
  const result = await getExercises();
  res.status(200).json({success: true, result: result});
})

app.post('/api/setNewWorkout', cookieJwtAuth, async(req, res) => {
  const {workoutData, workoutRows} = await req.body;
  console.log(typeof workoutRows);
  const result = await addWorkout(workoutData.date, workoutData.workout_title, workoutRows, req.user.id);
  res.status(200).json({success: true});
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
})