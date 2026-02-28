import { useEffect, useState } from 'react';
import styles from '../scss/ExerciseForm.module.scss';
import {Link, useNavigate} from 'react-router-dom';
import Navbar from '../components/NavigationBar';
import '../scss/main.scss';
import fetchDataGET from '../utils/fetchDataGET';

function AddWorkout(){
  const navigate = useNavigate();
  const [availableExercises, setAvailableExercises] = useState([]);
  const [workoutRows, setWorkoutRows] = useState([
    {exercise_id: '', id: '', sets: '', reps: ''}
  ]);
  const [loading, setLoading] = useState(true);
  const [workoutData, setWorkoutData] = useState({});

  useEffect(() => {
    fetchDataGET('http://localhost:8080/api/getExercises')
    .then((res_data) => {
      if(!res_data.success) {
        throw new Error("Internal server error")
      }
      setAvailableExercises(res_data.result);
      setLoading(false);
    }) 
    .catch((err) => {
      console.error(err);
      if(err.message === 'unauthorized') {
        navigate('/login');
      }
    })
  }, []);

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
      .then((res) => {
        if(res.status === 401){
          alert("Session expired, please log in again");
          throw new Error("unauthorized");
        }
        if(!res.ok){
          throw new Error("HTTP error" + res.status);
        }
        return res.json();
      })
      .then((res_data) => {
        if(!res_data.success){
          throw new Error('Internal server error');
        }
        console.log("workout was added properly");
      })
      .catch((err) => {
        console.error(err);
        if(err.message === 'unauthorized'){
          navigate('/login');
        }
      })
  }
  
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


  if(loading) return <p>Loading...</p>

  return (
    <>
      <Navbar links={[{name: "Go back to dashboard", path: '/dashboard'}]}/>

      <div className={styles.pageContainer}>

        <div className={styles.formContainer}>
          <h1>Add workout</h1>
          
          <form onSubmit={(e) => {handleSubmit(e)}}>
            <h2>Workout info</h2>

            <label htmlFor="workout_name">Workout name</label>
            <input type="text"
              id='workout_name' 
              name="workout_title"
              placeholder='workout name'
              onChange={(e) => {handleWorkoutDataChange(e.target.name, e.target.value)}}/>

            <label htmlFor="workout_date">Workout date</label>
            <input type="date"
              id='workout_date' 
              name="date"
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
                      handleInputChange(index, 'exercise_id', value);
                    }}>

                    <option value="">Choose your exercise</option>
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
                      value={row.sets}
                      onChange={(e) => {handleInputChange(index, e.target.name, e.target.value)}}/>

                    <input type="number" 
                      placeholder="Reps"
                      name="reps"
                      value={row.reps}
                      onChange={(e) => {handleInputChange(index, e.target.name, e.target.value)}}/>
                  </div>
                  
                </div>

              ))}
            </div>

          <div className={styles.workoutCountSection}>
            <button type="button"
            className={styles.addExerciseBtn}
            onClick={() => {setWorkoutRows((prev) => [...prev, prev.length + 1])}}>
              + Add exercise
            </button>

            <button type="button"
              className={styles.removeExerciseBtn}
              onClick={() => {setWorkoutRows((prev) => prev.slice(0, -1))}}>
                - Remove exercise
            </button>
          </div>

            <button>Add Workout</button>
          </form>
        </div>
      </div>
    </>
  );
}


export default AddWorkout;