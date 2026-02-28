import { Link } from 'react-router-dom'
import Navbar from '../components/NavigationBar';
import '../scss/main.scss';

function Settings(){
    return (
        <div>
            <Navbar links={[{name: "Go to the dashboard", path: '/dashboard'}]}/>
            <h1>Settings</h1>
            <p>There will be some settings or not?</p>
        </div>  
    )
}

export default Settings;