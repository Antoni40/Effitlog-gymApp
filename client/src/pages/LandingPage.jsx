import { Link } from "react-router-dom";
import styles from '../scss/LandingPage.module.scss'
import image from '../assets/cbum-31-07-2024-0001_480x480.webp'
import Navbar from '../components/NavigationBar';
import '../scss/main.scss';
import icon from '../assets/app_logo.png';

function LandingPage(){
  return(
    <div>
      <Navbar links={[{name: 'Sign-in', path: '/login'}, 
        {name: 'Sign-up', path: '/register'}]}/>
        
      <main>
        <div className={styles.mainContent}>

          <div className={styles.appTitleContainer}>
            <img src={icon} alt="Effitlog" />
            <p>The best way to stay consistent.</p>
          </div>

          <div className={styles.appPictureContainer}>
            <img src={image} alt="Picture from workouts planner"/>
          </div>

        </div>
        <section className={styles.discoverySection}>

          <h2>About</h2>
          <p>Effitlog is a gym tracking app that helps people monitor their progress, achieve their goals, and build better training habits.</p>

          <h2>Muscle Groups</h2>
          <Link to={'/exercises'}>
            See all
          </Link>

        </section>
      </main>
    </div>
  );
}

export default LandingPage;