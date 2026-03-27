import styles from './Login.module.css';
// import { blogContext } from '../../blogContext';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SarfrozContext } from '../../sarfrozContext.js';

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
    return (
        <div className={styles.loginPage}>
            <h1 className={styles.askHeading}>Login Page</h1>

            <form action="/" method="post" onSubmit={handleSubmit}>
                <div>
                    {/* <label htmlFor="username">Username: </label> */}
                    <input placeholder="Username" type="text" name="username" id="username" required/>
                </div>

                <div>
                    {/* <label htmlFor="password">Password: </label> */}
                    <input placeholder='Password' type="password" name="password" id="password" required/>
                </div>
 
                <button type="submit" className={styles.loginButton}>Log in</button>
            </form>
        </div>
    );
};

export default Login;