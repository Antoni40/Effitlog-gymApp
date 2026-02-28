import { useEffect, useState } from 'react';
import styles from '../scss/Dashboard.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import BarChart from './BarChart.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faTrash, faCalendar, faGear } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../components/NavigationBar.jsx';
import '../scss/main.scss';

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
    fetch('http://localhost:8080/api/getName', {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        if(res.ok){
          return res.json();
        } else {
          isUserLoggedIn();
          throw new Error("you can't get your data");
        }
      })
      .then((res) => {
        const {userName} = res;
        console.log(userName)
        setName(userName);
      })
      .catch((err) => {
        console.log("Some problem: " + err);
        navigate('/login');
      })
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/getWorkoutsResults', {
      method: 'GET',
      credentials: 'include'
    })
    .then((res) => {
      return res.json();
    })
    .then((res) => {

      const workouts_results = res.result;
      let usedWeightInTrainings = {};

      workouts_results.forEach((element) => {
        const id = element.user_workout_id;
        const weight = Number(element.used_weight * element.sets * element.reps);
        const date = new Date(element.workout_date).toLocaleDateString();
        console.log(date);

        if(!usedWeightInTrainings[id]){
          usedWeightInTrainings[id] = {
            workout_weight: 0,
            workout_date: date
          }
        }
      
        usedWeightInTrainings[id].workout_weight += weight;

        console.log(usedWeightInTrainings); 
      })
      const array = Object.values(usedWeightInTrainings)
      setWorkoutsResults(array);
    })
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/calendar/getWorkouts', {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setWorkouts(res.workouts);
        setTempUpdateURL(res.workouts[0].user_workout_id);
      })
      .catch((err) => {
        console.log("Some problem: " + err)
      })
  }, [])

  function isUserLoggedIn() {
    fetch('http://localhost:8080/api/isUserLoggedIn', {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const {success} = res;
        if(success){
          alert("You are logged in");
        } else {
          // alert("You are not logged in, your session expired");
          // navigate('/login');
        }
      })
      .catch((err) => {
        console.log("Some problem: " + err)
      })

  }

  function logOut() {
    fetch('http://localhost:8080/api/logout', {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const success = res;
        if(success){
          navigate('/');
        } else {
          console.log("You didn't logged out")
        }
      })
      .catch((err) => {
        console.log("Some problem: " + err)
      })
  }

  return(
      <div>
            <Navbar links={[{name, onClick: isUserLoggedIn},
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
                  {/*add more options*/}
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
                  <BarChart data={total_weights} labels={labels}/>
                  </div>
              </section>

              <section className={styles.closestWorkouts}>
                <h2>Start workout</h2>
                <div className={styles.calendarContainer}>
                  <p className={styles.subtitle}>Upcoming workouts</p>
                  <div>
                    <ul>
                      { (workouts.length !== 0) ?
                      workouts.map((workout, index) => {
                        return <li key={index}>
                                  <div>
                                    <h3>{index + 1}. {workout.workout_name}</h3>
                                    <p className={styles.subtitle}>{`${new Date(workout.workout_date).getDate()}  ${month[new Date(workout.workout_date).getMonth()]}
                                        ${new Date(workout.workout_date).getFullYear()}`}
                                    </p>
                                  </div>
                                  <div><Link to={`/workouts/${workout.user_workout_id}`}><button>Start workout</button></Link></div>
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