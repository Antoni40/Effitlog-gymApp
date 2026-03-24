import { Link } from 'react-router-dom';
import styles from '../scss/Navbar.module.scss';

function Navbar({links}){
  return(
    <header className={styles.navHeader}>
      <div className={styles.navContainer}>
        <nav className={styles.mainNavigation}>
          <div className={styles.logoContainer}>
            <Link to={'/'}>
              Home
            </Link>
          </div>
          <div className={styles.buttonsContainer}>
            {links.map((link, index) =>  {
              if(link.onClick){
                return (
                  <button 
                  key={index}
                  onClick={link.onClick}
                  className={styles.navButton}>
                    {link.name}
                  </button>
                )
              }
              return (
                <Link to={link.path} key={index}>
                  {link.name}
                </Link>
              )}
            )}
          </div>
          </nav>
        </div>
      </header>
  )
}

export default Navbar;