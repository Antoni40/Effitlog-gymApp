import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Users from './Users.jsx'
import Workouts from './pages/Workouts.jsx'
import About from './pages/About.jsx';
import EditWorkout from './pages/EditWorkout.jsx';
import AddWorkout from './pages/AddWorkout.jsx';
import DeleteWorkout from './pages/DeleteWorkout.jsx'
import './scss/main.scss'

const router = createBrowserRouter([
  {path: "/", element: <LandingPage />},
  {path: "/login", element: <Login />},
  {path: "/register", element: <Register />},
  {path: "/dashboard", element: <Dashboard />},
  {path: "/users", element: <Users />},
  {path: "/about", element: <About />},
  {path: "/workouts/add", element: <AddWorkout/>},
  {path: "/workouts/:id", element: <Workouts/>},
  {path: "/workouts/:id/edit", element: <EditWorkout/>},
  {path: "/workout/delete", element: <DeleteWorkout/>},
  {path: "*", element: <NotFoundPage />},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
