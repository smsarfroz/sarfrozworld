import styles from './Login.module.css';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SarfrozContext } from '../../sarfrozContext.js';
import sarfrozworld from '../../assets/sarfrozworldlogo.png';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';
import getErrorMessage from '../../utils/getErrorMessage.js';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'universal-cookie';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Login = () => {
    const navigate = useNavigate();
    const { loggedIn, setLoggedIn, userObj, setUserObj } = useContext(SarfrozContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const cookies = new Cookies();
     
    function handleLogin(token) {
        const decoded = jwtDecode(token);
        setUserObj(decoded);
        cookies.set("jwt_authorization", token, {
            expires: new Date(decoded.exp * 1000),  
        });
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

        const myPromise = fetch(`${VITE_BASE_URL}/login`, {
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
            handleLogin(response.token);
            setLoading(false);
            toast.success("Logged in successfully");
            navigate('/');
        })
        .catch(error => {
            setLoading(false);
            console.error('There was a problem with the fetch operation:', error);
            toast.error('There was a problem with the fetch operation');
        })

        toast.promise(myPromise, {
            loading: 'logging in...'
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