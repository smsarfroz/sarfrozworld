import { Link, NavLink } from 'react-router-dom';
import styles from './Profile.module.css';
import { useContext, useEffect, useState } from 'react';
import { SarfrozContext } from '../../sarfrozContext';
import { MdOutlineModeEdit } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { RiGithubLine } from "react-icons/ri";
import { LuBiohazard } from 'react-icons/lu';
import PostCardPreview from '../PostCardPreview/PostCardPreview.jsx';
import { useQuery } from '@tanstack/react-query';

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
                throw new Error(`HTTP error! Status: ${Response.status}`);
            }

            const data1 = await res1.json();
            setUserData(data1);
            return data1;
            
        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            throw error;
        }
    };

    return { userData, updateUser };
};

const Profile = () => {
    const { userId } = useContext(SarfrozContext);
    let dataToSend = {};
    dataToSend['userId'] = userId;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ["userData"],
        staleTime: 1000 * 60 * 30,
        // queryFn: () => fetch(`${VITE_BASE_URL}/users/profile`).then(res => res.json())

        queryFn: async () => {
            try {
                // console.log('Sending request with:', dataToSend);
                
                const response = await fetch(`${VITE_BASE_URL}/users/profile`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend)
                });
                
                // console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const jsonData = await response.json();
                // console.log('Response data:', jsonData);
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

    // console.log('data from react query', data);
    const { userData: initialUser, updateUser } = useUser();
    // console.log('initialUser', initialUser);
    const [user, setUserData] = useState(initialUser);
    const [editValue, setEditValue] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    // const postsUnsorted = initialUser['posts'];

    useEffect(() => {
        refetch();
        if (data) {
            // console.log('data', data);
            setEditValue(data[0]);
        }
    
    }, [data, editValue, refetch]);

    if (isPending) return "Loading..."

    if (error) return "An error has occurred: " + error.message

    console.log('bool', !editValue , (data.length !== 0), data.length );

    // if (!editValue) {
    //     return <div>Loading user data...</div>;
    // }
    // setEditValue(data[0]);
    let bio = null, followers = null, following = null, github = null, 
    id = null, photo = null, username = null, website = null;
    let postsUnsorted = [];

    console.log('editValue', editValue, editValue?.length);

    // if (editValue?.length !== undefined) {
    //     ({ bio, followers, following, github, id, photo, username, website } = editValue);
    //     postsUnsorted = editValue['posts'] || [];
    // }

    // const posts = [...postsUnsorted].sort((a, b) => {
    //     return new Date(b.createdAt) - new Date(a.createdAt);
    // });

    if (editValue && typeof editValue === 'object') {
        ({ bio, followers, following, github, id, photo, username, website } = editValue);
        
        postsUnsorted = editValue.posts || [];
    }

    const posts = [...postsUnsorted].sort((a, b) => {
        const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
    });

    function handleEditClick() {
        setIsEditing(true);
        setEditValue(user);
    }
    const handleSaveClick = async (data) => {
        setIsEditing(false);
        const updatedData = await updateUser(data);
        setUserData(updatedData);
    };

    return (
        <div className={styles.profilePage}>

            <div className={styles.user}>
                <img src={photo} alt="" className={styles.profilePhoto}/>
                <p>{username}</p>
            </div>
            <div className={styles.counters}>
                <div className={styles.counterContainer}>
                    <p>{followers == null ? 0 : followers}</p>
                    <p>Followers</p>
                </div>
                <div className={styles.counterContainer}>
                    <p>{following == null ? 0 : following}</p>
                    <p>Following</p>
                </div>
                <div className={styles.counterContainer}>
                    <p>{followers == null ? 0 : followers}</p>
                    <p>Posts</p>
                </div>
            </div>
            
            { isEditing ? 
                <div className={styles.inputContainers}>
                    <input type="text" name='Bio' placeholder='edit bio...' value={bio ? bio : ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, bio: e.target.value}))}/>
                    <input type="text" name='Website' placeholder='edit website...' value={website ? website: ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, website: e.target.value}))}/>
                    <input type="text" name='Github' placeholder='edit Github username or URL...' value={github ? github : ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, github: e.target.value}))}/>
                </div>
                :
                <div className={styles.details}>
                    { bio && <p className={styles.infoLine}>{bio}</p> }
                    { website && <p className={styles.infoLine}><CiGlobe />{website}</p> }
                    { github && <p className={styles.infoLine}><RiGithubLine />{github}</p> }
                </div>
            }
            
            { isEditing ? 
                <button onClick={() => handleSaveClick({ userId, bio, github, website })} className={styles.saveButton}>Save</button>
                :
                <div className={styles.editContainer} onClick={handleEditClick}>
                    <MdOutlineModeEdit fill="blue" size={30}  className={styles.editButton}/> <p className={styles.editText}>Edit</p>
                </div>
            }

            <p className={styles.userPostText}>{username}'s Posts</p>
            <hr />

            <div className={styles.posts}>
                {
                    posts.map((post) => {
                        return (
                            <PostCardPreview 
                                key={post.id}
                                post={post}
                                user={editValue}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Profile;