import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import { useContext, useEffect } from 'react';
import { sarfrozContext } from '../../sarfrozContext';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

// const useUserDetails = () => {
//     const [user, setUser] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const userResponse = await Promise.all(
//                     fetch(`${VITE_BASE_URL}/users/sarfroz`, { mode: "cors" })
//                 )

//                 if (!userResponse.ok) {
//                     throw new Error("Failed to fetch user");
                    
//                 }

//                 const userData = await userResponse.json();

//                 setUser(userData);

//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);
// }

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