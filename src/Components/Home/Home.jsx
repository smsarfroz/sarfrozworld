import { useContext } from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import { SarfrozContext } from '../../sarfrozContext.js';
import Loading from '../Loading/Loading.jsx';
import ErrorPage from '../../../ErrorPage.jsx';
import { useEffect } from 'react';
import { useState } from 'react';
import PostCardPreview from '../PostCardPreview/PostCardPreview.jsx';
import { useQuery } from '@tanstack/react-query';
// import handleFollow from '../../utils/handleFollow.js';
// import handleUnFollow from '../../utils/handleUnFollow.js';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const api1 = `${VITE_BASE_URL}/home`;

const Home = () => {
    const [currentCat, setCurrentCat] = useState(0);
    // const [User, setUser] = useState(null);
    const { deleted, setDeleted, usersData, userId } = useContext(SarfrozContext);
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ["postData", currentCat],
        staleTime: 0,   
        queryFn: async () => {
            try {
                let dataToSend = {};
                dataToSend['currentCat'] = currentCat;
                
                const response = await fetch(api1, {
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
    })

    const { isLoading: isUserLoding, error: userError, data: User, refetch: userRefetch } = useQuery({
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
                    body: JSON.stringify({
                        userId
                    })
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

    /* useEffect(() => {
        if (usersData && usersData.length > 0) {
            usersData.map(user => {
                if (user.id === userId) {
                    setUser(user);
                }
            })
        }
    }, [userId, usersData]); */

    useEffect(() => {
        
        refetch();
        setDeleted(false);

    }, [ refetch, data, deleted, setDeleted ]);

    const catStyle = {
        color: 'rgb(103, 103, 237)'
    }
    const clickHandler = (cur) => {
        if (cur == 0) {
            setCurrentCat(0);
        } else {
            setCurrentCat(1);
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
            userRefetch();
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
            userRefetch();
            return data1;
            
        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            throw error;
        }
    } 

    if (isPending || isUserLoding) {
        // return <Loading />;
        return "Loading...";
    }  
    if (error || userError) { 
        return "An error has occured: " + error.message;
    }

    if (!(Array.isArray(data) && data.length > 0)) {
        return "No posts available";
    }

    const lastFiveReversed = usersData.slice(-6).reverse();
    let length = 0;

    return (
        <div className={styles.homeContainer}>

            <div className={styles.homePage}>

                <div className={styles.categories}>
                    <p style={currentCat == 0 ? catStyle : null} onClick={() => clickHandler(0)} className={styles.cat}>Recent</p>
                    <p style={currentCat == 1 ? catStyle : null} onClick={() => clickHandler(1)} className={styles.cat}>Most Liked</p>
                </div>
                <div className={styles.posts}>
                    {
                        data.map((post) => {
                            return (
                                <PostCardPreview 
                                    key={post.id}
                                    post={post}
                                    user={post.user}
                                    setDeleted={setDeleted}
                                    commentsCount={post.comments.length}
                                />
                            )
                        })
                    }
                </div>

            </div>

            <div className={styles.latestUsers} key={location.pathname}>

                <h3 className={styles.latestUser}>Latest Users</h3>
                {
                    lastFiveReversed.map((user) => {
                        if (user.id !== userId) length++;
                        return (
                            (user.id === userId || length > 5) ? null :

                            <div className={styles.user} key={user.id}>
                                <div className={styles.leftPart}>
                                    <img src={user.photo} alt="" className={styles.userPhoto}/>
                                    <p className={styles.username}>{user.username}</p>
                                </div>

                                {User.following.includes(user.id) ? 
                                    <button onClick={() => handleUnFollow(userId, user.id)} className={styles.followingButton}>Following</button> :
                                    <button onClick={() => handleFollow(userId, user.id)} className={styles.followButton}>Follow</button> 
                                }
                            </div>    
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Home;



