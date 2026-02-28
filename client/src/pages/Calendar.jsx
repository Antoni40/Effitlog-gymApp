import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from '../scss/Calendar.module.scss';
import Navbar from "../components/NavigationBar";
import '../scss/main.scss';
import fetchDataGET from "../utils/fetchDataGET";

function Calendar(){
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  useEffect(() => {
    fetchWorkouts();
  }, [])

  function fetchWorkouts(){
    fetchDataGET('http://localhost:8080/api/calendar/getWorkouts')
      .then((res_data) => {
        if(!res_data.success) {
          throw new Error("Internal server error");
        }
        setWorkouts(res_data.workouts);
      })
      .catch((err) => {
        console.error(err);
        if(err.message === "unauthorized") {
          navigate('/login');
        }
      })
  }

  function deleteWorkout(id){
    fetch(`http://localhost:8080/api/deleteWorkout/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((res) => {
        if(res.status === 401){
          alert("Session expired, please log in again");
          throw new Error("unauthorized");
        }
        if(!res.ok){
          throw new Error("HTTP error: " + res.status);
        } 
        return res.json();
      })
      .then((res_data) => {
        fetchWorkouts();
        console.log("Deletion succeeded: " + res_data.success)
      })
      .catch((err) => {
        console.error(err);
        if(err.message === "unauthorized"){
          navigate('/login')
        }
      })
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
