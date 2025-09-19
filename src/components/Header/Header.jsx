import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import './Header.css'

const Header = ({ userName }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login') // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message)
      alert('Failed to log out. Please try again.')
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <header className="app-header">
      <div className="header-logo">
        <h1>Crowdsourced Civic Reporting</h1>
      </div>
      <div className="user-profile" onClick={toggleDropdown}>
        <span className="user-name">Welcome, {userName}</span>
        <div className="user-icon">👤</div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => navigate('/profile')}>
              View Profile
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
