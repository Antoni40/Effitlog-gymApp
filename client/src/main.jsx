import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import WorkoutExecution from './pages/WorkoutExecution.jsx'
import EditWorkout from './pages/EditWorkout.jsx';
import AddWorkout from './pages/AddWorkout.jsx';
import Calendar from './pages/Calendar.jsx'
import Settings from './pages/Settings.jsx'
import './scss/main.scss'
import Exercises from './pages/Exercises.jsx'

const router = createBrowserRouter([
  {path: "/", element: <LandingPage />},
  {path: "/login", element: <Login />},
  {path: "/register", element: <Register />},
  {path: "/dashboard", element: <Dashboard />},
  {path: "/workouts/add", element: <AddWorkout/>},
  {path: "/workouts/:id", element: <WorkoutExecution/>},
  {path: "/workouts/:id/edit", element: <EditWorkout/>},
  {path: "workouts/calendar", element: <Calendar/>},
  {path: "/settings", element: <Settings />},
  {path: "/exercises", element: <Exercises />},
  {path: "*", element: <NotFoundPage />},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
