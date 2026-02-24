import { useEffect, useState } from "react";
import styles from '../scss/Calendar.module.scss';
function Calendar(){
    const [workouts, setWorkouts] = useState([]);
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    useEffect(() => {
        fetchWorkouts();
    }, [])

    function fetchWorkouts(){
        fetch('http://localhost:8080/api/calendar/getWorkouts', {
        method: 'GET',
        credentials: 'include'
        })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            console.log(res.workouts);
            setWorkouts(res.workouts);
        })
        .catch((err) => {
            console.log("Some problem: " + err)
        })
    }
    function deleteWorkout(id){
        fetch(`http://localhost:8080/api/deleteWorkout/${id}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then((res) => {
            return res.json();
        }) 
        .then((res) => {
            fetchWorkouts();
            console.log(res);
        })
        .catch((err) => {
            console.log("Some problem: " + err)
        })
    }
 
    return(
        <div className={styles.calendarContainer}> 
            <h1>Workouts Calendar</h1>
            <ul className={styles.workoutsGrid}>
                {(workouts.length !== 0) ?
                workouts.map((workout, index) => {
                    return <li key={index} className={styles.calendarPosition}>
                                <p>
                                    {`${workout.workout_name}`} <br/> 
                                    {`${new Date(workout.workout_date).getDate()}  ${month[new Date(workout.workout_date).getMonth()]}
                                    ${new Date(workout.workout_date).getFullYear()}`}
                                </p>
                                <div className={styles.actionsContainer}>
                                    <button className={styles.modifyWorkoutBtn}>Modify Workout</button>
                                    <button onClick={() => {deleteWorkout(workout.user_workout_id)}}
                                        className={styles.deleteWorkoutBtn}>Delete workout</button>
                                </div>
                            </li>
                }) : <p>No workouts available</p>}
            </ul>
        </div>
    );
}

export default Calendar;