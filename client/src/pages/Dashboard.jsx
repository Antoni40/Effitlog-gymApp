import { useRef, useEffect, useState } from 'react';
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
  const [BMIdata, setBMIdata] = useState({
    heightCM: '',
    weightKG: ''
  });
  const BMIdiv = useRef(null);
  const BMIContainer = useRef(null);

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

  function showBMIResults(e){
    e.preventDefault();
    const {weightKG, heightCM} = BMIdata;
    console.log(weightKG, heightCM);
    const heightM = heightCM / 100;
    console.log(heightM);

    let BMI = null;
    let message = '';

    BMIdiv.current.classList.remove(
      styles.underweight,
      styles.normal,
      styles.overweight,
      styles.obesity
    );


    if(weightKG && heightCM && heightCM > 0){
      BMI = weightKG / (heightM * heightM);
    
      if(BMI < 18.5){
        BMIdiv.current.classList.add(styles.underweight);
        message += "Underweight: ";
      } else if(BMI >= 18.5 && BMI < 25) {
        BMIdiv.current.classList.add(styles.normal);
        message += "Normal weight: ";
      } else if(BMI >= 25 && BMI < 30){
        BMIdiv.current.classList.add(styles.overweight);
        message += "Overweight: ";
      } else if (BMI >=30) {
        BMIdiv.current.classList.add(styles.obesity);
        message += `Obesity class  ${(BMI < 35) ? "I: " : (BMI < 40) ? "II: " : "III: "}`;
      }

      message += BMI.toFixed(2);
    } else {
      message = 'provide data';
    }
    BMIdiv.current.innerText = message;
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
                  
                  <Link to={tempUpdateURL ? `/workouts/${tempUpdateURL}/edit` : `/dashboard`}>
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

                </div>
              </section>

              <section className={styles.progressContainer}>
                <h2>Progress</h2>
                  <div className={styles.chartContainer}>
                    <BarChart data={total_weights.slice(-4)} labels={labels.slice(-4)} data_title={"Total used weight in workouts"} title={"Progress over time"}/>
                  </div>
                  <div>
                  <div ref={BMIContainer} 
                  className={styles.bmiContainer}>
                    <h3>BMI</h3>
                    <form onSubmit={showBMIResults}>

                      <div>
                        <label htmlFor="weight">Weight</label>
                        <div className={styles.inputContainer}>
                          <input type="number" 
                            name='weightKG'
                            placeholder='(e.g. 80)'
                            value={BMIdata.weightKG}
                            onChange={(e) => {
                              const name = e.target.name;
                              const value = e.target.value > 0 ? Number(e.target.value) : '';
                              setBMIdata((prev) => { 
                                return {...prev, [name]: value}
                              })}}
                            /> kg
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="height">Height</label>
                        <div className={styles.inputContainer}>
                          <input type="number" 
                            name='heightCM'
                            placeholder='(e.g. 180)'
                            value={BMIdata.heightCM}
                            onChange={(e) => {
                              const name = e.target.name;
                              const value = e.target.value > 0 ? Number(e.target.value) : '';
                              setBMIdata((prev) => { 
                                return {...prev, [name]: value}
                              })}}
                            /> cm
                          </div>
                      </div>

                      <button>Show BMI</button>
                      </form>

                      <div ref={BMIdiv} className={styles.BMIdiv}>

                      </div>
                      
                  </div>
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
                        return <li key={workout.user_workout_id}>
                                  <div>
                                    <h3>{index + 1}. {workout.workout_name}</h3>
                                    <p className={styles.subtitle}>
                                      {`${new Date(workout.workout_date).toLocaleDateString()}`}
                                    </p>
                                  </div>
                                  <div>
                                    <button onClick={() => {navigate(`/workouts/${workout.user_workout_id}`)}}>Start workout</button>
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