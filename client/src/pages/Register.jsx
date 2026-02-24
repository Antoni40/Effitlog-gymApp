import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import styles from '../scss/Forms.module.scss'

function Register(){
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    first_name: "",
    surname: "",
    email: "",
    password: ""
  });

  function handleChange(e){
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  function handleSubmit(e){
    e.preventDefault();

    fetch('http://localhost:8080/api/registerUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    })
       .then((res) => {
          return res.json()
       })
       .then((data) => {
        if(data.success){
          navigate('/login');
        } else {
          alert('register error');
        }
       })
       .catch((err) => {
        console.log(err);
        navigate('/login');
       })
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
            <input 
              type="password" 
              id="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}/>

              <button>Sign-up</button>
          </form>
        </div>
        <p> Already have an account?<br/>
        <Link to="/login">Sign-in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;