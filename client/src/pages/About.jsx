import { Link } from 'react-router-dom'

function About(){
  return(
    <>
      <h1>About this site</h1>
      <p>This site is amazing!</p>
      <Link to="/dashboard">Go back to dashboard</Link>
    </>
  );
}

export default About;