import styles from './Login.module.css';
// import { blogContext } from '../../blogContext';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SarfrozContext } from '../../sarfrozContext.js';
import sarfrozworld from '../../assets/sarfrozworldlogo.png';
import { toast } from 'react-toastify';
import getErrorMessage from '../../utils/getErrorMessage.js';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Login = () => {
    const navigate = useNavigate();
    const { userId, setUserId, loggedIn, setLoggedIn, setUsername } = useContext(SarfrozContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        localStorage.setItem('loggedIn', JSON.stringify(loggedIn));
        localStorage.setItem('userId', JSON.stringify(userId));

        if (loggedIn === false) {
            localStorage.removeItem('token');
        } 

    }, [loggedIn, userId]);
     
    function handleLogin(token) {
        setLoggedIn(true);
        localStorage.setItem('token', (token));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        setLoading(true);

        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log("data", data);
        localStorage.setItem('username', JSON.stringify(data['username']));
        setUsername(data['username']);

        fetch(`${VITE_BASE_URL}/login`, {
            mode: 'cors',
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (!response.ok) {
                setLoading(false);
                console.log('response', response);
                return response.json().then(errorData => {
                    setError(errorData.error);
                    console.error('Server errors:', errorData.error);
                    toast.error(getErrorMessage(response.status));
                    throw new Error(`HTTP error! status: ${response.status}`);
                })
            }
            return response.json();
        })
        .then((response) => {
            // console.log('response: ', response);
            // console.log('user logged in successfully:');
            handleLogin(response.token);
            setUserId(response.user.id);
            // console.log('loggedIn: ', loggedIn);
            setLoading(false);
            toast.success("Logged in successfully");
            navigate('/');
        })
        .catch(error => {
            setLoading(false);
            console.error('There was a problem with the fetch operation:', error);
            toast.error('There was a problem with the fetch operation');
        })
    }

    function handleGuestClick() {
        navigate('/signup');
    }
    function handleSignClick() {
        navigate('/signup');
    }
    const blurredButton = {
        backgroundColor: "rgb(118, 118, 241)"
    };

    return (
        <div className={styles.loginPage}>
            <img src={sarfrozworld} alt="" className={styles.logo}/>

            <form action="/" method="post" onSubmit={handleSubmit}>
                <input placeholder="Username" type="text" name="username" id="username" onChange={() => setError(null)} required/>

                <input placeholder='Password' type="password" name="password" id="password" minLength={8} onChange={() => setError(null)} required/>
                
                <button type="submit" className={styles.loginButton} style={ loading ? blurredButton : null }>Log in</button>

            </form>
            
            <p className={styles.error}>{error}</p>
            <button className={styles.signButton} onClick={() => handleSignClick()}>Sign up</button>
            <button className={styles.guestButton} onClick={() => handleGuestClick()}>Guest login</button>
            <p className={styles.text}>By signing in, you agree to our terms of service and privacy policy.</p>
        </div>
    );
};

export default Login;