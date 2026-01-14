import image from '../assets/ronnie-coleman.jpg';
import styles from '../scss/Home.module.scss'

function Home(){
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
  return(
    <div className={styles.mainContainer}>
      <h1>Home</h1>
      <p>Yeah buddy!</p>
      <img src={image} width="500px"/>
      <button onClick={isUserLoggedIn}>Am I logged in?</button>
    </div>
  );
}

export default Home;