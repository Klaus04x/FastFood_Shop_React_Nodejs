import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../../config'

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
                email,
                password
            })

            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token)
                localStorage.setItem('adminName', response.data.name)
                toast.success('Login successful')
                onLogin()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Error logging in')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='login-header'>
                    <h1>Admin Panel</h1>
                    <p>Sign in to manage your store</p>
                </div>

                <form className='login-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email Address</label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='admin@example.com'
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password'
                            required
                        />
                    </div>

                    <button type='submit' className='btn-login' disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className='login-footer'>
                    <p>Admin access only</p>
                </div>
            </div>
        </div>
    )
}

export default Login
