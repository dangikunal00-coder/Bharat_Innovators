import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Dashboard from './components/Dashboard/Dashboard' // Your existing dashboard
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import Profile from './components/Profile/Profile'
// import ResetPassword from './components/ResetPassword/ResetPassword'
import './App.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading-spinner">
        <DotLottieReact src="path/to/animation.lottie" loop autoplay />
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
          <Route
            path="/profile"
            element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
