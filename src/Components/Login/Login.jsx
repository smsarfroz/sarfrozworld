import styles from './Login.module.css';
// import { blogContext } from '../../blogContext';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Login = () => {
    // const { loggedIn, setLoggedIn, setUsername } = useContext(blogContext);

    // useEffect(() => {
    //     localStorage.setItem('loggedIn', JSON.stringify(loggedIn));

    //     if (loggedIn === false) {
    //         localStorage.removeItem('token');
    //     }

    // }, [loggedIn]);

    function handleLogin(token) {
        // setLoggedIn(true);
        localStorage.setItem('token', (token));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log(data);
        localStorage.setItem('username', JSON.stringify(data['username']));
        // setUsername(data['username']);

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
            // console.log('loggedIn: ', loggedIn);
            // window.location = '/';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
    }
    return (
        <div>
            <h1>Login Page</h1>

            <form action="/" method="post" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" id="username" required/>
                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" name="password" id="password" required/>
                </div>

                <button type="submit" className={styles.login}>Log in</button>
            </form>
        </div>
    );
};

export default Login;