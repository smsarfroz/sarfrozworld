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
import { useNavigate } from 'react-router-dom';
import getErrorMessage from '../../utils/getErrorMessage.js';
import toast from 'react-hot-toast';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const api1 = `${VITE_BASE_URL}/home`;

const Home = () => {
    const navigate = useNavigate();
    const [currentCat, setCurrentCat] = useState(0);
    const { deleted, setDeleted, usersData, userObj } = useContext(SarfrozContext);
    const [id1, setId1] = useState(null);
    const [id2, setId2] = useState(null);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);

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
                    toast.error(getErrorMessage(response.status));
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const jsonData = await response.json();
                return jsonData;
                
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error("There was a problem with fetch operation");
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
                        userId: userObj.userId
                    })
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
                toast.error(getErrorMessage('There was a problem with fetch operation'));
                throw error;
            }
        },
        refetchOnWindowFocus: true, 
        refetchOnMount: true, 
        refetchOnReconnect: true,
        enabled: !!userObj?.userId
    })

    useEffect(() => {
        
        refetch();
        setDeleted(false);

    }, [ refetch, data, deleted, setDeleted ]);

    const catStyle = {
        color: 'rgb(103, 103, 237)',
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
            userRefetch();
            setLoading1(false);
            return data1;
            
        } catch (error) {
            setLoading1(false);
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error(`There was a problem with the fetch operation`);
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
            userRefetch();
            setLoading2(false);
            return data1;
            
        } catch (error) {
            setLoading2(false);
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error(`There was a problem with the fetch operation`);
            throw error;
        }
    } 

    if (isPending || isUserLoding) {
        return <p className={styles.loading}>Loading...</p>;
    }  
    if (error || userError) { 
        return "An error has occured: " + error.message;
    }

    const lastFiveReversed = usersData?.slice(-6).reverse();
    let length = 0;

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
        <div className={styles.homeContainer}>

            {
                (Array.isArray(data) && data.length > 0) ? 
                (
                    <div className={styles.homePage}>

                        <div className={styles.categories}>
                            <div className={styles.textItem}>
                                <p style={currentCat == 0 ? catStyle : null} onClick={() => clickHandler(0)} className={currentCat === 0 ? styles.active : styles.inactive}>Recent</p>
                            </div>
                            <div className={styles.textItem}>
                                <p style={currentCat == 1 ? catStyle : null} onClick={() => clickHandler(1)} className={currentCat === 1 ? styles.active : styles.inactive}>Most Liked</p>
                            </div>
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
                ) :
                (
                    <p className={styles.noposts}>No posts available.</p>
                )
            }
            

            <div className={styles.latestUsers} key={location.pathname}>

                <p className={styles.latestUser}>Latest Users</p>
                {
                    lastFiveReversed.map((user) => {
                        if (user.id !== userObj.userId) length++;
                        return (
                            (user.id === userObj.userId || length > 5) ? null :

                            <div className={styles.user} key={user.id}>
                                <div className={styles.leftPart}>
                                    <img src={user.photo} alt="" className={styles.userPhoto}/>
                                    <span onClick={(e) => handleUserClick(e, user.id)} className={styles.username}>{user.username}</span>
                                </div>

                                {User.following.includes(user.id) ? 
                                    <button style={loading1 && id1 == user.id ? loadingStyle1 : null} onClick={() => handleUnFollow(userObj.userId, user.id)} className={styles.followingButton}>Following</button> :
                                    <button style={loading2 && id2 == user.id ? loadingStyle2 : null} onClick={() => handleFollow(userObj.userId, user.id)} className={styles.followButton}>Follow</button> 
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



