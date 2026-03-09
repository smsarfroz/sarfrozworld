import { Link } from 'react-router-dom';
import styles from './Search.module.css';
import { useContext, useState } from 'react';
import { SarfrozContext } from '../../sarfrozContext.js';
const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Search = () => {
    const { usersData } = useContext(SarfrozContext);
    const [query, setQuery] = useState("");

    // console.log('query', query);
    
    const handleFilter = (user) => {
        // console.log('user, query', user, query, user.username.toLowerCase());
        let myQuery = query.toLowerCase();
        if (myQuery === '' || user.username.toLowerCase().includes(query)) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className={styles.searchPage}>
            <input type="text" placeholder='Search users...' value={query} onChange={(e) => setQuery(e.target.value)}/>
            {
                usersData.map(user => {
                    return (
                        <div key={user.id}>  
                            {
                                handleFilter(user) ? (
                                    <div className={styles.user} key={user.id}>
                                        <div className={styles.leftPart}>
                                            <img src={user.photo} alt="" className={styles.userPhoto}/>
                                            <p>{user.username}</p>
                                        </div>
                                        <button>Follow</button>
                                    </div>
                                ) : null
                            }
                        </div>
                    )
                })
            }
        </div>
    )
};

export default Search;