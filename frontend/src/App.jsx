import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Profile from './pages/Profile/Profile'
import AuthPage from './pages/Auth/AuthPage'
import OAuthCallback from './pages/Auth/OAuthCallback'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import BlankLayout from './layouts/BlankLayout'

const App = () => {

  return (
    <>
      <Routes>
        {/* Routes sử dụng layout có Navbar và Footer */}
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/verify' element={<Verify />} />
          {/* Routes cần đăng nhập */}
          <Route element={<ProtectedRoute />}>
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/myorders' element={<MyOrders />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>
        {/* Route cho trang login, không có Navbar và Footer */}
        <Route path='/login' element={<BlankLayout />}>
          <Route index element={<AuthPage />} />
        </Route>
        {/* OAuth callback route */}
        <Route path='/auth/callback' element={<OAuthCallback />} />
      </Routes>
    </>
  )
}

export default App
