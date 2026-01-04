import image from '../assets/ronnie-coleman.jpg';
import styles from '../scss/Home.module.scss'

function Home(){
  return(
    <div className={styles.mainContainer}>
      <h1>Home</h1>
      <p>Yeah buddy!</p>
      <img src={image} width="500px"/>
    </div>
  );
}

export default Home;