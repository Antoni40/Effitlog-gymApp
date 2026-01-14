import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import styles from '../scss/Forms.module.scss'

function Register(){
  const [registerData, setRegisterData] = useState({
    first_name: "",
    surname: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

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
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.signInContainer}>
        <h1>Sign-up</h1>
        <div className={styles.FormContainer}>
          <form method='POST'
            onSubmit={handleSubmit}
            className={styles.Form}>

            <label htmlFor="name">Name</label>
            <input type="text" 
              id="name" 
              name="first_name"
              value={registerData.first_name}
              onChange={handleChange}/>

            <label htmlFor="surname">Surname</label>
            <input type="text" 
              id="surname" 
              name="surname"
              value={registerData.surname}
              onChange={handleChange}/>

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
        <Link to="/login">Or Sign-in</Link>
      </div>
    </div>
  );
}

export default Register;