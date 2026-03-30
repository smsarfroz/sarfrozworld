import { Link } from 'react-router-dom';
import styles from './Search.module.css';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { SarfrozContext } from '../../sarfrozContext.js';
import { useQuery } from '@tanstack/react-query';   
import { useNavigate } from 'react-router-dom';
// import handleFollow from '../../utils/handleFollow.js';
// import handleUnFollow from '../../utils/handleUnFollow.js';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Search = () => {
    const { usersData, userId } = useContext(SarfrozContext);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    // const [user, setUser] = useState(null);
    let dataToSend = {};
    dataToSend['userId'] = userId;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ["userData"],
        staleTime: 0,

        queryFn: async () => {
            try {

                const response = await fetch(`${VITE_BASE_URL}/users/profile`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const jsonData = await response.json();
                return jsonData;
                
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        },
        refetchOnWindowFocus: true, 
        refetchOnMount: true, 
        refetchOnReconnect: true,
        enabled: !!userId
    })

    // useEffect(() => {
    //     refetch();
    //     if (data) {
    //         setUser(data[0]);
    //         console.log('data', data[0]);
    //     }
    
    // }, [data, refetch]);

    if (isPending) return "Loading..."

    if (error) return "An error has occurred: " + error.message

    const User = data;

    const handleFilter = (user) => {
        let myQuery = query.toLowerCase();
        if (myQuery === '' || user.username.toLowerCase().includes(query)) {
            return true;
        } else {
            return false;
        }
    }

    const handleFollow = async (id1, id2) => {
        const api1 = `${VITE_BASE_URL}/users/follow`;
        try {
            const res1 = await (
            fetch(api1, {
                mode: 'cors',
                credentials: 'include',
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id1: id1,
                    id2: id2
                })
            }));
            if (!res1.ok) {
                throw new Error(`HTTP error! Status: ${Response.status}`);
            }

            const data1 = await res1.json();
            if (refetch !== undefined) {
                refetch();
            }
            return data1;
            
        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            throw error;
        }
    } 

    const handleUnFollow = async (id1, id2) => {
        const api1 = `${VITE_BASE_URL}/users/unfollow`;
        try {
            const res1 = await (
            fetch(api1, {
                mode: 'cors',
                credentials: 'include',
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id1: id1,
                    id2: id2
                })
            }));
            if (!res1.ok) {
                throw new Error(`HTTP error! Status: ${Response.status}`);
            }

            const data1 = await res1.json();
            if (refetch !== undefined) {
                refetch();
            }
            return data1;
            
        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            throw error;
        }
    } 

    function handleUserClick(e, uid) {
        e.stopPropagation();
        navigate(`/u/${uid}`);
    }

    return (
        <div className={styles.searchPage}>
            <input type="text" placeholder='Search users...' value={query} onChange={(e) => setQuery(e.target.value)}/>
            {
                usersData.map(user => {
                    return (
                        <div key={user.id}>  
                            {
                                handleFilter(user) && user.id != userId ? (
                                    <div className={styles.user} key={user.id}>
                                        <div className={styles.leftPart}>
                                            <img src={user.photo} alt="" className={styles.userPhoto}/>
                                            <p className={styles.username} onClick={(e) => handleUserClick(e, user.id)}>{user.username}</p>
                                        </div>

                                        {User.following.includes(user.id) ? 
                                            <button onClick={() => handleUnFollow(userId, user.id)} className={styles.followingButton}>Following</button> :
                                            <button onClick={() => handleFollow(userId, user.id)} className={styles.followButton}>Follow</button> 
                                        }
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