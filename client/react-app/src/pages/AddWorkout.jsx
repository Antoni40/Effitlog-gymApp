import { useEffect, useState } from 'react';
import styles from '../scss/AddWorkout.module.scss';
import {Link} from 'react-router-dom';

function AddWorkout(){

  const [availableExercises, setAvailableExercises] = useState([]);
  const [workoutRows, setWorkoutRows] = useState([
    {id: '', sets: '', reps: ''}
  ]);
  const [loading, setLoading] = useState(true);
  const [workoutData, setWorkoutData] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/api/getExercises', {
      method: "GET",
      credentials: 'include'
    })
    .then((res) => res.json())
    .then((res) => {
      setAvailableExercises(res.result);
      setLoading(false);
    }) 
    .catch((err) => {
      console.error("Data fetch error" + err)
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
  function handleSubmit(e) {
    e.preventDefault();
    
    fetch('http://localhost:8080/api/setNewWorkout', {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workoutData, 
        workoutRows
      })
    })
  }

  if(loading) return <p>Loading...</p>

  return (
    <div className={styles.pageContainer}>
    <div className={styles.formContainer}>
      <Link to="/dashboard">Go back to dashboard</Link>
      <h1>Add workout</h1>
      <form onSubmit={(e) => {handleSubmit(e)}}>
        <h2>Workout info</h2>
          <input type="text" 
            name="workout_title"
            placeholder='workout name'
            onChange={(e) => {handleWorkoutDataChange(e.target.name, e.target.value)}}/>

          <input type="date" 
            name="date"
            onChange={(e) => {handleWorkoutDataChange(e.target.name, e.target.value)}}
          />
        <div className={styles.exercisesContainer}>
        {workoutRows.map((row, index) => (
          <div className={styles.exerciseContainer} key={index}>

          <h2>Exercise {index + 1}</h2>
          
          <select
            onChange={(e) => handleInputChange(index, 'id', e.target.value)}>
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
              onChange={(e) => {handleInputChange(index, e.target.name, e.target.value)}}/>

            <input type="number" 
              placeholder="Reps"
              name="reps"
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
  );
}


export default AddWorkout;