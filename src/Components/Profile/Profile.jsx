import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import { useContext, useState } from 'react';
import { SarfrozContext } from '../../sarfrozContext';
import { MdOutlineModeEdit } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { RiGithubLine } from "react-icons/ri";
import { LuBiohazard } from 'react-icons/lu';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const useUser = () => {
  const api1 = `${VITE_BASE_URL}/users/profile`;
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
    const { userData: initialUser, updateUser } = useUser();
    const [user, setUserData] = useState(initialUser);
    const { bio, followers, following, github, googleId, id, photo, username, website } = user;
    const [Bio, setBio] = useState(bio);
    const [Website, setWebsite] = useState(website);
    const [Github, setGithub] = useState(github);
    const [isEditing, setIsEditing] = useState(false);

    console.log('isEditing, user', isEditing, user, Bio, initialUser);

    function handleEditClick() {
        setIsEditing(true);
        // console.log('inside edit click fn', isEditing);
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
                    <p>{following == null ? 0 : followers}</p>
                    <p>Posts</p>
                </div>
            </div>
            
            { isEditing ? 
                <div className={styles.inputContainers}>
                    <input type="text" name='Bio' placeholder='edit bio...' value={Bio ? Bio : ""} onChange={(e) => setBio(e.target.value)}/>
                    <input type="text" name='Website' placeholder='edit website...' value={Website ? Website: ""} onChange={(e) => setWebsite(e.target.value)}/>
                    <input type="text" name='Github' placeholder='edit Github username or URL...' value={Github ? Github : ""} onChange={(e) => setGithub(e.target.value)}/>
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
                <button onClick={handleSaveClick({ bio, followers, following, github, googleId, id, photo, username, website })} className={styles.saveButton}>Save</button>
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