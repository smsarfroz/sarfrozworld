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
import handleFollow from '../../utils/handleFollow.js';
import handleUnFollow from '../../utils/handleUnFollow.js';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const api1 = `${VITE_BASE_URL}/home`;

const Home = () => {
    const [currentCat, setCurrentCat] = useState(0);
    const [User, setUser] = useState(null);
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

    useEffect(() => {
        
        refetch();
        setDeleted(false);
        usersData.map(user => {
            if (user.id === userId) {
                setUser(user);
            }
        })

    }, [ refetch, data, deleted, setDeleted, userId, usersData ]);

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

    if (isPending) {
        // return <Loading />;
        return "Loading...";
    }  
    if (error) { 
        return "An error has occured: " + error.message;
    }

    if (!(Array.isArray(data) && data.length > 0)) {
        return "No posts available";
    }

    const lastFiveReversed = usersData.slice(-5).reverse();
    
    return (
        <>
            <div className={styles.latestUsers}>
                {
                    lastFiveReversed.map((user) => {
                        return (
                            <div className={styles.user} key={user.id}>
                                <div className={styles.leftPart}>
                                    <img src={user.photo} alt="" className={styles.userPhoto}/>
                                    <p className={styles.username}>{user.username}</p>
                                </div>

                                {User.following.includes(user.id) ? 
                                    <button onClick={() => handleUnFollow(userId, user.id, refetch, VITE_BASE_URL)} className={styles.followingButton}>Following</button> :
                                    <button onClick={() => handleFollow(userId, user.id, refetch, VITE_BASE_URL)} className={styles.followButton}>Follow</button> 
                                }
                            </div>    
                        )
                    })
                }
            </div>

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
        </>
    )
};

export default Home;



