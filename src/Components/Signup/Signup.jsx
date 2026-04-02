import styles from './Signup.module.css';
import { useContext, useEffect, useState } from 'react';
import { SarfrozContext } from '../../sarfrozContext';
import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Signup = () => {
    const navigate = useNavigate();
    const { userId, setUserId, loggedIn, setLoggedIn } = useContext(SarfrozContext);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [uFocus, setUFocus] = useState(false);
    const [pFocus, setPFocus] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading1, setLoading1] = useState(false);


    useEffect(() => {
        localStorage.setItem('loggedIn', JSON.stringify(loggedIn));
        localStorage.setItem('userId', JSON.stringify(userId));

        if (loggedIn === false) {
            localStorage.removeItem('token');
        } 

    }, [loggedIn, userId]);

    const validationCriteria = useMemo(() => {
        return {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

    }, [password]);

    const validateUsername = useMemo(() => {
        return {
            minLength: username.length >= 3
        };
    }, [username]);
     
    function handleLogin(token) {
        setLoggedIn(true);
        localStorage.setItem('token', (token));
    }

    function handleUserIdChange(id) {
        setUserId(id);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading2(true);
        const formData = new FormData(e.target);

        let data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

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
            if (!response.ok) {
                setLoading2(false);
                return response.json().then(errorData => {
                    console.error('Server errors:', errorData.errors);
                    throw new Error(`HTTP error! status: ${response.status}`);
                })
            }
            return response.json();
        })
        .then((user) => {
            handleUserIdChange(user.id);
            console.log(user);
            console.log('user created successfully:');
            setLoading2(false);
            navigate('/login');
        })
        .catch(error => {
            setLoading2(false);
            console.error('There was a problem with the fetch operation:', error);
        })
    } 

    function handleGuestSubmit() {

        // let data = {};

        // console.log("data", data);
        // localStorage.setItem('username', JSON.stringify(data['username']));
        // setUsername(data['username']);
        setLoading1(true);
        setPFocus(false);
        setUFocus(false);

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
                setLoading1(false);
                return response.json().then(errorData => {
                    console.error('Server errors:', errorData.errors);
                    throw new Error(`HTTP error! status: ${response.status}`);
                })
                // throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((response) => {
            console.log('user logged in successfully:');
            handleLogin(response.token);
            setUserId(response.user.id);
            // console.log('loggedIn: ', loggedIn);
            setLoading1(false);
            navigate('/');
        })
        .catch(error => {
            setLoading1(false);
            console.error('There was a problem with the fetch operation:', error);
        })
    }

    function handleSignIn(e) {
        if (!validateUsername.minLength ||
            !validationCriteria.hasLowerCase ||
            !validationCriteria.hasNumber ||
            !validationCriteria.hasSpecialChar ||
            !validationCriteria.hasUpperCase ||
            !validationCriteria.minLength
        ) {
            // e.preventDefault();
            setPFocus(true);
            setUFocus(true);
        }
    }

    const blurredButton = {
        backgroundColor: "rgb(118, 118, 241)"
    };

    return (
        <div>
            <div className={styles.guestPage}>
                
                <h2 className={styles.askHeading}>Continue as Guest</h2>
                <div className={styles.guestText}>
                    <p>You can browse without creating an account.</p>
                    <p>You'll have a chance to create account later.</p>
                </div>

                <button type='submit' className={styles.guestButton} style={ loading1 ? blurredButton : null } onClick={handleGuestSubmit}>Continue As Guest</button>
            </div>

            <div className={styles.verticalLine}></div>
            <div className={styles.signupPage}>
                <h2 className={styles.askHeading}>Sign Up</h2>
                <form action="/signup" method="post" onSubmit={handleSubmit}>
                    <input type="text" name="username" id="username" placeholder='Username*' onFocus={() => setUFocus(true)} maxLength={13} onChange={(e) => setUsername(e.target.value)}  required/>
                    {uFocus ?
                        <div className={styles.message1}>
                            <p className={`${validateUsername.minLength ? styles.valid : styles.invalid}`}>
                            At least 3 characters
                            </p>
                        </div> : 
                        null
                    }
                    
                    <input type="password" name="password" id="password" placeholder='Password*' onFocus={() => setPFocus(true)} maxLength={13} value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    
                    {pFocus ? 

                        <div className={styles.message}>
                            <p className={`${validationCriteria.minLength ? styles.valid : styles.invalid}`}>
                            Minimum of 8 characters
                            </p>
                            <p className={`${validationCriteria.hasUpperCase ? styles.valid : styles.invalid}`}>
                            At least one capital letter
                            </p>
                            <p className={`${validationCriteria.hasLowerCase ? styles.valid : styles.invalid}`}>
                            At least one lowercase letter
                            </p>
                            <p className={`${validationCriteria.hasNumber ? styles.valid : styles.invalid}`}>
                            At least one number
                            </p>
                            <p className={`${validationCriteria.hasSpecialChar ? styles.valid : styles.invalid}`}>
                            At least one special character
                            </p>
                        </div> :
                        null
                    }
                    <button type="submit" className={styles.signupButton} style={loading2 ? blurredButton : null} onClick={(e) => handleSignIn(e)}>Sign Up</button>
                </form>
                <p className={styles.text}>Already have an account? <Link to='/login' className={styles.loginPrompt}>Sign in</Link></p>
            </div>
        </div>
    );
};

export default Signup;

