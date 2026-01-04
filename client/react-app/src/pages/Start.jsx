import { Link} from "react-router-dom";
import styles from '../scss/Start.module.scss'
import image from '../assets/cbum-31-07-2024-0001_480x480.webp'

function Start(){
  return(
    <div>
      <header>
          <nav>
            <div className={styles.logoContainer}>
              <img src="" alt="Logo" />
            </div>
            <div className="buttons-container">
              <Link to="/login">
                Log-in
              </Link>
              <Link to="/register">
                Sign-in
              </Link>
            </div>
          </nav>
      </header>
      <main>
        <div className={styles.mainContent}>
          <div className={styles.appTitleContainer}>
            <h1>EffitLog</h1>
            <p>The best way to stay consistent.</p>
          </div>
          <div className={styles.appPictureContainer}>
            <img src={image} alt="Picture from workouts planner"/>
          </div>
        </div>
      </main>
      </div>

  );
}

export default Start;