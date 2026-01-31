//import image from '../assets/ronnie-coleman.jpg';
import { useEffect, useState } from 'react';
import styles from '../scss/Dashboard.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import BarChart from './BarChart.jsx';

function Home(){
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [workouts, setWorkouts] = useState([]);
 
  useEffect(() => {
    fetch('http://localhost:8080/api/getName', {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        if(res.status === 200){
          return res.json();
        } else {
          isUserLoggedIn();
          throw new Error("you can't get your data");
        }
      })
      .then((res) => {
        const name = res;
        console.log(name);
        setName(name);
      })
      .catch((err) => {
        console.log("Some problem: " + err);
      })
  }, [])

  useEffect(() => {
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
          alert("You are not logged in, your session expired");
          navigate('/login');
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
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return(
      <div>
            <nav>
              <div className={styles.logoContainer}>
              </div>
              <div className="buttons-container">
                <a onClick={isUserLoggedIn}>Am I logged in?</a>
                <a onClick={logOut}>Log-Out</a>
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
                <Link to={`/workouts/1/edit`}>
                  <button>Modify Workouts</button>
                  </Link>
                <Link to={`/workouts/add`}>
                  <button>Add new Workout</button>
                </Link>
                <Link to={`/workout/delete`}>
                <button>Delete workout</button>
                </Link>
                <button>Week plan</button>
                <button>Progression settings</button>
              </div>
            </section>

            <section className={styles.progressContainer}>
              <h2>Progress</h2>
                {/* <p>Current Goal</p>
                <p>Records or something</p>
                <p>Progress</p> */}
                <div className={styles.chartContainer}>
                <BarChart data={[10, 20, 30]} labels={["2024", "2025", "2026"]}/>
                </div>
            </section>

            <section className={styles.closestWorkouts}>
              <h2>Calendar</h2>
              <div className={styles.calendarContainer}>
                <p className={styles.subtitle}>Upcoming workouts</p>
                <div>
                  <ul>
                    { (workouts) ?
                    workouts.map((workout, index) => {
                      return <li key={index}>
                                <div>
                                  <h3>{index + 1}. {workout.name}</h3>
                                  <p className={styles.subtitle}>{`${new Date(workout.workout_date).getDate()}  ${month[new Date(workout.workout_date).getMonth()]}
                                      ${new Date(workout.workout_date).getFullYear()}`}
                                  </p>
                                </div>
                                <div><Link to={`/workouts/${index + 1}`}><button>Start workout</button></Link></div>
                              </li>
                    }) : ""}
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

export default Home;