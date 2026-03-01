import { useEffect, useState } from 'react';
import styles from '../scss/Dashboard.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import BarChart from './BarChart.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faTrash, faCalendar, faGear } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../components/NavigationBar.jsx';
import '../scss/main.scss';
import fetchHelper from '../utils/fetchHelper.js';

function Dashboard(){
  const navigate = useNavigate();
  const [tempUpdateURL, setTempUpdateURL] = useState('');
  const [name, setName] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [workoutsResults, setWorkoutsResults] = useState([]);

  const labels = workoutsResults.map((el) => el.workout_date);
  const total_weights = workoutsResults.map((el) => el.workout_weight);
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
 
  useEffect(() => {

    async function getName(){
      try {
        const res_data = await fetchHelper('http://localhost:8080/api/getName', {method: 'GET'});

        if(!res_data.success) {
          throw new Error("Internal server error");
        }
        setName(res_data.userName);

      } catch (err) {
        console.error(err);

        if(err.message === "unauthorized") {
          navigate('/login');
        }
      }
    }

    getName();
  }, []);

  useEffect(() => {

    async function getWorkoutsResults(){
      try {
        const res_data = await fetchHelper('http://localhost:8080/api/getWorkoutsResults', {method: 'GET'});

        if(!res_data.success) {
          throw new Error("Internal server error");
        }
        const workouts_results = res_data.result;
        let usedWeightInTrainings = {};

        workouts_results.forEach((element) => {
          const id = element.user_workout_id;
          const weight = Number(element.used_weight * element.sets * element.reps);
          const date = new Date(element.workout_date).toLocaleDateString();

          if(!usedWeightInTrainings[id]){
            usedWeightInTrainings[id] = {
              workout_weight: 0,
              workout_date: date
            }
          }

          usedWeightInTrainings[id].workout_weight += weight;
  
        })
        const array = Object.values(usedWeightInTrainings)
        setWorkoutsResults(array);
      } catch (err) {
        console.error(err);

        if(err.message === "unauthorized") {
          navigate('/login');
        }
      }
    }
    getWorkoutsResults();
  }, []);

  useEffect(() => {
    async function getWorkouts(){
      try {
        const res_data = await fetchHelper('http://localhost:8080/api/calendar/getWorkouts', {method: 'GET'});

        if(!res_data.success) {
          throw new Error("Internal server error");
        }

        setWorkouts(res_data.workouts);
        setTempUpdateURL(res_data.workouts[0].user_workout_id);
      } catch (err) {
        console.error(err);

        if(err.message === "unauthorized") {
          navigate('/login');
        }
      }
    }

    getWorkouts();
  }, [])

  async function logOut() {
    try {
      const res = await fetch('http://localhost:8080/api/logout', {
        method: 'GET',
        credentials: 'include'
      })
      if(!res.ok){
        throw new Error("HTTP error: " + res.status);
      } 
      const res_data = await res.json();

      if(!res_data.success) {
        throw new Error("Internal server error");
      }
      navigate('/');

    } catch(err) {
      console.error(err);
    }
  }

  return(
      <div>
            <Navbar links={[{name, onClick: () => {navigate('/dashboard')}},
              {name: 'Log-out', onClick: logOut}
            ]}/>

          <div className={styles.pageContentContainer}>
            <header className={styles.greeting}>
              <h1>Hello {name}!</h1>
            </header>

            <div className={styles.mainBlocksContainer}>

              <section className={styles.manipulationContainer}>
                <h2>Managing options</h2>            
                <div className={styles.changesButtons}>

                  <Link to={`/workouts/${tempUpdateURL}/edit`}>
                    Modify Workouts <span><FontAwesomeIcon icon={faPencil} /></span>  
                    </Link>
                  <Link to={`/workouts/add`}>
                    Add new Workout <span><FontAwesomeIcon icon={faPlus} /></span>
                  </Link>
                  <Link to={`/workouts/calendar`}>
                    Delete workout <span><FontAwesomeIcon icon={faTrash} /></span>
                  </Link>
                  <Link to={`/workouts/calendar`}>
                    Full calendar <span><FontAwesomeIcon icon={faCalendar} /></span>
                  </Link>
                  <Link to={`/settings`}>
                    Progression settings <span><FontAwesomeIcon icon={faGear}/></span>
                  </Link>

                </div>
              </section>

              <section className={styles.progressContainer}>
                <h2>Progress</h2>
                  <div className={styles.chartContainer}>
                    <BarChart data={total_weights} labels={labels} data_title={"Total used weight in workouts"} title={"Progress over time"}/>
                  </div>
              </section>

              <section className={styles.closestWorkouts}>
                <h2>Start workout</h2>
                <div className={styles.calendarContainer}>
                  <p className={styles.subtitle}>Upcoming workouts</p>
                  <div>
                    <ul>
                      {(workouts.length !== 0) ?
                      workouts.map((workout, index) => {
                        return <li key={index}>
                                  <div>
                                    <h3>{index + 1}. {workout.workout_name}</h3>
                                    <p className={styles.subtitle}>
                                      {`${new Date(workout.workout_date).toLocaleDateString()}`}
                                    </p>
                                  </div>
                                  <div>
                                    <button onClick={() => {navigate(`/workouts/${workout.user_workout_id}`)}}>Full workout view/Start workout</button>
                                  </div>
                                </li>
                      }) : <p>No workouts available add new workout</p>}
                    </ul>
                  </div>
                </div>
              </section>
          </div>
        </div>
        </div>
  );
}

export default Dashboard;