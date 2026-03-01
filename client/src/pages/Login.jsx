import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from '../scss/AuthForm.module.scss';
import { useEffect } from 'react';
import '../scss/main.scss';


function Login(){ 
  const navigate = useNavigate();
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

  useEffect(() => {
    async function isUserLoggedIn() {
      try {
        const res = await fetch('http://localhost:8080/api/isUserLoggedIn', {
          method: "GET",
          credentials: 'include'
        })
        if(!res.ok) {
          throw new Error("HTTP error: " + res.status);
        }
        const res_data = await res.json();
      
        if(!res_data.success) {
          throw new Error("Internal server error");
        } 
        navigate('/dashboard')
      
      } catch(err) {
          console.error(err);
      }
    }
  isUserLoggedIn();
  }, []);
  
  async function handleLogin(e){
    e.preventDefault();
    try{
      const res = await fetch("http://localhost:8080/api/checkUserData", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: loginData.login, password: loginData.password}),
      })

        if(!res.ok){
          throw new Error("HTTP error: " + res.status);
        }
        const res_data = await res.json();

        if(!res_data.success){
          throw new Error("Internal server error");
        }
        navigate('/dashboard');
        
    } catch(err) {
      console.error(err);
      alert(err.message);
    }
  }


  return(
    <div className={styles.contentContainer}>
      <div className={styles.signInContainer}>
        <h1>Sign-in</h1>
        <p>Welcome back! Please enter your details.</p>

        <div className={styles.FormContainer}>
          <form onSubmit={(e) => {handleLogin(e)}} 
            className={styles.Form}>

            <label htmlFor="login">E-mail</label>
            <input type="email" 
              id="login" 
              name="login" 
              value={loginData.login} 
              onChange={updateLogin}
              required
              />

            <label htmlFor="password">Password</label>
            <input type="password" 
              id="password" 
              name="password" 
              value={loginData.password} 
              onChange={updateLogin}
              required/>

            <button>Sign-in</button>
          </form>
        </div>

        <p>
          Don't have an account?<br/>
          <Link to="/register">Sign-up</Link>
        </p>

      </div>
    </div>
  )
}

export default Login;