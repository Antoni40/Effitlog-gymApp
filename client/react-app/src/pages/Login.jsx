import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from '../scss/Forms.module.scss'

function Login({setLoggedIn}){
  const [loginData, setLoginData] = useState({
    login: "",
    password: ""
  });

  const navigate = useNavigate();
  
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginData.login,
        password: loginData.password
      })
    })
    
      .then(res => {
        return res.json();
      })
      .then(data => {
        if(data.success){
          navigate('/home')
        } else {
          alert("Incorrect data!");
        }
      }) 
  }


  return(
    <div className={styles.FormContainer}>
      <form method='POST' 
        onSubmit={handleLogin} 
        className={styles.Form}>

        <label htmlFor="login">Login:</label>
        <input type="email" 
          id="login" 
          name="login" 
          value={loginData.login} 
          onChange={updateLogin}/>

        <label htmlFor="password">Password</label>
        <input type="password" 
          id="password" 
          name="password" 
          value={loginData.password} 
          onChange={updateLogin}/>

        <button>Log-in</button>
      </form>
    </div>
  )
}

export default Login;