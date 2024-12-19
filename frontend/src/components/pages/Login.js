import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/pages/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
    const [clientid, setClientID] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // State for loading
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate a slight delay to show the loading indicator
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); // Adjust time as needed
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        localStorage.clear();
        sessionStorage.clear();
        
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                clientid,
                email,
                password,
            });

            const data = response.data;
            if (data.respCode === '0') {
                localStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('user', JSON.stringify(data));
                navigate('/LocationSelect');
            } else {
                setError(data.respMessage || 'Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to connect to the server. Please try again later.');
        }
    };

    if (loading) {
        // Show a loading spinner or any desired loading style
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='login-page'>
            <div className='login-video'>
                <video autoPlay loop muted>
                    <source src='/video/LoginVid.mp4' type='video/mp4' />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className='login-container'>
                <h3>LOGIN</h3>
                {error && <div className='error'>{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className='form-floating form-floating-outline mb-4'>
                        <input
                            type='text'
                            className='form-control'
                            id='client'
                            name='clientid'
                            placeholder='Enter Client ID'
                            value={clientid}
                            onChange={(e) => setClientID(e.target.value)}
                            autoFocus
                            required
                        />
                        <label htmlFor='client'>Client ID</label>
                    </div>
                    <div className='form-floating form-floating-outline mb-4'>
                        <input
                            type='email'
                            className='form-control'
                            id='email'
                            name='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor='email'>Email</label>
                    </div>
                    <div className='mb-4'>
                        <div className='form-password-toggle'>
                            <div className='form-floating form-floating-outline'>
                                <input
                                    type='password'
                                    className='form-control'
                                    id='password'
                                    name='password'
                                    value={password}
                                    placeholder='&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;'
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor='password'>Password</label>
                            </div>
                        </div>
                    </div>
                    <div className='mb-3 pb-2 d-flex justify-content-between pt-2 align-items-center'>
                        <div className='form-check mb-0'>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                id='remember-me'
                            ></input>
                            <label
                                className='form-check-label'
                                htmlFor='remember-me'
                            >
                                Remember Me
                            </label>
                        </div>
                        <a href='*' className='float-end mb-1'>
                            <small>
                                <span>Forgot Password?</span>
                            </small>
                        </a>
                    </div>
                    <div className='mb-4'>
                        <button
                            className='btn btn-primary'
                            style={{ width: '100%' }}
                            type='submit'
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className='text-center mb-2'>
                    <small>
                        <span>New on our platform? </span>
                    </small>
                    <a href='*'>
                        <small>
                            <span>Create an account</span>
                        </small>
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
