import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from '../scss/AddWorkout.module.scss';
import Navbar from "../components/NavigationBar";
import '../scss/main.scss';

function EditWorkout(){
  let id = Number(useParams().id);
  const navigate = useNavigate();
  const [availableExercises, setAvailableExercises] = useState([]);
  const [workoutRows, setWorkoutRows] = useState([
    {exercise_id: 0, sets: 0, reps: 0, exercise_order: 0}
  ]); 
  const [loading, setLoading] = useState([true, true]);
  const [workoutData, setWorkoutData] = useState({
    workout_title: '', workout_date: '', nextWorkoutID: id, prevWorkoutID: id
  });

  useEffect(() => {
  fetch(`http://localhost:8080/api/getWorkout/${id}`, {
      method: "GET",
      credentials: 'include'
  })
    .then((res) => {
      if(!res.ok) {
          throw new Error("HTTP error" + res.status);
        }
        return res.json();
      })
    .then((res_data) => {
      if(!res_data.success){
        throw new Error("Internal server error");
      }

      const exercises = res_data.result; 
      let nextWorkoutID = res_data.nextWorkoutID ? res_data.nextWorkoutID : id;
      let prevWorkoutID = res_data.prevWorkoutID ? res_data.prevWorkoutID : id;

      setWorkoutData({workout_id: exercises[0].workout_id, 
        workout_title: exercises[0].workout_name, 
        workout_date: exercises[0].date, 
        nextWorkoutID, prevWorkoutID});

      setWorkoutRows(exercises);
      setLoading((prev) => [false, prev[1]]);
    })
    .catch((err) => {
      console.error(err);
    })
  }, [id]);
   
  useEffect(() => {
    fetch('http://localhost:8080/api/getExercises', {
      method: "GET",
      credentials: 'include'
    })
    .then((res) => {
      if(!res.ok){
        throw new Error("HTTP error" + res.status);
      }
      return res.json();
    })
    .then((res_data) => {
      if(!res_data.success) {
          throw new Error("Internal server error");
      } 
      setAvailableExercises(res_data.result);
      setLoading((prev) => [prev[0], false])
    })
    .catch((err) => {
      console.error(err);
    })
  }, []);

  function handleInputChange(index, field, value) {
    setWorkoutRows(prev => 
      prev.map((row, i) => 
        i === index ? {...row, [field]: value} : row
      )
    );
  }

  function handleWorkoutDataChange(field, value){
    setWorkoutData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  function handleSubmit(e){
    e.preventDefault();
    console.log(workoutData, workoutRows);
    fetch(`http://localhost:8080/api/setWorkoutChanges/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({
        workoutData,
        workoutRows
      })
    })
      .then((res) => {
        if(!res.ok) {
          throw new Error("HTTP error" + res.status);
        }
        return res.json();
      })
      .then((res_data) => {
        if(!res_data.success) {
          throw new Error("Internal server error");
        } 
        alert("Workout updated moving to dashboard");
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error(err);
        alert(err.message)
      })
  }

  if(loading[0] === true && loading[1] === true) return <p>Loading...</p>

  return(
    <>
      {/*change next/prev for arrows outside form*/}
      <Navbar links={[
        {name: "Previous workout", path: `/workouts/${workoutData.prevWorkoutID}/edit`},
        {name: "Next workout", path: `/workouts/${workoutData.nextWorkoutID}/edit`},
        {name: "Go back to dashboard", path: "/dashboard"}
      ]} />
      
      <div className={styles.pageContainer}>  
        <div className={styles.formContainer}>
          <h1>Edit workout nr. {id}</h1>
          <form onSubmit={(e) => {handleSubmit(e)}}>

            <h2>Workout info</h2>

              <label htmlFor="">Workout name</label>
              <input type="text" 
                name="workout_title"
                placeholder='workout name'
                value={workoutData.workout_title}
                onChange={(e) => {handleWorkoutDataChange(e.target.name, e.target.value)}}/>

              <label htmlFor="">Workout date</label>
              <input type="date" 
                name="date"
                value={workoutData.workout_date.slice(0, 10)}
                onChange={(e) => {handleWorkoutDataChange(e.target.name, e.target.value)}}
              />
              
              <div className={styles.exercisesContainer}>
                {workoutRows.map((row, index) => (
                  <div className={styles.exerciseContainer} key={index}>

                  <h2>Exercise {index + 1}</h2>
                  
                  <select
                    value={row.exercise_id ? Number(row.exercise_id) : ''}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      handleInputChange(index, 'exercise_id', value)}}>
                    
                    <option value="">Choose your exercise</option>
                    {availableExercises.map((exercise) => (
                      <option value={exercise.id} key={exercise.id}>
                              ({exercise.muscle_group}) {exercise.name}
                      </option>
                    ))}  
                  </select>
                <div>

                <input type="number" 
                  placeholder="sets"
                  name="sets"
                  value={row.sets === 0 ? '' : row.sets}
                  onChange={(e) => { 
                    const value = Number(e.target.value);
                    handleInputChange(index, e.target.name, value)}}/>

                <input type="number" 
                  placeholder="reps"
                  name="reps"
                  value={row.reps === 0 ? '' : row.reps}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    handleInputChange(index, e.target.name, value)}
                    }/>
                </div>
              </div>

            ))}
          </div>

          <div className={styles.workoutCountSection}>
            <button
              className={styles.addExerciseBtn}
              onClick={() => {setWorkoutRows((prev) => [...prev, 
                {exercise_id: 0, sets: 0, reps: 0, exercise_order: prev.length}
              ])}}>
                + Add exercise
            </button>

            <button
              className={styles.removeExerciseBtn}
              onClick={() => {setWorkoutRows((prev) => prev.slice(0, -1))}}>
                - Remove exercise
            </button>
          </div>

          <button>Save changes</button>

          </form>
        </div>
      </div>
    </>
  )
}

export default EditWorkout;