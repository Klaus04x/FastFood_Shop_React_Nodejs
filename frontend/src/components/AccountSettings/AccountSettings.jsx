import React, { useState, useEffect, useContext } from 'react'
import './AccountSettings.css'
import { storeContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AccountSettings = ({ onProfileUpdate }) => {
    const { url, token } = useContext(storeContext)
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        avatar: ''
    })
    const [formData, setFormData] = useState({
        name: '',
        avatar: ''
    })
    const [avatarPreview, setAvatarPreview] = useState('')
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

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
                setFormData({
                    name: user.name,
                    avatar: user.avatar || ''
                })
                setAvatarPreview(user.avatar || '')
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

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle avatar input change
    const handleAvatarChange = (e) => {
        const value = e.target.value
        setFormData(prev => ({
            ...prev,
            avatar: value
        }))
        setAvatarPreview(value)
    }

    // Handle file upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
            return
        }

        setUploading(true)
        try {
            const formDataUpload = new FormData()
            formDataUpload.append('avatar', file)

            const response = await axios.post(`${url}/api/user/upload-avatar`, formDataUpload, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                const imageUrl = response.data.imageUrl
                setFormData(prev => ({
                    ...prev,
                    avatar: imageUrl
                }))
                setAvatarPreview(imageUrl)
                toast.success('Image uploaded successfully')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Error uploading image')
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    // Handle save
    const handleSave = async (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.error('Name cannot be empty')
            return
        }

        setLoading(true)
        try {
            const response = await axios.post(`${url}/api/user/update-profile`, formData, {
                headers: { token }
            })

            if (response.data.success) {
                toast.success('Profile updated successfully')
                setUserData({
                    ...userData,
                    name: formData.name,
                    avatar: formData.avatar
                })
                // Update localStorage
                localStorage.setItem('userName', formData.name)
                setIsEditing(false)
                // Call parent callback to refresh sidebar
                if (onProfileUpdate) {
                    onProfileUpdate()
                }
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Error updating profile')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            name: userData.name,
            avatar: userData.avatar
        })
        setAvatarPreview(userData.avatar)
        setIsEditing(false)
    }

    // Get avatar display
    const getAvatarDisplay = () => {
        const avatarUrl = isEditing ? avatarPreview : userData.avatar
        if (avatarUrl) {
            return <img src={avatarUrl} alt="Avatar" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
        }
        return null
    }

    // Get initials
    const getInitials = () => {
        return userData.name?.charAt(0).toUpperCase() || 'U'
    }

    return (
        <div className='account-settings'>
            <div className="account-settings-header">
                <h2>Account Settings</h2>
                {!isEditing && (
                    <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="account-settings-content">
                {!isEditing ? (
                    // View Mode
                    <div className="profile-view">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar-large">
                                {getAvatarDisplay()}
                                <div className="avatar-fallback" style={{ display: userData.avatar ? 'none' : 'flex' }}>
                                    {getInitials()}
                                </div>
                            </div>
                            <div className="profile-avatar-info">
                                <h3>{userData.name}</h3>
                                <p>{userData.email}</p>
                            </div>
                        </div>

                        <div className="profile-details">
                            <div className="info-row">
                                <label>Full Name</label>
                                <p>{userData.name}</p>
                            </div>
                            <div className="info-row">
                                <label>Email Address</label>
                                <p>{userData.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <form className="profile-edit-form" onSubmit={handleSave}>
                        <div className="form-section">
                            <h3>Profile Picture</h3>
                            <div className="avatar-edit-section">
                                <div className="profile-avatar-large">
                                    {getAvatarDisplay()}
                                    <div className="avatar-fallback" style={{ display: avatarPreview ? 'none' : 'flex' }}>
                                        {formData.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <div className="avatar-input-group">
                                    <label>Avatar URL</label>
                                    <input
                                        type="text"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleAvatarChange}
                                        placeholder="Enter image URL (e.g., https://example.com/avatar.jpg)"
                                    />
                                    <p className="input-hint">Enter a URL to your profile picture</p>

                                    <div className="upload-divider">
                                        <span>OR</span>
                                    </div>

                                    <label htmlFor="avatar-file-upload" className="btn-upload-avatar">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                        {uploading ? 'Uploading...' : 'Upload from Storage'}
                                    </label>
                                    <input
                                        id="avatar-file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        style={{ display: 'none' }}
                                    />
                                    <p className="input-hint">Max file size: 5MB (JPG, PNG, GIF)</p>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Personal Information</h3>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    disabled
                                    className="disabled-input"
                                />
                                <p className="input-hint">Email cannot be changed</p>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel-edit" onClick={handleCancel} disabled={loading}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-save-profile" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AccountSettings
