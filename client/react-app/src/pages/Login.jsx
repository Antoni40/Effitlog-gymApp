import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from '../scss/Forms.module.scss'
import { useEffect } from 'react';


function Login({setLoggedIn}){

  //maybe it's better to use redirect but navigate have more options
  const navigate = useNavigate();

  useEffect(() => {
    console.log("I'm working if you have logged in lately you should be redirect to /dashboard");

    fetch('http://localhost:8080/api/isUserLoggedIn', {
      method: "GET",
      credentials: 'include'
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
          const success = res.success;
          console.log(success);
          if(success) {
            console.log('We will navigate to dashboard now');
            navigate('/dashboard');
          } else {
            console.log("please log in")
          }
      })
  }, []);


  const [loginData, setLoginData] = useState({
    login: "",
    password: ""
  });

  function updateLogin(e){
    const {name, value} = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    })
    )
  }
  
  function handleLogin(e){
    e.preventDefault();

    fetch("http://localhost:8080/api/checkUserData", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: loginData.login, password: loginData.password}),
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if(data.success){
          navigate('/dashboard')
        } else {
          alert("Incorrect data!");
        }
      })
      .catch((err) => {
        alert(`Server error ${err}`);
      }) 
  }


  return(
    <div className={styles.contentContainer}>
      <div className={styles.signInContainer}>
        <h1>Sign-in</h1>
        <div className={styles.FormContainer}>
          <form method='POST' 
            onSubmit={(e) => {handleLogin(e)}} 
            className={styles.Form}>

            <label htmlFor="login">E-mail:</label>
            <input type="email" 
              id="login" 
              name="login" 
              value={loginData.login} 
              onChange={updateLogin}
              />

            <label htmlFor="password">Password</label>
            <input type="password" 
              id="password" 
              name="password" 
              value={loginData.password} 
              onChange={updateLogin}/>

            <button>Log-in</button>
          </form>
        </div>
        <Link to="/register">Or Sign-up</Link>
      </div>
    </div>
  )
}

export default Login;