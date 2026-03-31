import styles from './Login.module.css';
// import { blogContext } from '../../blogContext';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SarfrozContext } from '../../sarfrozContext.js';
import sarfrozworld from '../../assets/sarfrozworldlogo.png';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Login = () => {
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

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

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

    function handleGuestClick() {
        navigate('/signup');
    }
    function handleSignClick() {
        navigate('/signup');
    }

    return (
        <div className={styles.loginPage}>
            <img src={sarfrozworld} alt="" className={styles.logo}/>
            {/* <h2 className={styles.askHeading}>sarfrozworld</h2> */}

            <form action="/" method="post" onSubmit={handleSubmit}>
                <input placeholder="Username" type="text" name="username" id="username" required/>

                <input placeholder='Password' type="password" name="password" id="password" minLength={8} required/>
 
                <button type="submit" className={styles.loginButton}>Log in</button>

            </form>
            
            <button className={styles.signButton} onClick={() => handleSignClick()}>Sign up</button>
            <button className={styles.guestButton} onClick={() => handleGuestClick()}>Guest login</button>
            <p className={styles.text}>By signing in, you agree to our terms of service and privacy policy.</p>
        </div>
    );
};

export default Login;