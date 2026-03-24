import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import styles from '../scss/AuthForm.module.scss';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import '../scss/main.scss';


function Login(){ 
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
  login: "",
  password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  function updateLogin(e){
    setError('');
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
        const res = await fetch('http://localhost:8080/api/auth/status', {
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

    const areInputFormsFilled = Object.values(loginData).every(value => 
      value.trim().length > 0);

    if(!areInputFormsFilled) {
      setError("Fill all fields");
      return;
    }
    else {
    try{
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: loginData.login, password: loginData.password}),
      })

        const res_data = await res.json();

        if(!res.ok){
          if(res_data.message === "Invalid login data"){
            setError('Invalid login data');
            return;
          } else {
            throw new Error("HTTP error: " + res.status);
          }
        }

        if(!res_data.success){
          throw new Error("Internal server error");
        }
        navigate('/dashboard');
        
    } catch(err) {
      console.error(err);
      setError("Something went wrong");
    }
  }
  }


  return(
    <div className={styles.contentContainer}>
      <div className={styles.signInContainer}>
        <h1>Sign-in</h1>
        <p>Welcome back! Please enter your details.</p>

        <div className={styles.formContainer}>
          <form onSubmit={(e) => {handleLogin(e)}} 
            className={styles.form}>

            <label htmlFor="login">E-mail</label>
            <input type="text"
              ref={emailRef} 
              id="login" 
              name="login" 
              value={loginData.login} 
              onChange={updateLogin}
              />

            <label htmlFor="password">Password</label>
            <div className={styles.passwordInputContainer}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password"
                name="password"
                value={loginData.password}
                onChange={updateLogin}/>

              <button type='button'
                className={styles.showPasswordToggler}
                onClick={() => {setShowPassword(prev => !prev)}}
                ><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

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