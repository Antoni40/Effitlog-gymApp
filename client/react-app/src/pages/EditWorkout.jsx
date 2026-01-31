import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from '../scss/EditWorkout.module.scss';

function EditWorkout(){
  let id = Number(useParams().id);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [workout, setWorkout] = useState([]);

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
    fetch('http://localhost:8080/api/getExercises', {
      method: "GET",
      credentials: 'include'
    })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      setExercises(res.result);
    })
  }, []);

  useEffect(() => {
  console.log("Workout: ");
  console.log(workout);
  }, [workout]);

  function onSubmit(){
    fetch("http://localhost:8080/api/setWorkoutChanges", {
      method: "PUT",
      headers: { "Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({workout: workout})
    })
    .then(async (response) => {
      const res = await response.json;
      console.log(res);
    });
  }
  return(
    <div className={styles.editContainer}>
    <Link to={`/workouts/${id}`}>Back</Link>
    <form>
      {(workout) ? workout.map((exercise) => {
        return <div className={styles.exerciseContainer}> 
                <label htmlFor="">Exercise</label>
                <select>
                  {exercises.map((exercise) => {
                    return <option value={exercise.name}>({exercise.muscle_group}) {exercise.name}</option>
                  })}  
                </select>
                <label htmlFor="">Sets</label>
                <input type="number" placeholder={exercise.sets}/>
                <label htmlFor="">Reps</label>
                <input type="number" placeholder={exercise.reps}/>
               </div>
      }) : ""}
      <button className={styles.submitButton}>Change workout</button>
    </form>
    </div>
  )
}

export default EditWorkout;