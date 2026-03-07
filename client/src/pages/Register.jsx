import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import isPasswordValid from '../utils/isPasswordValid.js'
import styles from '../scss/AuthForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import '../scss/main.scss';

function Register(){
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    first_name: "",
    surname: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e){
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e){
    e.preventDefault();

    if(!isPasswordValid(registerData.password)){
      alert(`The password doesn't meet requirements: 
      min. 8 characters, min. 1 digit, min. 1 symbol, 
      min. 1 upper case letter, min. 1 lower case letter`);
      
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/registerUser', {
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
        alert(err.message);
      }
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.signInContainer}>
        <h1>Sign-up</h1>
        <p>Create an account to get started.</p>
        <div className={styles.FormContainer}>
          <form method='POST'
            onSubmit={handleSubmit}
            className={styles.Form}>
            <div className={styles.namesContainer}>

              <div>
                <label htmlFor="name">First Name</label>
                <input type="text" 
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
                type="email" 
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
                  ><FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>

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