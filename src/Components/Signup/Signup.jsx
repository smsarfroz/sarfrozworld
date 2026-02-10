import styles from './Signup.module.css';
import { useContext, useEffect } from 'react';
import { SarfrozContext } from '../../sarfrozContext';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Signup = () => {
    const { userId, setUserId } = useContext(SarfrozContext);

    useEffect(() => {
        localStorage.setItem('userId', JSON.stringify(userId));
    }, [userId]);

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
            // window.location = '/login';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })
    } 
    return (
        <div>
            <h1>signup page</h1>

            <form action="/signup" method="post" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" required/>
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" required/>
                </div>

                <button type="submit" className={styles.signup}>Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;

