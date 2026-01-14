//import image from '../assets/ronnie-coleman.jpg';
import { useEffect, useState } from 'react';
import styles from '../scss/Dashboard.module.scss'
import { useNavigate } from 'react-router-dom';

function Home(){
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    fetch('http://localhost:8080/api/getName', {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const name = res;
        console.log(name);
        setName(name);
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
        }
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
  }
  return(
      <div className={styles.mainContainer}>
        <h1>Hello {name}!</h1>
        <button onClick={isUserLoggedIn}>Am I logged in?</button>
        <button onClick={logOut}>Log-Out</button>
        {/*<p>Yeah buddy!</p>*/}
        {/*<img src={image} width="500px"/> */}
      </div>
  );
}

export default Home;