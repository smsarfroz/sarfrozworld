import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import { useContext, useState } from 'react';
import { SarfrozContext } from '../../sarfrozContext';
import { MdOutlineModeEdit } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { RiGithubLine } from "react-icons/ri";
import { LuBiohazard } from 'react-icons/lu';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Profile = () => {
    const { userData, updateData } = useContext(SarfrozContext);
    console.log('updateData', updateData);
    const { bio, followers, following, github, googleId, id, photo, username, website } = userData;
    console.log("from context",userData[0]);
    const [Bio, setBio] = useState(bio);
    const [Website, setWebsite] = useState(website);
    const [Github, setGithub] = useState(github);
    const [isEditing, setIsEditing] = useState(false);
    console.log('userData ', userData);

    function handleEditClick() {
        setIsEditing(!isEditing);
    }
    function handleSaveClick() {
        setIsEditing(!isEditing);
        updateData({
            followers: followers,
            following: following,
            bio: Bio,
            website: Website,
            github: Github
        });
        // setUserData({
        //     ...userData,
        //     followers: followers,
        //     following: following,
        //     bio: Bio,
        //     website: Website,
        //     github: Github
        // });
    }
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
                    <p>{following == null ? 0 : followers}</p>
                    <p>Posts</p>
                </div>
            </div>
            
            { isEditing ? 
                <div className={styles.inputContainers}>
                    <input type="text" name='Bio' placeholder='edit bio...' value={Bio} onChange={(e) => setBio(e.target.value)}/>
                    <input type="text" name='Website' placeholder='edit website...' value={Website} onChange={(e) => setWebsite(e.target.value)}/>
                    <input type="text" name='Github' placeholder='edit Github username or URL...' value={Github} onChange={(e) => setGithub(e.target.value)}/>
                </div>
                :
                <div className={styles.details}>
                    {Bio != "" ? 
                        <p className={styles.infoLine}>{Bio}</p> 
                        :
                        null
                    }
                    {Bio != "" ? 
                        <p className={styles.infoLine}><CiGlobe />{Website}</p> 
                        :
                        null
                    }
                    {Bio != "" ? 
                        <p className={styles.infoLine}><RiGithubLine />{Github}</p> 
                        :
                        null
                    }
                </div>
            }
            
            { isEditing ? 
                <button onClick={handleSaveClick} className={styles.saveButton}>Save</button>
                :
                <div className={styles.editContainer} onClick={handleEditClick}>
                    <MdOutlineModeEdit fill="blue" size={30}  className={styles.editButton}/> <p className={styles.editText}>Edit</p>
                </div>
            }

            <p className={styles.userPostText}>{username}'s Posts</p>
            <hr />
        </div>
    )
};

export default Profile;