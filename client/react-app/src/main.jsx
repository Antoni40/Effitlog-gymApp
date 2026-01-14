import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Users from './Users.jsx'
import About from './pages/About.jsx';
import './scss/main.scss'

const router = createBrowserRouter([
  {path: "/", element: <LandingPage />},
  {path: "/login", element: <Login />},
  {path: "/register", element: <Register />},
  {path: "/dashboard", element: <Dashboard />},
  {path: "/users", element: <Users />},
  {path: "/about", element: <About />},
  {path: "*", element: <NotFoundPage />}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
