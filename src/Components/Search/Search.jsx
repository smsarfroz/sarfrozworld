import { Link } from 'react-router-dom';
import styles from './Search.module.css';
import { useContext } from 'react';
import { SarfrozContext } from '../../sarfrozContext.js';
const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Search = () => {
    const { usersData } = useContext(SarfrozContext);

    return (
        <div className={styles.searchPage}>
            <input type="text" placeholder='Search users...'/>
            {
                usersData.map(user => {
                    return (
                        <>
                            <div className={styles.user}>
                                <div className={styles.leftPart}>
                                    <img src={user.photo} alt="" className={styles.userPhoto}/>
                                    <p>{user.username}</p>
                                </div>
                                <button>Follow</button>
                            </div>
                        </>
                    )
                })
            }
        </div>
    )
};

export default Search;