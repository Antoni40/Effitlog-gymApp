import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from '../scss/Workouts.module.scss';

function Workouts(){
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
      }
      ))
  }


  useEffect(() => {
  fetch(`http://localhost:8080/api/getWorkout/${id}`, {
      method: "GET",
      credentials: 'include'
  })
  .then((res) => {
    if(res.status == 401){
      navigate('/login');
      throw new Error("You are not logged in");
    } else {
      return res.json();
    }
  })
  .then((res) => {
    const exercises = res.result; 
    let nextWorkoutID = res.nextWorkoutID ? res.nextWorkoutID : id;
    let prevWorkoutID = res.prevWorkoutID ? res.prevWorkoutID : id;
    setWorkoutData({workout_title: exercises[0].workout_name, workout_date: exercises[0].date, 
      nextWorkoutID, prevWorkoutID});
    setWorkoutExercises(exercises.map(exercise => (
      {
        ...exercise, 
        done: false, 
        load: ''
      }
      ))
    );
  })
  .catch((err) => {
    alert(err);
  })
  }, [id]);

  useEffect(() => {
  console.log("Workout: ");
  console.log(workoutExercises);
  }, [workoutExercises]);


  function handleSubmit(e){
    
    e.preventDefault();
  

    let inputsFilled = true;
    workoutExercises.forEach((exercise => {
      if(!exercise.done) inputsFilled = false;
    }))

    if(!inputsFilled){
      alert("You didn't do all exercises.");
    } else {
      alert("You did all exercises, congratulation");

      fetch(`http://localhost:8080/api/setWorkoutDone`, {
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
          }))
        )
      })
        .then(async (res) => {
          if(res.status !== 200){
            throw new Error("server response error");
          } else {
            const response =  await res.json();
            //maybe I should do diffrent handling
            if(response.success){
              navigate('/dashboard');
            }
          }
        })
    }
    

  }

  return(
    <>
      <nav className={styles.workoutNav}>
        <Link to={`/workouts/${workoutData.nextWorkoutID}`}>Next workout</Link>
        <Link to={`/workouts/${workoutData.prevWorkoutID}`}>Previous workout</Link>
        <Link to={`/workouts/${id}/edit`}>Edit workout</Link>
        <Link to={`/dashboard`}>Go back to dashboard</Link>
      </nav>
      <div className={styles.workoutListContainer}>
        <h1>Workout</h1>
        <ul>
          <form onSubmit={(e) => {handleSubmit(e)}}>
          {(workoutExercises) ? workoutExercises.map((exercise, index) => {
            return (
              <li key={index} className={styles.exerciseContainer}>

              <div className={styles.exerciseInfo}>
              {exercise.exercise_order}. {exercise.exercise_name}: <span>{exercise.reps} reps x </span><span>{exercise.sets} sets</span>
              </div> 
              
              <div className={styles.exerciseActions}>
              <label htmlFor="load"></label>
              <input type="number" placeholder=""
              name={`load_${exercise.exercise_order}`}
              id={`${exercise.exercise_order}`}
              onChange={(e) => updateExercise(e)}
              />kg

              {/* Add custom checkbox */}
              <label className={styles.container}>
                <input type="checkbox" name={`done_${exercise.exercise_order}`} onChange={(e) => {updateExercise(e)}}
                id={`${exercise.exercise_order}`}/>
                <span className={styles.checkMark}></span>
              </label>
              </div>
            </li>
          )}) : ""}
            <button>I done this</button>
          </form>
        </ul>
      </div>
    </>
  );
}

export default Workouts;