import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import { useContext } from 'react';
import { sarfrozContext } from '../../sarfrozContext';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';


const Profile = () => {
    const { userData } = useContext(sarfrozContext);

    console.log('userData ', userData);
    return (
        <div className={styles.profilePage}>
            <h1>profile page</h1>
        </div>
    )
};

export default Profile;