import { Link } from 'react-router-dom'

function NotFoundPage(){
  return(
    <div class="page-container">
      <h1>The page you are searching for doesn't exist</h1>
      <p>Server code status 404</p>
      <Link to="/">
        <button className='return-button'>Go back home</button>
      </Link>
    </div>
  );
}

export default NotFoundPage;