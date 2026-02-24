import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from '../scss/AddWorkout.module.scss';

function EditWorkout(){
  let id = Number(useParams().id);
  const navigate = useNavigate();
  const [availableExercises, setAvailableExercises] = useState([]);
  const [workoutRows, setWorkoutRows] = useState([
    {id: '', sets: '', reps: '', exercise_order: ''}
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
    setWorkoutRows(exercises);
    setLoading((prev) => [false, prev[1]]);
  })
  .catch((err) => {
    console.log(err);
    navigate('/login');
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
      setAvailableExercises(res.result);
      setLoading((prev) => [prev[0], false])
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


  function handleSubmit(){
    fetch(`http://localhost:8080/api/setWorkoutChanges/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(
        workoutData,
        workoutRows
      )
    })
    .then(async (response) => {
      const res = await response.json();
      console.log(res);
    });
  }

  if(loading[0] === true && loading[1] === true) return <p>Loading...</p>

  return(
    <div className={styles.pageContainer}>  
    <div className={styles.formContainer}>
      <Link to="/dashboard">Go back to dashboard</Link>
      <Link to={`/workouts/${workoutData.nextWorkoutID}/edit`}>Next workout</Link>
      <Link to={`/workouts/${workoutData.prevWorkoutID}/edit`}>Previous workout</Link>
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
            value={`${new Date(workoutData.workout_date).getFullYear()}-0${new Date(workoutData.workout_date).getMonth() + 1}-${new Date(workoutData.workout_date).getDate()}`}
            onChange={(e) => {handleWorkoutDataChange(e.target.name, e.target.value)}}
          />
        <div className={styles.exercisesContainer}>
        {workoutRows.map((row, index) => (
          <div className={styles.exerciseContainer} key={index}>

          <h2>Exercise {index + 1}</h2>
          
          {/*I don't know how to set default value from the fetched data */}
          <select
            onChange={(e) => handleInputChange(index, 'id', Number(e.target.value))}
            value={workoutRows[index].id}>
            {availableExercises.map((exercise) => {
              return <option value={exercise.id} key={exercise.id}>
                      ({exercise.muscle_group}) {exercise.name}
                    </option>
            })}  
          </select>
          <div>
            <input type="number" 
              placeholder="Sets"
              name="sets"
              value={workoutRows[index].sets}
              onChange={(e) => {handleInputChange(index, e.target.name, e.target.value)}}/>

            <input type="number" 
              placeholder="Reps"
              name="reps"
              value={workoutRows[index].reps}
              onChange={(e) => {handleInputChange(index, e.target.name, e.target.value)}}/>
            </div>
          </div>

        ))}
      </div>
      <div className={styles.workoutCountSection}>
        <button type="button"
        className={styles.primary}
          onClick={() => {setWorkoutRows((prev) => [...prev, prev.length + 1])}}>
            + Add exercise
        </button>

        <button type="button"
          className={styles.secondary}
          onClick={() => {setWorkoutRows((prev) => prev.slice(0, -1))}}>
            - Remove exercise
        </button>
      </div>

        <button>Add Workout</button>

      </form>
    </div>
    </div>
  )
}

export default EditWorkout;