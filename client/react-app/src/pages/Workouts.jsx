import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import styles from '../scss/Workouts.module.scss';

function Workouts(){
  let id = Number(useParams().id);
  const navigate = useNavigate();
  const [workout, setWorkout] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    exercise1: false,
    exercise2: false,
    exercise3: false
  });

  function handleInputChange(e){
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    setCheckboxes((prev) => {
      return {...prev, [name]: value};
    })
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
    setWorkout(res.result);
  })
  .catch((err) => {
    alert(err);
  })
  }, [id]);

  useEffect(() => {
  console.log("Workout: ");
  console.log(workout);
  }, [workout]);

  function handleSubmit(e){
    
    e.preventDefault();
    
    for (const [key, value] of Object.entries(checkboxes)) {
      console.log(`${key}: ${value}`);
    }

    let isEveryBoxChecked = true;
    for(const key in checkboxes){
      if(!checkboxes[key]){
        isEveryBoxChecked = false;
      }
    }

    if(!isEveryBoxChecked){
      alert("You didn't do all exercises.");
    } else {
      alert("You did all exercises, congratulation");

      fetch(`http://localhost:8080/api/setWorkoutDone/${id}`, {
        method: "GET",
        credentials: 'include'
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
      {/*you need to change that*/}
      <Link to={`/workouts/${id + 1}`}>Next workout</Link>
      <Link to={`/workouts/${(id > 1) ? (id - 1) : 1}`}>Previous workout</Link>
      <Link to={`/workouts/${id}/edit`}>Edit workout</Link>
      <Link to={`/dashboard`}>Go back to dashboard</Link>
      <div className={styles.workoutListContainer}>
        <h1>Workout</h1>
        <ul>
          {/*How to check if all fields are checked*/}
          <form onSubmit={(e) => {handleSubmit(e)}}>
          {(workout) ? workout.map((exercise, index) => {
            return <li key={index}>
              {exercise.exercise_order}. {exercise.exercise_name}: <span>{exercise.reps} reps x </span><span>{exercise.sets} sets</span> 
              <input type="checkbox" name={`exercise${exercise.exercise_order}`} onChange={(e) => {handleInputChange(e)}} onLoad={(e) => {handleInputChange(e)}} value={false}/>
            </li>
          }) : ""}
            <button>I done this</button>
          </form>
        </ul>
      </div>
    </>
  );
}

export default Workouts;