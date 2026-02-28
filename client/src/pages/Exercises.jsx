import { iconsUpperBody, iconsLowerBody } from '../assets/icons.js';
import styles from '../scss/Exercises.module.scss';
import '../scss/main.scss';

function Exercises(){

  return (
    <>
      <h1>Exercises</h1>
      <h2 className={styles.bodyDivideTitle}>Upper Body</h2>
      <section className={styles.muscleGroupContainer}>
  
        {Object.entries(iconsUpperBody).map(([key, value]) =>
          <div className={styles.muscleGroup}>
            <img src={value} alt='img'/>
            <p>{key.split('_').join(' ')}</p>
          </div>
        )}
        
      </section>

      <h2 className={styles.bodyDivideTitle}>Upper Body</h2>
      <section className={styles.muscleGroupContainer}>
        {Object.entries(iconsLowerBody).map(([key, value]) =>
          <div className={styles.muscleGroup}>
            <img src={value} alt='img'/>
            <p>{key.split('_').join(' ')}</p>
          </div>
        )}
      </section>
        
    </>
  );
}

export default Exercises;