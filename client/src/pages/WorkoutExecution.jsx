import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const barFilling = useRef(null);
  const percentIndicator = useRef(null);

  function updateExercise(e){
    const order = Number(e.target.id);
    const value = e.target.type === 'checkbox' ? e.target.checked : Number(e.target.value) || '';
    let name = e.target.name.split('_')[0];
    
    setWorkoutExercises((prevExercises) => 
      prevExercises.map(exercise => {
        if(exercise.exercise_order === order) {
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
  
    const isAllInputsFilled = workoutExercises.every((exercise => {
      if(!exercise.done) return false;
      else  return true;
    }))

    if(!isAllInputsFilled){
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

  function updateProgressBar(madeCounter, length){
    if(length === 0){
      return;
    }
    const percentOfMade = ((madeCounter / length) * 100).toFixed(0);
    percentIndicator.current.textContent = `${percentOfMade}%`;
    barFilling.current.style.width = `${percentOfMade}%`;
    barFilling.current.style.backgroundColor = 'green';

    console.log("Percent of made: " + percentOfMade);
  }

  useEffect(() => {
    let madeCounter = 0;
    for(const exercise of workoutExercises) {
      if(exercise.done) {
        madeCounter++;
      }
    }
    console.log(madeCounter);
    updateProgressBar(madeCounter, workoutExercises.length);
  }, [workoutExercises])


  return(
    <>
      <Navbar links={[{name: "Next workout", path: `/workouts/${workoutData.nextWorkoutID}`}, 
                      {name: "Previous workout", path: `/workouts/${workoutData.prevWorkoutID}`},
                      {name: "Edit workout", path: `/workouts/${id}/edit`},
                      {name: "Go back to dashboard", path: `/dashboard`}]}/>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div ref={barFilling} 
          className={styles.barFilling}>
              <p ref={percentIndicator} 
              className={styles.percentIndicator}></p>
          </div>
        </div>
      </div>
      
      <div className={styles.workoutListContainer}>
        <div className={styles.innerWorkoutListContainer}> 
          <h1>{workoutData.workout_title}</h1>
            <form onSubmit={(e) => {handleSubmit(e)}}>
              <ul>
                {workoutExercises.map((exercise) => {
                  return (
                    
                    <li key={exercise.exercise_order} className={styles.exerciseContainer}>
                      
                      {Object.entries(iconsUpperBody).map(([key, value]) => {
                        if(exercise.exercise_muscle_group === key){
                          return <img key={key} src={value} alt={key} className={styles.bodyIcon}/>
                        }
                      })}
                      {Object.entries(iconsLowerBody).map(([key, value]) => {
                        if(exercise.exercise_muscle_group === key){
                          return <img key={key} src={value} alt={key} className={styles.bodyIcon}/>
                        }
                      })}

                      <div className={styles.textCheckboxContainer}>
                          <div className={styles.exerciseInfo}>
                            <h3 className={styles.textLine}>{exercise.exercise_order}. {exercise.exercise_name}</h3> 
                            <p className={styles.quantity}>{exercise.reps} reps x {exercise.sets} sets</p>
                          </div> 
                        
                          <div className={styles.exerciseActions}>
                            <input type="number"
                            name={`load_${exercise.exercise_order}`}
                            id={`${exercise.exercise_order}`}
                            onChange={(e) => updateExercise(e)}
                            />&nbsp;kg
                          </div> 
                        
                        <div className={styles.checkboxContainer}>
                          <input type="checkbox" name={`done_${exercise.exercise_order}`} 
                          onChange={(e) => {updateExercise(e)}}
                          id={`${exercise.exercise_order}`}/>
                        </div>
                      
                      </div>
                    </li>
                  )})
                }
              </ul>
              <button>Finish</button>
            </form>
        </div>
      </div>
    </>
  );
}

export default WorkoutExecution;