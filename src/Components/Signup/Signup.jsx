import styles from './Signup.module.css';
import { useContext, useEffect } from 'react';
import { SarfrozContext } from '../../sarfrozContext';
import { Link, useNavigate } from 'react-router-dom';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Signup = () => {
    const navigate = useNavigate();
    const { userId, setUserId, loggedIn, setLoggedIn, setUsername } = useContext(SarfrozContext);

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

    function handleUserIdChange(id) {
        setUserId(id);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log(data);

        fetch(`${VITE_BASE_URL}/signup`, {
            mode: 'cors',
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            console.log('response', response);
            console.log('type', typeof response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((user) => {
            handleUserIdChange(user.id);
            console.log(user);
            console.log('user created successfully:');
            navigate('/login');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
    } 

    function handleGuestSubmit() {

        // let data = {};

        // console.log("data", data);
        // localStorage.setItem('username', JSON.stringify(data['username']));
        // setUsername(data['username']);

        fetch(`${VITE_BASE_URL}/login`, {
            mode: 'cors',
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: "Guest User",
                password: "sharedpassword123"
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((response) => {
            console.log('response: ', response);
            console.log('user logged in successfully:');
            handleLogin(response.token);
            setUserId(response.user.id);
            // console.log('loggedIn: ', loggedIn);
            navigate('/');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
    }
    return (
        <div>
            <div className={styles.guestPage}>
                
                <h2 className={styles.askHeading}>Continue as Guest</h2>
                <div className={styles.guestText}>
                    <p>You can browse without creating an account.</p>
                    <p>You'll have a chance to create account later.</p>
                </div>

                <button type='submit' className={styles.guestButton} onClick={handleGuestSubmit}>Continue As Guest</button>
            </div>

            <div className={styles.verticalLine}></div>
            <div className={styles.signupPage}>
                <h2 className={styles.askHeading}>Sign Up</h2>
                <form action="/signup" method="post" onSubmit={handleSubmit}>
                    <input type="text" name="username" id="username" placeholder='Username*' required/>
                    <input type="password" name="password" id="password" placeholder='Password*' required/>
                    <button type="submit" className={styles.signupButton}>Sign Up</button>
                </form>
                <p className={styles.text}>Already have an account? <Link to='/login' className={styles.loginPrompt}>Sign in</Link></p>
            </div>
        </div>
    );
};

export default Signup;

