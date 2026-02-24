//import image from '../assets/ronnie-coleman.jpg';
import { useEffect, useState } from 'react';
import styles from '../scss/Dashboard.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import BarChart from './BarChart.jsx';

function Dashboard(){
  const navigate = useNavigate();
  const [tempUpdateURL, setTempUpdateURL] = useState('');
  const [name, setName] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [workoutsResults, setWorkoutsResults] = useState([]);

  const labels = workoutsResults.map((el) => 
    el.user_workout_id
  );

  const total_weights = workoutsResults.map((el) =>
    el.total_weight
  )

  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
 
  //make fetches better
  useEffect(() => {
    fetch('http://localhost:8080/api/getName', {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        //res.ok better than res.status !== 200
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
      console.log(res);
      const workouts_results = res.result;

      let usedWeightInTrainings = {};
      workouts_results.forEach((element) => {
        const weight = Number(element.used_weight);
        const id = element.user_workout_id;

        //protection for += operator
        if(!usedWeightInTrainings[id]){
          usedWeightInTrainings[id] = 0;
        }

        usedWeightInTrainings[id] += weight;
      })
      //test
      setWorkoutsResults(() => {
        const array = [];
        for(const [id, weight] of Object.entries(usedWeightInTrainings)){
          array.push({user_workout_id: Number(id), total_weight: weight});
        }
        return array;
      });
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
            <nav className={styles.mainNavigation}>
              <div className={styles.logoContainer}>
              </div>
              <div className={styles.buttonsContainer}>
                <a onClick={isUserLoggedIn}>{name}</a>
                <a onClick={logOut}>Log-out</a>
              </div>
            </nav>

          <header className={styles.greeting}>
            <h1>Hello {name}!</h1>
          </header>

          <div className={styles.mainBlocksContainer}>

            <section className={styles.manipulationContainer}>
              <h2>Managing options</h2>            
              <div className={styles.changesButtons}>
                {/*add more options*/}
                <Link to={`/workouts/${tempUpdateURL}/edit`}>
                  Modify Workouts <span>📝</span>  
                  </Link>
                <Link to={`/workouts/add`}>
                  Add new Workout <span>➕</span>
                </Link>
                <Link to={`/workouts/calendar`}>
                  Delete workout <span>🗑️</span>
                </Link>
                <Link to={`/workouts/calendar`}>
                  Full calendar <span>📅</span>
                </Link>
                <Link to={`/settings`}>
                  Progression settings <span>⚙️</span>
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
                <div id="training" className={styles.notActive}>  
                  <ol>
                    <li>Przysiady</li>
                    <li>Martwy ciąg</li>
                  </ol>
                </div>
              </div>
            </section>
        </div>
      </div>
  );
}

export default Dashboard;