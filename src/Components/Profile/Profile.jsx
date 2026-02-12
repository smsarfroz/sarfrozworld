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
  const api1 = `${VITE_BASE_URL}/users/profile/update`;
  const { userData, setUserData } = useContext(SarfrozContext);

  const updateUser = async (data) => {
      console.log('data in updateUser', data);
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
        console.log('res1', res1);
        if (!res1.ok) {
          throw new Error(`HTTP error! Status: ${Response.status}`);
        }

        const data1 = await res1.json();
        console.log('data1', data1);
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
    const [editValue, setEditValue] = useState(user);
    const { bio, followers, following, github, id, photo, username, website } = editValue;
    const [isEditing, setIsEditing] = useState(false);
    const { userId, setUserId } = useContext(SarfrozContext);

    // console.log('isEditing, user', isEditing, editValue);

    function handleEditClick() {
        setIsEditing(true);
        setEditValue(user);
    }
    const handleSaveClick = async (data) => {
        setIsEditing(false);
        console.log('data in save fn', data);
        const updatedData = await updateUser(data);
        console.log('updatedData', updatedData);
        setUserData(updatedData);
    };
    return (
        <div className={styles.profilePage}>

            <div className={styles.user}>
                <img src={editValue['photo']} alt="" className={styles.profilePhoto}/>
                <p>{editValue['username']}</p>
            </div>
            <div className={styles.counters}>
                <div className={styles.counterContainer}>
                    <p>{editValue['followers'] == null ? 0 : editValue['followers']}</p>
                    <p>Followers</p>
                </div>
                <div className={styles.counterContainer}>
                    <p>{editValue['following'] == null ? 0 : editValue['following']}</p>
                    <p>Following</p>
                </div>
                <div className={styles.counterContainer}>
                    <p>{editValue['followers'] == null ? 0 : editValue['followers']}</p>
                    <p>Posts</p>
                </div>
            </div>
            
            { isEditing ? 
                <div className={styles.inputContainers}>
                    <input type="text" name='Bio' placeholder='edit bio...' value={editValue['bio'] ? editValue['bio'] : ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, bio: e.target.value}))}/>
                    <input type="text" name='Website' placeholder='edit website...' value={editValue['website'] ? editValue['website']: ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, website: e.target.value}))}/>
                    <input type="text" name='Github' placeholder='edit Github username or URL...' value={editValue['github'] ? editValue['github'] : ""} onChange={(e) => setEditValue((prevVal) => ({...prevVal, github: e.target.value}))}/>
                </div>
                :
                <div className={styles.details}>
                    {editValue['bio'] != "" ? 
                        <p className={styles.infoLine}>{editValue['bio']}</p> 
                        :
                        null
                    }
                    {editValue['website'] != "" ? 
                        <p className={styles.infoLine}><CiGlobe />{editValue['website']}</p> 
                        :
                        null
                    }
                    {editValue['github'] != "" ? 
                        <p className={styles.infoLine}><RiGithubLine />{editValue['github']}</p> 
                        :
                        null
                    }
                </div>
            }
            
            { isEditing ? 
                <button onClick={() => handleSaveClick({ userId, bio, github, website })} className={styles.saveButton}>Save</button>
                :
                <div className={styles.editContainer} onClick={handleEditClick}>
                    <MdOutlineModeEdit fill="blue" size={30}  className={styles.editButton}/> <p className={styles.editText}>Edit</p>
                </div>
            }

            <p className={styles.userPostText}>{editValue['username']}'s Posts</p>
            <hr />
        </div>
    )
};

export default Profile;