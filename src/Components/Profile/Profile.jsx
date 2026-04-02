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
    const [loading, setLoading] = useState(false);

    const updateUser = async (data) => {
        console.log('data in updateUser', data);
        try {
            setLoading(true);
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
                setLoading(false);
                throw new Error(`HTTP error! Status: ${Response.status}`);
            }

            const data1 = await res1.json();
            setUserData(data1);
            setLoading(false);
            return data1;
            
        } catch (error) {
            setLoading(false);
            console.error(`There was a problem with the fetch operation:`, error);
            throw error; 
        }
    };
    console.log('userData in updateUser', userData);

    return { userData, updateUser, loading };
};

const Profile = () => {
    const { userId } = useContext(SarfrozContext);
    const [updateLoading, setUpdateLoading] = useState(false);
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
    const { userData: initialUser, updateUser, loading } = useUser();
    // console.log('initialUser', initialUser);
    const [user, setUserData] = useState(initialUser);
    const [editValue, setEditValue] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    // const postsUnsorted = initialUser['posts'];

    useEffect(() => {
        refetch();
        if (data) {
            setEditValue(data);
        }
        
    }, [data, refetch]);

    if (isPending || !data) return "Loading..."

    if (error) return "An error has occurred: " + error.message

    let bio = null, followers = null, following = null, github = null, 
    id = null, photo = null, username = null, website = null;
    let postsUnsorted = [];

    if (editValue && typeof editValue === 'object') {
        console.log('editValue in block', editValue);
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
        setUpdateLoading(false);
        // setEditValue(user);
    }

    const handleSaveClick = async ({ userId, bio, github, website }) => {
        setIsEditing(false);
        setUpdateLoading(true);
        if (!URL.canParse(github)) {
            github = "https://github.com/" + github;
            console.log('github', github);
        }
        if (!URL.canParse(website)) {
            website = "https://" + website;
        }
        const urlGithub = new URL(github);
        const path1 = urlGithub.pathname.substring(1);
        const urlWebsite = new URL(website);
        const contentAfterProtocol = urlWebsite.host + urlWebsite.pathname;
        console.log(path1, contentAfterProtocol);
        const updatedData = await updateUser({ userId, bio, github: path1, website: contentAfterProtocol});
        setUserData(updatedData);
        setEditValue(updatedData);
        setUpdateLoading(false);
        refetch();
    };

    const blurredButton = {
        backgroundColor: "rgb(118, 118, 241)"
    };

    return (
        <div className={styles.profilePage}>

            <div className={styles.user}>
                <img src={data.photo} alt="" className={styles.profilePhoto}/>
                <p className={styles.username}>{data.username}</p>
            </div>
            <div className={styles.counters}>
                <div className={styles.counterContainer}>
                    <p className={styles.num}>{data.followers == [] ? 0 : data.followers.length}</p>
                    <p>Followers</p>
                </div>
                <div className={styles.counterContainer}>
                    <p className={styles.num}>{data.following == [] ? 0 : data.following.length}</p>
                    <p>Following</p>
                </div>
                <div className={styles.counterContainer}>
                    <p className={styles.num}>{data.posts.length}</p>
                    <p>Posts</p>
                </div>
            </div>
            
            { isEditing ? 
                <div className={styles.inputContainers}>
                    {/* <input className={styles.bioInput} maxLength={200} height={20} size={20} type="text" name='Bio' placeholder='edit bio...' value={bio ? bio : ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, bio: e.target.value}))}/> */}
                    <textarea className={styles.bioInput} maxLength={200} rows={3} type="text" name='Bio' placeholder='edit bio...' value={bio ? bio : ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, bio: e.target.value}))}/>
                    <input type="text" name='Website' placeholder='edit website...' value={website ? website : ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, website: e.target.value}))}/>
                    <input type="text" name='Github' placeholder='edit Github username or URL...' value={github ? github : ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, github: e.target.value}))}/>
                </div>
                :
                <div className={styles.details}>
                    { data.bio && <p className={styles.infoLine}>{data.bio}</p> }
                    { data.website && <p className={styles.infoLine}><CiGlobe /><a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer">{data.website}</a></p> }
                    { data.github && <p className={styles.infoLine}><RiGithubLine /><a href={`https://github.com/${data.github}`} target="_blank" rel="noopener noreferrer">{data.github}</a></p> }
                </div>
            }
            
            { isEditing ? 
                
                    updateLoading ? 
                    <button className={styles.savingButton} style={ updateLoading ? blurredButton : null }>Saving...</button>:
                    <button onClick={() => handleSaveClick({ userId, bio, github, website })} className={styles.saveButton} >Save</button>
                
                :
                <span className={styles.editContainer} >
                    <MdOutlineModeEdit fill="blue" size={23} onClick={() => handleEditClick()} className={styles.editButton}/> <p onClick={() => handleEditClick()} className={styles.editText}>Edit</p>
                </span>
            }

            <p className={styles.userPostText}>{data.username}'s Posts</p>
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

export default Profile;