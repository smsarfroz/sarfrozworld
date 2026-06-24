import { Link, NavLink, useParams } from 'react-router-dom';
import styles from './UserProfile.module.css';
import { useContext, useEffect, useState } from 'react';
import { SarfrozContext } from '../../sarfrozContext.js';
import { MdOutlineModeEdit } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { RiGithubLine } from "react-icons/ri";
import { LuBiohazard } from 'react-icons/lu';
import PostCardPreview from '../PostCardPreview/PostCardPreview.jsx';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import getErrorMessage from '../../utils/getErrorMessage.js';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const useUser = () => {
    const api1 = `${VITE_BASE_URL}/users/profile/update`;
    const { userData, setUserData } = useContext(SarfrozContext);

    const updateUser = async (data) => {
        try {
            const [res1] = await Promise.all([
            fetch(api1, {
                mode: 'cors',
                credentials: 'include',
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            ]);
            if (!res1.ok) {
                toast.error(getErrorMessage(res1.status));
                throw new Error(`HTTP error! Status: ${res1.status}`);
            }

            const data1 = await res1.json();
            setUserData(data1);
            return data1;
            
        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error('There was a problem with fetch operation');
            throw error;
        }
    };

    return { userData, updateUser };
};

const UserProfile = () => {
    const { uid } = useParams();
    const userIdP = parseInt(uid);
    const { userObj } = useContext(SarfrozContext);
    const [id1, setId1] = useState(null);
    const [id2, setId2] = useState(null);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);

    let dataToSend = {};
    dataToSend['userId'] = userIdP;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ["userData"],
        staleTime: 1000 * 60 * 30,
        // queryFn: () => fetch(`${VITE_BASE_URL}/users/profile`).then(res => res.json())

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
        enabled: !!userIdP
    })

    const { userData: initialUser, updateUser } = useUser();
    const [user, setUserData] = useState(initialUser);
    const [editValue, setEditValue] = useState(null);

    useEffect(() => {
        refetch();
        if (data) {
            setEditValue(data);
        }
        
    }, [data, refetch]);

    if (isPending) return <p className={styles.loading}>Loading...</p>

    if (error) return "An error has occurred: " + error.message

    let bio = null, followers = null, following = null, github = null, 
    id = null, photo = null, username = null, website = null;
    let postsUnsorted = [];

    if (editValue && typeof editValue === 'object') {
        ({ bio, followers, following, github, id, photo, username, website } = editValue);
        postsUnsorted = editValue.posts || [];
    }

    const posts = [...postsUnsorted].sort((a, b) => {
        const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
    });

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
            if (refetch !== undefined) {
                refetch();
            }
            setLoading1(false);
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
            if (refetch !== undefined) {
                refetch();
            }
            setLoading2(false);
            return data1;
            
        } catch (error) {
            setLoading2(false);
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error('There was a problem with fetch operation');
            throw error;
        }
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
        <div className={styles.profilePage}>

            <div className={styles.user}>
                <img src={photo} alt="" className={styles.profilePhoto}/>
                <div className={styles.rightPart}>
                    <p className={styles.username}>{username}</p>
                    {data.id !== userObj.userId ?  
                        data.followers.includes(userObj.userId) ?
                            <button style={loading1 && id1 == user.id ? loadingStyle1 : null} onClick={() => handleUnFollow(userObj.userId, data.id)} className={styles.followingButton}>Following</button> :
                            <button style={loading2 && id2 == user.id ? loadingStyle2 : null} onClick={() => handleFollow(userObj.userId, data.id)} className={styles.followButton}>Follow</button>
                        :
                        null
                    }
                </div>
            </div>
            <div className={styles.counters}>
                <div className={styles.counterContainer}>
                    <p className={styles.num}>{followers == null ? 0 : followers.length}</p>
                    <p>Followers</p>
                </div>
                <div className={styles.counterContainer}>
                    <p className={styles.num}>{following == null ? 0 : following.length}</p>
                    <p>Following</p>
                </div>
                <div className={styles.counterContainer}>
                    <p className={styles.num}>{posts.length}</p>
                    <p>Posts</p>
                </div>   
            </div>
            

            <div className={styles.details}>
                { bio && <p className={styles.infoLine}>{bio}</p> }
                { website && <p className={styles.infoLine}><CiGlobe /><a href={website} target="_blank" rel="noopener noreferrer">{website}</a></p> }
                { github && <p className={styles.infoLine}><RiGithubLine /><a href={github} target="_blank" rel="noopener noreferrer">{github}</a></p> }
            </div>
        

            <p className={styles.userPostText}>{username}'s Posts</p>
            <hr className={styles.horizontalLine}/>

            <div className={styles.posts}>
                {
                    posts.map((post) => {
                        return (
                            <PostCardPreview 
                                key={post.id}
                                post={post}
                                user={editValue}
                                commentsCount={post.comments.length}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
};

export default UserProfile;