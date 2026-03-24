import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import {getUser, getUsers, createUser, 
        checkUserEmail, getWorkouts, 
        getWorkout, setUserWorkoutDone, getExercises, 
        addWorkout, deleteWorkout,
        getNextWorkoutId,
        getPrevWorkoutId,
        getWorkoutsResults, setWorkoutChanges} from './database.js'

const app = express();


app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})) 


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

app.get('/api/auth/refresh_token', async (req, res) => {

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

    return res.status(200).json({success: true});
  } catch(err) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return res.status(401).json({success: false, message: "unauthorized"})
  }
  
})

app.post('/api/auth/login', async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await checkUserEmail(email);


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

    return res.status(200).json({success: true});
  } catch(err) {
    console.error(err);
    return res.status(500).json({success: false, message: "Server error"})
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { first_name, surname, email, password} = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const result = await createUser(first_name, surname, email, password_hash);

  if(!result){
    return res.status(400).json({success: false});
  } else {
    return res.status(201).json({success: true});
  }
});

app.get('/api/auth/status', jwtTokenAuth, (req, res) => {
  return res.status(200).json({ success: true })
});

app.get('/api/auth/logout', (req, res) => {
  if(req.cookies.accessToken) res.clearCookie("accessToken");
  if(req.cookies.refreshToken) res.clearCookie("refreshToken");
    return res.status(200).json({success: true});
  }
);
  
app.get('/api/users', async (req, res) => {
    const result = await getUsers();
    return res.status(200).json({result, success: true});
});

app.get('/api/user_name', jwtTokenAuth, (req, res) => {
  return res.status(200).json({userName: req.user.name, success: true});
})

app.get('/api/workouts', jwtTokenAuth, async (req, res) => {
  const result = await getWorkouts(req.user.id);
  return res.status(200).json({success: true, workouts: result});

})

app.get('/api/workout/:id', jwtTokenAuth, async (req, res) => {
  const userWorkoutId = req.params.id;
  let result = await getWorkout(userWorkoutId, req.user.id);
  const nextWorkoutId = await getNextWorkoutId(userWorkoutId, req.user.id);
  const prevWorkoutId = await getPrevWorkoutId(userWorkoutId, req.user.id);

  if(!result) {
    return res.status(404).json({succes: false});
  }

  return res.status(200).json({success: true, result: result, nextWorkoutId, prevWorkoutId});

})

app.post('/api/workout/:id/complete', jwtTokenAuth, async (req, res) => {
  const exercises = req.body;
  if(exercises.length === 0){
    return res.status(400).json({success: false, message: "Invalid data"})
  }
  const userWorkoutId = req.params.id;
  console.log(exercises);
  const userId = req.user.id;
  const result = await setUserWorkoutDone(userId, userWorkoutId, exercises);
  return res.status(200).json({success: true});

  
})

app.get('/api/exercises', jwtTokenAuth, async (req, res) => {
  const result = await getExercises();
  return res.status(200).json({success: true, result: result});
})

app.post('/api/workout', jwtTokenAuth, async(req, res) => {
  const {workoutData, workoutRows} = req.body;
  console.log(typeof workoutRows);
  const result = await addWorkout(workoutData.date, workoutData.workout_title, workoutRows, req.user.id);
  return res.status(200).json({success: true, result });
})

app.put('/api/workout/:id', jwtTokenAuth, async(req, res) => {
  const userWorkoutId = req.params.id;
  const {workoutData, workoutRows} = req.body;
  const workoutId = workoutData.workout_id;
  console.log(workoutData, workoutRows);
  const result = await setWorkoutChanges(userWorkoutId, workoutId, workoutData.workout_title, workoutData.workout_date, workoutRows, req.user.id);
  return res.status(200).json({success: true, result: result});
})

app.delete('/api/workout/:id', jwtTokenAuth, async (req, res) => {
  const user_workout_id  = req.params.id;
  console.log("workout id: " + user_workout_id);
  const result = await deleteWorkout(user_workout_id, req.user.id);
  return res.status(200).json({success: true, result: result});
})

app.get('/api/workout_results', jwtTokenAuth, async (req, res) => {
  const userId = req.user.id;
  const result = await getWorkoutsResults(userId);
  return res.status(200).json({success: true, result});
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
})