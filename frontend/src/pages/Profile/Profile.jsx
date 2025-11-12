import React, { useState, useEffect, useContext } from 'react'
import './Profile.css'
import AddressBook from '../../components/AddressBook/AddressBook'
import AccountSettings from '../../components/AccountSettings/AccountSettings'
import { storeContext } from '../../context/StoreContext'
import axios from 'axios'

const Profile = () => {
    const { url, token } = useContext(storeContext)
    const [activeTab, setActiveTab] = useState('account')
    const [userData, setUserData] = useState({
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || '',
        avatar: ''
    })

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const response = await axios.post(`${url}/api/user/profile`, {}, {
                headers: { token }
            })
            if (response.data.success) {
                const user = response.data.user
                setUserData({
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar || ''
                })
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    useEffect(() => {
        if (token) {
            fetchUserData()
        }
    }, [token])

    // Function to refresh user data (can be called from child components)
    const refreshUserData = () => {
        fetchUserData()
    }

    return (
        <div className='profile'>
            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="profile-user">
                        <div className="user-avatar">
                            {userData.avatar ? (
                                <img
                                    src={userData.avatar}
                                    alt="Avatar"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                    }}
                                />
                            ) : null}
                            <span style={{ display: userData.avatar ? 'none' : 'flex' }}>
                                {userData.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="user-info">
                            <h3>{userData.name}</h3>
                            <p>{userData.email}</p>
                        </div>
                    </div>

                    <div className="profile-menu">
                        <button
                            className={`menu-item ${activeTab === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            Account Settings
                        </button>
                        <button
                            className={`menu-item ${activeTab === 'addresses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('addresses')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            My Addresses
                        </button>
                    </div>
                </div>

                <div className="profile-content">
                    {activeTab === 'account' && <AccountSettings onProfileUpdate={refreshUserData} />}
                    {activeTab === 'addresses' && <AddressBook />}
                </div>
            </div>
        </div>
    )
}

export default Profile
