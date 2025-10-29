import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { storeContext } from '../../context/StoreContext';

const Navbar = ({setShowLogin}) => {

    const [menu, setMenu] = useState("home");

    const {getTotalCartAmount, token, setToken} =useContext(storeContext);

    const navigate = useNavigate();
    const location = useLocation();

    const logout = () =>{
        localStorage.removeItem("token");
        setToken("");
        navigate("/")
    }

    // Handle scrolling to anchor links when navigating from other pages
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                // Use a timeout to ensure the element is rendered before scrolling
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            const aboutUs = document.getElementById('about-us');
            const menuSection = document.getElementById('explore-menu');
            const footer = document.getElementById('footer');
            const scrollY = window.scrollY;

            // A small offset to make the change feel more natural
            const offset = 150;

            if (footer && scrollY >= footer.offsetTop - window.innerHeight + footer.offsetHeight / 2) {
                setMenu("contact-us");
            } else if (menuSection && scrollY >= menuSection.offsetTop - offset) {
                setMenu("menu");
            } else if (aboutUs && scrollY >= aboutUs.offsetTop - offset) {
                setMenu("about-us");
            } else {
                setMenu("home");
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <div className='navbar'>
      <div className="navbar-inner container">
        <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
        <ul className="navbar-menu">
            <Link to="/#home" onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</Link>
            <Link to='/#about-us' onClick={()=>setMenu("about-us")} className={menu==="about-us"?"active":""}>About Us</Link>
            <Link to='/#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</Link>
            <Link to='/#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>Contact Us</Link>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                <div className={getTotalCartAmount()===0?"":"dot"}></div>
            </div>
            {!token?<button onClick={()=>setShowLogin(true)}>Sign In</button>
            :<div className='navbar-profile'>
                    <img src={assets.profile_icon} alt="" />
                    <ul className="nav-profile-dropdown">
                        <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt=""/><p>Orders</p></li>
                        <hr />
                        <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                    </ul>
                </div>
            }
        </div>
      </div>
    </div>
  )
}

export default Navbar
