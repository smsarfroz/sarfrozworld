import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import { useContext, useState } from 'react';
import { sarfrozContext } from '../../sarfrozContext';
import { MdOutlineModeEdit } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { RiGithubLine } from "react-icons/ri";
import { LuBiohazard } from 'react-icons/lu';


const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';


const Profile = () => {
    const { userData } = useContext(sarfrozContext);
    const { bio, followers, following, github, googleId, id, photo, username, website} = userData[0];
    const [Bio, setBio] = useState("e");
    const [Website, setWebsite] = useState("e");
    const [Github, setGithub] = useState("e");
    const [isEditing, setIsEditing] = useState(false);
    // console.log('userData ', userData);

    function handleEditClick() {
        console.log('edit button clicked', isEditing);
        setIsEditing(!isEditing);
    }
    return (
        <div className={styles.profilePage}>

            <img src={photo} alt="" className={styles.profilePhoto}/>
            <p>{username}</p>
            <div className="counterContainer">
                <p>{followers == null ? 0 : followers}</p>
                <p>Followers</p>
            </div>
            <div className="counterContainer">
                <p>{following == null ? 0 : following}</p>
                <p>Following</p>
            </div>
            <div className="counterContainer">
                <p>{following == null ? 0 : followers}</p>
                <p>Posts</p>
            </div>

            <p>{username}'s Posts</p>
            
            { isEditing ? 
                <>
                    <form action="">{Bio}</form>
                    <form action="">{website}</form>
                    <form action="">{github}</form>
                </>
                :
                <>
                    {Bio != "" ? 
                        <p>{Bio}</p> 
                        :
                        null
                    }
                    {Bio != "" ? 
                        <p><CiGlobe />{Website}</p> 
                        :
                        null
                    }
                    {Bio != "" ? 
                        <p><RiGithubLine />{Github}</p> 
                        :
                        null
                    }
                </>
            }
            
            { isEditing ? 
                <button onClick={handleEditClick} className={styles.saveButton}>Save</button>
                :
                <div className={styles.editContainer}>
                    <MdOutlineModeEdit fill="blue" size={30} onClick={handleEditClick} className={styles.editButton}/> <p>Edit</p>
                </div>
            }
        </div>
    )
};

export default Profile;