import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="container footer-shell">
        <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Your favorite meals, delivered fast. Tomato is your go-to for quick, delicious food delivery. We connect you with the best local restaurants to bring fresh, flavorful dishes right to your door.</p>
            <div className="footer-social-icons">
                <a href="https://www.facebook.com/NguyenTienThanh.Ha" target="_blank" rel="noopener noreferrer">
                    <img src={assets.facebook_icon} alt="Facebook" />
                </a>
                <a href="https://github.com/Klaus04x" target="_blank" rel="noopener noreferrer">
                    <img src={assets.github_logo_icon} alt="GitHub"/>
                </a>
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li><Link to="/#home">Home</Link></li>
                <li><Link to="/#about-us">About us</Link></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>235 Hoang Quoc Viet Street, Bac Tu Liem, Ha Noi</li>
                <li>thanhnt.22810310382@epu.edu.vn</li>
                <li>huyenpn.22810310376@epu.edu.vn</li>
            </ul>
        </div>
        </div>
        <hr />
        <p className="footer-copyright">Copyright 2024 © Tomato.com - All Right Reserved</p>
      </div>
    </div>
  )
}

export default Footer
