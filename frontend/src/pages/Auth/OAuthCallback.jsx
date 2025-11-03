import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { storeContext } from '../../context/StoreContext';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setToken } = useContext(storeContext);

    useEffect(() => {
        const token = searchParams.get('token');
        const provider = searchParams.get('provider');
        const error = searchParams.get('error');

        if (error) {
            console.error('OAuth error:', error);
            navigate('/login?error=' + error);
            return;
        }

        if (token) {
            // Store token in localStorage and context
            localStorage.setItem('token', token);
            setToken(token);

            // Redirect to home page
            navigate('/');
        } else {
            // No token received, redirect to login
            navigate('/login?error=no_token');
        }
    }, [searchParams, navigate, setToken]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            fontSize: '18px',
            color: '#666'
        }}>
            <p>Processing login...</p>
        </div>
    );
};

export default OAuthCallback;
