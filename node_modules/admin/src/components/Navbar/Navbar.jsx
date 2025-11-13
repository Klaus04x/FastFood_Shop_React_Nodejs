import React, { useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = ({ onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const adminName = localStorage.getItem('adminName') || 'Admin'

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className='navbar-right'>
        <span className='admin-name'>Welcome, {adminName}</span>
        <div className='profile-container'>
          <img
            className='profile'
            src={assets.profile_image}
            alt=""
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className='profile-dropdown'>
              <button onClick={onLogout} className='btn-logout'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
