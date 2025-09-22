import React from 'react'
import './Header.css'
import Logo from '../../assets/logo.png'

const Header = () => {
  return (
    <div className="project-title-bar">
      <img src={Logo} alt="" />
      <h1>Crowdsourced Civic Reporting</h1>
    </div>
  )
}

export default Header
