import React, { useContext, useState } from 'react';
import './AuthPage.css'; // Sẽ cập nhật CSS bên dưới
import { assets } from '../../assets/assets';
import { storeContext } from '../../context/StoreContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const { setToken, url } = useContext(storeContext);

    const navigate = useNavigate(); // Khởi tạo hook useNavigate
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        setError(""); // Xóa lỗi cũ
        setLoading(true);

        const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
        const newUrl = url + endpoint;

        try {
            const response = await axios.post(newUrl, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                navigate("/"); // Chuyển hướng về trang chủ
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Authentication error:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-page'>
            <form onSubmit={onLogin} className="auth-page-container">
                <div className="auth-page-header">
                    <Link to="/" className='auth-page-logo'>
                        <img src={assets.logo} alt="Tomato" />
                    </Link>
                    <p>Welcome back! Please enter your details.</p>
                </div>
                <div className="auth-page-title">
                    <h2>{currState}</h2>
                </div>
                <div className="auth-page-inputs">
                    {currState === "Sign Up" && (
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required disabled={loading} />
                    )}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required disabled={loading} />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required disabled={loading} />
                </div>
                <button type='submit' disabled={loading}>
                    {loading ? "Processing..." : (currState === "Sign Up" ? "Create account" : "Login")}
                </button>
                {error && <p className="auth-page-error">{error}</p>}
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => { setCurrState("Sign Up"); setError(""); }}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => { setCurrState("Login"); setError(""); }}>Login here</span></p>
                }
            </form>
        </div>
    );
};

export default AuthPage;