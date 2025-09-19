import React, { useState } from 'react'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../../firebase'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false) // State for the loader
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true) // Start the loader
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('User logged in successfully!')
      navigate('/')
    } catch (err) {
      console.error('Error logging in:', err.message)
      setError(err.message)
      setMessage('')
    } finally {
      setIsLoading(false) // Stop the loader regardless of success or failure
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password.')
      setMessage('')
      return
    }
    setIsLoading(true) // Start the loader
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset email sent! Please check your inbox.')
      setError('')
    } catch (err) {
      console.error('Error sending reset email:', err.message)
      setError(err.message)
      setMessage('')
    } finally {
      setIsLoading(false) // Stop the loader
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <div className="forgot-password-link-container">
          <span onClick={handlePasswordReset} className="forgot-password-link">
            Forgot Password?
          </span>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
