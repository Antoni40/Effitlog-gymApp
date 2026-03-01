import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { iconsLowerBody, iconsUpperBody} from "../assets/icons.js"
import styles from '../scss/WorkoutExecution.module.scss';
import Navbar from "../components/NavigationBar.jsx";
import '../scss/main.scss';
import fetchHelper from "../utils/fetchHelper.js";

function WorkoutExecution(){

  let id = Number(useParams().id);
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState({});
  const [workoutExercises, setWorkoutExercises] = useState([]);

  function updateExercise(e){
    const id = Number(e.target.id);
    const value = e.target.type === 'checkbox' ? e.target.checked : Number(e.target.value);
    let name = e.target.name.split('_')[0];

    setWorkoutExercises((prevExercises) => 
      prevExercises.map(exercise => {
        if(exercise.exercise_order === id) {
          return {...exercise, [name]: value}
        } else {
          return exercise;
        }
      })
    )
  }

  useEffect(() => {
    async function getWorkout() {
      try {
      const res_data = await fetchHelper(`http://localhost:8080/api/getWorkout/${id}`, {method: 'GET'});

      if(!res_data.success){
        throw new Error("Internal server error")
      }

      const exercises = res_data.result; 
      const nextWorkoutID = res_data.nextWorkoutID ? res_data.nextWorkoutID : id;
      const prevWorkoutID = res_data.prevWorkoutID ? res_data.prevWorkoutID : id;
      
      setWorkoutData({workout_title: exercises[0].workout_name, 
                      workout_date: exercises[0].date, 
                      nextWorkoutID, prevWorkoutID});
      setWorkoutExercises(exercises.map(exercise => (
          {
            ...exercise, 
            done: false, 
            load: ''
          }
        )));

      } catch(err) {
        console.error(err);
        if(err.message === "unauthorized") {
          navigate('/login');
        }
      }
    }
    getWorkout();
  }, [id]);


  function handleSubmit(e){
    e.preventDefault();
  
    let inputsFilled = true;
    workoutExercises.forEach((exercise => {
      if(!exercise.done) inputsFilled = false;
    }))

    if(!inputsFilled){
      alert("You didn't do all exercises.");
    } else {
      alert("You did all exercises, congratulations");

      async function setWorkoutDone() {
        try {
          const res_data = await fetchHelper(`http://localhost:8080/api/setWorkoutDone`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify(
              workoutExercises.map(exercise => ({
                userWorkoutID: exercise.user_workout_id,
                exerciseID: exercise.exercise_id,
                sets: exercise.sets,
                reps: exercise.reps,
                exerciseOrder: exercise.exercise_order,
                load: exercise.load
              }
            )))
          })

          if(!res_data.success){
            throw new Error("Internal server error");
          }
          navigate('/dashboard');
        
        } catch(err) {
          console.error(err);
          alert(err.message);
          if(err.message === "unauthorized") {
            navigate('/login');
          }
        }
    }
    setWorkoutDone();
  }
}


  return(
    <>
      <Navbar links={[{name: "Next workout", path: `/workouts/${workoutData.nextWorkoutID}`}, 
                      {name: "Previous workout", path: `/workouts/${workoutData.prevWorkoutID}`},
                      {name: "Edit workout", path: `/workouts/${id}/edit`},
                      {name: "Go back to dashboard", path: `/dashboard`}]}/>
      
      <div className={styles.workoutListContainer}>

        <h1>{workoutData.workout_title}</h1>
          <form onSubmit={(e) => {handleSubmit(e)}}>
            <ul>
              {workoutExercises.map((exercise) => {
                return (
                  
                  <li key={exercise.exercise_order} className={styles.exerciseContainer}>
                    
                    {/*Make simpler */}
                    {Object.entries(iconsUpperBody).map(([key, value]) => {
                      if(exercise.exercise_muscle_group === key){
                        return <img src={value} alt={key} className={styles.bodyIcon}/>
                      }
                    })}
                    {Object.entries(iconsLowerBody).map(([key, value]) => {
                      if(exercise.exercise_muscle_group === key){
                        return <img src={value} alt={key} className={styles.bodyIcon}/>
                      }
                    })}

                    <div className={styles.textCheckboxContainer}>
                      <div>
                        <div className={styles.exerciseInfo}>
                          <span className={styles.textLine}>{exercise.exercise_order}. {exercise.exercise_name}: </span> 
                          <span>{exercise.reps} reps x </span><span>{exercise.sets} sets</span>
                        </div> 
                      
                        <div className={styles.exerciseActions}>
                          <input type="number" placeholder="Enter weight"
                          name={`load_${exercise.exercise_order}`}
                          id={`${exercise.exercise_order}`}
                          onChange={(e) => updateExercise(e)}
                          />&nbsp;kg
                        </div> 
                      </div>
                    
                      <input type="checkbox" name={`done_${exercise.exercise_order}`} 
                      onChange={(e) => {updateExercise(e)}}
                      id={`${exercise.exercise_order}`}/>
                    
                    </div>
                  </li>
                )})
              }
            </ul>
            <button>Finish</button>
          </form>
      </div>
    </>
  );
}

export default WorkoutExecution;