import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Start from './pages/Start.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Home from './pages/Home.jsx'
import Users from './Users.jsx'
import './scss/main.scss'

const router = createBrowserRouter([
  {path: "/", element: <Start />},
  {path: "/login", element: <Login />},
  {path: "/register", element: <Register />},
  {path: "/home", element: <Home />},
  {path: "*", element: <NotFoundPage />}, 
  {path: "/users", element: <Users />}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
