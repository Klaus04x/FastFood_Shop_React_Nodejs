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

    const handleOAuthLogin = (provider) => {
        window.location.href = `${url}/api/auth/${provider}`;
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

                {currState === "Login" && (
                    <>
                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>
                        <div className="oauth-buttons">
                            <button type="button" className="oauth-button google" onClick={() => handleOAuthLogin('google')} disabled={loading}>
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"></path>
                                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"></path>
                                    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"></path>
                                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"></path>
                                </svg>
                                Google
                            </button>
                            <button type="button" className="oauth-button github" onClick={() => handleOAuthLogin('github')} disabled={loading}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </>
                )}

                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => { setCurrState("Sign Up"); setError(""); }}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => { setCurrState("Login"); setError(""); }}>Login here</span></p>
                }
            </form>
        </div>
    );
};

export default AuthPage;