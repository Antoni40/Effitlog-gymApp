import { useNavigate, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import isPasswordValid from '../utils/isPasswordValid.js'
import styles from '../scss/AuthForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import '../scss/main.scss';
import isEmailValid from '../utils/isEmailValid.js';

function Register(){
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    first_name: "",
    surname: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const firstNameRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    firstNameRef.current.focus();
  }, [])

  function handleChange(e){
    setError('');
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e){
    setError('');
    e.preventDefault();
    
    const areInputFormsFilled = Object.values(registerData).every(value => 
      value.trim().length > 0);

    if(!areInputFormsFilled) {
      setError("Fill all fields");
      return;
    }

    const passwordValid = isPasswordValid(registerData.password);
    const emailValid = isEmailValid(registerData.email);

    if(!emailValid) {
      setError("Invalid email format");
      return;
    }

    if(!passwordValid) {
      setError("Password requirements: min 8 chars, 1 digit, 1 symbol, 1 uppercase, 1 lowercase");
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      })

      if(!res.ok){
        throw new Error("HTTP error: " + res.status);
      }
      
      const res_data = await res.json()

      if(!res_data.success){
        throw new Error('Internal server error');
      } 
      navigate('/login');

    } catch (err) {
        console.error(err);
        setError("Something went wrong")
      }
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.signInContainer}>
        <h1>Sign-up</h1>
        <p>Create an account to get started.</p>
        <div className={styles.formContainer}>
          <form method='POST'
            onSubmit={handleSubmit}
            className={styles.form}>
            <div className={styles.namesContainer}>

              <div>
                <label htmlFor="name">First Name</label>
                <input type="text" 
                  ref={firstNameRef}
                  id="name" 
                  name="first_name"
                  value={registerData.first_name}
                  onChange={handleChange}/>
              </div>

              <div>
                <label htmlFor="surname">Last Name</label>
                <input type="text" 
                  id="surname" 
                  name="surname"
                  value={registerData.surname}
                  onChange={handleChange}/>
                </div>
              </div>

              <label htmlFor="email">E-mail</label>
              <input 
                type="text" 
                id="email" 
                name="email"
                value={registerData.email}
                onChange={handleChange}/>
            
              <label htmlFor="password">Password</label>
              <div className={styles.passwordInputContainer}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleChange}/>

                <button type='button'
                  className={styles.showPasswordToggler}
                  onClick={() => {setShowPassword(prev => !prev)}}
                  ><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              
              {error && <p className={styles.error}>{error}</p>}

              <button>Sign-up</button>

          </form>
        </div>

        <p> 
          Already have an account?<br/>
          <Link to="/login">Sign-in</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;