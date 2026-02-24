import { Link } from 'react-router-dom'

function Settings(){
    return (
        <div>
            <h1>Settings</h1>
            <Link to="/dashboard">Go back to dashboard</Link>
        </div>  
    )
}

export default Settings;