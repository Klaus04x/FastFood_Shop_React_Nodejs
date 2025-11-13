import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Route, Routes, Navigate} from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Categories from './pages/Categories/Categories'
import Edit from './pages/Edit/Edit'
import Statistics from './pages/Statistics/Statistics'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from './config';

const App = () => {
  const url = API_BASE_URL
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken')
    setIsAuthenticated(!!token)
    setLoading(false)
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    setIsAuthenticated(false)
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer/>
        <Login onLogin={handleLogin} />
      </>
    )
  }

  return (
    <div>
      <ToastContainer/>
      <Navbar onLogout={handleLogout}/>
      <hr />
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path='/add' element={<Add url={url}/>}/>
          <Route path='/list' element={<List url={url}/>}/>
          <Route path='/edit/:id' element={<Edit url={url}/>}/>
          <Route path='/orders' element={<Orders url={url}/>}/>
          <Route path='/categories' element={<Categories url={url}/>}/>
          <Route path='/statistics' element={<Statistics url={url}/>}/>
          <Route path='*' element={<Navigate to='/list' replace />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
