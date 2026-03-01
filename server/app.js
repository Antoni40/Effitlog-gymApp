import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import {getUsers, getUser, createUser, 
        deleteUser, checkUserData, getWorkouts, 
        getWorkout, setUserWorkoutDone, getExercises, 
        addWorkout, deleteWorkout,
        getNextWorkoutID,
        getPrevWorkoutID,
        getWorkoutsResults, setWorkoutChanges} from './database.js'

const app = express();


app.use(express.json())

app.use(cors({
  //temporary you need to change that to specific orgin
  origin: 'http://localhost:5173',
  credentials: true
})) 

app.use(cookieParser());


//maybe there should be independent function for jwt refreshing maybe diffrent endpoint
//like /api/auth/refresh instead of doing verify and refresh in the same function
function cookieJwtAuth(req, res, next){
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    //the expires time is for testing purposes
    const newToken = jwt.sign({id: user.id, name: user.name, 
      surname: user.surname, email: user.email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME
      });
      
    //the expires time is for testing purposes
    res.cookie('token', newToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true
    })
      
    next();
  } catch (err) {
    res.clearCookie("token");
    //there should be some changes, it doesn't work
    // res.redirect('http://localhost:5173/login');
    res.status(401).json({ error: "unauthorized", success: false});
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
    return res.status(401).json({success: false, message: "Invalid login data"});
  }

  const passwordMatch = await bcrypt.compare(password, result.password);

  if (!passwordMatch){
    return res.status(401).json({success: false, message: "wrong password" });
  } 

  const userData = {id: result.id, name: result.name, email: result.email};
  //the expires time is for testing purposes
  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME })

  res.cookie('token', token, {
    maxAge: 1000 * 60 * 15,
    httpOnly: true
  })
  //200 - OK
  res.status(200).json({success: true});

});
  
app.get('/api/getUsers', async (req, res) => {
    const result = await getUsers();
    res.status(200).json({result, success: true});
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

  res.status(200).json({userName: req.user.name, success: true});

})

app.get('/api/calendar/getWorkouts', cookieJwtAuth, async (req, res) => {
  console.log(req.user);
  const result = await getWorkouts(req.user.id);
  res.status(200).json({success: true, workouts: result});

})

app.get('/api/getWorkout/:userWorkoutid', cookieJwtAuth, async (req, res) => {
  const {userWorkoutid} = req.params;
  let result = await getWorkout(userWorkoutid, req.user.id);
  const nextWorkoutID = await getNextWorkoutID(userWorkoutid, req.user.id);
  const prevWorkoutID = await getPrevWorkoutID(userWorkoutid, req.user.id);

  if(!result) {
    return res.status(404).json({succes: false});
  }

  res.status(200).json({success: true, result: result, nextWorkoutID, prevWorkoutID});

})

app.post('/api/setWorkoutDone', cookieJwtAuth, async (req, res) => {
  const exercises = req.body;
  const {userWorkoutID} = req.body[0];
  console.log(exercises);
  const userID = req.user.id;
  const result = await setUserWorkoutDone(userID, userWorkoutID, exercises);
  console.log(result);
  // console.log(userID, userWorkoutID);
  // const result = await setUserWorkoutDone(userID, userWorkoutID);
  res.status(200).json({success: true});

  
})

app.get('/api/getExercises', cookieJwtAuth, async (req, res) => {
  const result = await getExercises();
  res.status(200).json({success: true, result: result});
})

app.post('/api/setNewWorkout', cookieJwtAuth, async(req, res) => {
  const {workoutData, workoutRows} = req.body;
  console.log(typeof workoutRows);
  const result = await addWorkout(workoutData.date, workoutData.workout_title, workoutRows, req.user.id);
  res.status(200).json({success: true, result });
})

app.post('/api/setWorkoutChanges/:id', cookieJwtAuth, async(req, res) => {
  const userWorkoutID = req.params.id;
  const {workoutData, workoutRows} = req.body;
  const workoutID = workoutData.workout_id;
  console.log(workoutData, workoutRows);
  const result = await setWorkoutChanges(workoutID, workoutData.workout_title, workoutData.workout_date, workoutRows, req.user.id);
  res.status(200).json({success: true, result: result});
})

app.delete('/api/deleteWorkout/:id', cookieJwtAuth, async (req, res) => {
  const user_workout_id  = req.params.id;
  console.log("workout id: " + user_workout_id);
  const result = await deleteWorkout(user_workout_id);
  res.status(200).json({success: true, result: result});
})

app.get('/api/getWorkoutsResults', cookieJwtAuth, async (req, res) => {
  const userID = req.user.id;
  const result = await getWorkoutsResults(userID);
  res.status(200).json({success: true, result});
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
})