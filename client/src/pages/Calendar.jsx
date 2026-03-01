import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from '../scss/Calendar.module.scss';
import Navbar from "../components/NavigationBar";
import '../scss/main.scss';
import fetchHelper from "../utils/fetchHelper.js";

function Calendar(){
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  useEffect(() => {
    fetchWorkouts();
  }, [])

  async function fetchWorkouts(){
    try {
      const res_data = await fetchHelper('http://localhost:8080/api/calendar/getWorkouts', {method: 'GET'})
      if(!res_data.success) {
        throw new Error("Internal server error");
      }

      setWorkouts(res_data.workouts);

    } catch(err) {
      console.error(err);
      if(err.message === "unauthorized") {
        navigate('/login');
      }
    }
  }

  async function deleteWorkout(id){
    try {
      const res_data = await fetchHelper(`http://localhost:8080/api/deleteWorkout/${id}`, {method: 'DELETE'});
      if(!res_data.success) {
        throw new Error("Internal server error");
      }

      console.log("Deletion succeeded: " + res_data.success);
      await fetchWorkouts();

    } catch(err) {
      console.error(err);
      if(err.message === "unauthorized"){
        navigate('/login')
      }
    }
  }

  return(
  <>

    <Navbar links={[{name: "Go back to dashboard", path: "/dashboard"}]}/>

    <div className={styles.calendarContainer}>
      <h1>Workouts Calendar</h1>
      <ul className={styles.workoutsGrid}>
        {(workouts.length !== 0) ?
          workouts.map((workout, index) => {

            return <li key={index} className={styles.calendarPosition}>
              <p> 
                {`${workout.workout_name}`} <br/> 
                {`${new Date(workout.workout_date).toLocaleDateString()}`}
              </p>
              <div className={styles.actionsContainer}>

                <button onClick={() => {navigate(`/workouts/${workout.user_workout_id}/edit`)}}
                className={styles.modifyWorkoutBtn}>Modify Workout</button>

                <button onClick={() => {navigate(`/workouts/${workout.user_workout_id}`)}}
                className={styles.modifyWorkoutBtn}>Full workout view/Start workout</button>

                <button onClick={() => {deleteWorkout(workout.user_workout_id)}}
                className={styles.deleteWorkoutBtn}>Delete workout</button>
              </div>
            </li>
          }) : <li>No workouts available</li>}

      </ul>
   </div>
  </>
  );
}

export default Calendar;
