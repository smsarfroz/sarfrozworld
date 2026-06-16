import { Link } from 'react-router-dom';
import styles from './Search.module.css';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { SarfrozContext } from '../../sarfrozContext.js';
import { useQuery } from '@tanstack/react-query';   
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getErrorMessage from '../../utils/getErrorMessage.js';
// import handleFollow from '../../utils/handleFollow.js';
// import handleUnFollow from '../../utils/handleUnFollow.js';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Search = () => {
    const { usersData, userObj } = useContext(SarfrozContext);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [id1, setId1] = useState(null);
    const [id2, setId2] = useState(null);
    // const [user, setUser] = useState(null);
    let dataToSend = {};
    dataToSend['userId'] = userObj.userId;
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
                    toast.error(getErrorMessage(response.status));
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const jsonData = await response.json();
                return jsonData;
                
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('There was a problem with fetch operation');
                throw error;
            }
        },
        refetchOnWindowFocus: true, 
        refetchOnMount: true, 
        refetchOnReconnect: true,
        enabled: !!userObj.userId
    })

    // useEffect(() => {
    //     refetch();
    //     if (data) {
    //         setUser(data[0]);
    //         console.log('data', data[0]);
    //     }
    
    // }, [data, refetch]);

    if (isPending) return <p className={styles.loading}>Loading...</p>

    if (error) return "An error has occurred: " + error.message

    const User = data;

    const handleFilter = (user) => {
        let myQuery = query.toLowerCase();
        if (myQuery === '' || (user.username && user.username.toLowerCase().includes(myQuery))) {
            return true;
        } else {
            return false;
        }
    }

    const handleFollow = async (id1, id2) => {
        const api1 = `${VITE_BASE_URL}/users/follow`;
        setLoading1(true);
        setId1(id2);
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
                setLoading1(false);
                toast.error(getErrorMessage(res1.status));
                throw new Error(`HTTP error! Status: ${res1.status}`);
            }

            const data1 = await res1.json();
            setLoading1(false);
            if (refetch !== undefined) {
                refetch();
            }
            return data1;
            
        } catch (error) {
            setLoading1(false);
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error('There was a problem with fetch operation');
            throw error;
        }
    } 

    const handleUnFollow = async (id1, id2) => {
        const api1 = `${VITE_BASE_URL}/users/unfollow`;
        setLoading2(true);
        setId2(id2);
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
                setLoading2(false);
                toast.error(getErrorMessage(res1.status));
                throw new Error(`HTTP error! Status: ${res1.status}`);
            }

            const data1 = await res1.json();
            setLoading2(false);
            if (refetch !== undefined) {
                refetch();
            }
            return data1;
            
        } catch (error) {
            setLoading2(false);
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error('There was a problem with fetch operation');
            throw error;
        }
    } 

    function handleUserClick(e, uid) {
        e.stopPropagation();
        navigate(`/u/${uid}`);
    }

    const loadingStyle1 = {
        backgroundColor: "#5d6cec",
        disabled: "false"
    }
    const loadingStyle2 = {
        backgroundColor: "rgb(49, 49, 49)",
        disabled: "true"
    }

    return (
        <div className={styles.searchPage}>
            <input type="text" placeholder='Search users...' value={query} onChange={(e) => setQuery(e.target.value)}/>
            {
                usersData.map(user => {
                    return (
                        <div key={user.id} className={styles.users}>  
                            {
                                handleFilter(user) && user.id != userObj.userId ? (
                                    <div className={styles.user} key={user.id}>
                                        <div className={styles.leftPart}>
                                            <img src={user.photo} alt="" className={styles.userPhoto}/>
                                            <p className={styles.username} onClick={(e) => handleUserClick(e, user.id)}>{user.username}</p>
                                        </div>

                                        {User.following.includes(user.id) ? 
                                            <button style={(loading1 && id1 == user.id) ? loadingStyle1 : null} onClick={() => handleUnFollow(userObj.userId, user.id)} className={styles.followingButton}>Following</button> :
                                            <button style={loading2 && id2 == user.id ? loadingStyle2 : null} onClick={() => handleFollow(userObj.userId, user.id)} className={styles.followButton}>Follow</button> 
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