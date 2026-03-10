import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import {getUsers, createUser, 
        checkUserEmail, getWorkouts, 
        getWorkout, setUserWorkoutDone, getExercises, 
        addWorkout, deleteWorkout,
        getNextWorkoutID,
        getPrevWorkoutID,
        getWorkoutsResults, setWorkoutChanges} from './database.js'

const app = express();


app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})) 

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.use(cookieParser());


function jwtTokenAuth(req, res, next){
  const accessToken = req.cookies.accessToken;

  if(!accessToken){
    return res.status(401).json({success: false, message: "no access"})
  }

  try {
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = user;
      
    next();
  } catch (err) {
    res.clearCookie("accessToken");
    return res.status(401).json({ message: "invalid token", success: false});
  }
}

app.get('/auth/refreshToken', async (req, res) => {

  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "unauthorized"})
  }

  try {

    const {id} = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await getUser(id);

    const accessToken = jwt.sign({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email
      },
      process.env.JWT_SECRET, {
        expiresIn: '15m'
    });
      
    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true
    })

    res.status(200).json({success: true});
  } catch(err) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.status(401).json({success: false, message: "unauthorized"})
  }
  
})

app.post('/api/checkUserData', async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await checkUserEmail(email);
    console.log(user);

    if(!user){  
      return res.status(401).json({success: false, message: "Invalid login data"});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){  
      return res.status(401).json({success: false, message: "Invalid login data"});
    }

    const userData = {
      id: user.id,
      name: user.name, 
      surname: user.surname, 
      email: user.email
    };

    const accessToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({id: userData.id}, process.env.JWT_SECRET, { expiresIn: '7d'});

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
      sameSite: 'lax'
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'lax' 
    });

    res.status(200).json({success: true});
  } catch(err) {
    console.error(err);
    return res.status(500).json({success: false, message: "Server error"})
  }
});

app.post('/api/registerUser', async (req, res) => {
  const { first_name, surname, email, password} = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const result = await createUser(first_name, surname, email, password_hash);

  if(!result){
    res.status(400).json({success: false});
  } else {
    res.status(201).json({success: true});
  }
});

app.get('/api/isUserLoggedIn', jwtTokenAuth, (req, res) => {
  res.status(200).json({ success: true })
});

app.get('/api/logout', (req, res) => {
  if(req.cookies.accessToken) res.clearCookie("accessToken");
  if(req.cookies.refreshToken) res.clearCookie("refreshToken");
    res.status(200).json({success: true});
  }
);
  
app.get('/api/getUsers', async (req, res) => {
    const result = await getUsers();
    res.status(200).json({result, success: true});
});

app.get('/api/getName', jwtTokenAuth, (req, res) => {

  res.status(200).json({userName: req.user.name, success: true});

})

app.get('/api/calendar/getWorkouts', jwtTokenAuth, async (req, res) => {
  console.log(req.user);
  const result = await getWorkouts(req.user.id);
  res.status(200).json({success: true, workouts: result});

})

app.get('/api/getWorkout/:userWorkoutid', jwtTokenAuth, async (req, res) => {
  const {userWorkoutid} = req.params;
  let result = await getWorkout(userWorkoutid, req.user.id);
  const nextWorkoutID = await getNextWorkoutID(userWorkoutid, req.user.id);
  const prevWorkoutID = await getPrevWorkoutID(userWorkoutid, req.user.id);

  if(!result) {
    return res.status(404).json({succes: false});
  }

  res.status(200).json({success: true, result: result, nextWorkoutID, prevWorkoutID});

})

app.post('/api/setWorkoutDone', jwtTokenAuth, async (req, res) => {
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

app.get('/api/getExercises', jwtTokenAuth, async (req, res) => {
  const result = await getExercises();
  res.status(200).json({success: true, result: result});
})

app.post('/api/setNewWorkout', jwtTokenAuth, async(req, res) => {
  const {workoutData, workoutRows} = req.body;
  console.log(typeof workoutRows);
  const result = await addWorkout(workoutData.date, workoutData.workout_title, workoutRows, req.user.id);
  res.status(200).json({success: true, result });
})

app.post('/api/setWorkoutChanges/:id', jwtTokenAuth, async(req, res) => {
  const userWorkoutID = req.params.id;
  const {workoutData, workoutRows} = req.body;
  const workoutID = workoutData.workout_id;
  console.log(workoutData, workoutRows);
  const result = await setWorkoutChanges(workoutID, workoutData.workout_title, workoutData.workout_date, workoutRows, req.user.id);
  res.status(200).json({success: true, result: result});
})

app.delete('/api/deleteWorkout/:id', jwtTokenAuth, async (req, res) => {
  const user_workout_id  = req.params.id;
  console.log("workout id: " + user_workout_id);
  const result = await deleteWorkout(user_workout_id);
  res.status(200).json({success: true, result: result});
})

app.get('/api/getWorkoutsResults', jwtTokenAuth, async (req, res) => {
  const userID = req.user.id;
  const result = await getWorkoutsResults(userID);
  res.status(200).json({success: true, result});
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
})