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

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const api1 = `${VITE_BASE_URL}/home`;

const Home = () => {
    const [currentCat, setCurrentCat] = useState(0);
    const { deleted, setDeleted } = useContext(SarfrozContext);
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const jsonData = await response.json();
                return jsonData;
                
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        },
        refetchOnWindowFocus: true, 
        refetchOnMount: true, 
        refetchOnReconnect: true,
    })

    useEffect(() => {
        
        refetch();
        setDeleted(false);

    }, [ refetch, data, deleted, setDeleted ]);

    const catStyle = {
        color: 'blue'
    }
    const clickHandler = (cur) => {
        if (cur == 0) {
            setCurrentCat(0);
        } else {
            setCurrentCat(1);
        }
    }

    if (isPending) {
        // return <Loading />;
        return "Loading...";
    }  
    if (error) { 
        return "An error has occured: " + error.message;
    }

    if (!(Array.isArray(data) && data.length > 0)) {
        return "No posts available";
    }
 
    return (
        <div className={styles.homePage}>
            
            <div className={styles.categories}>
                <p style={currentCat == 0 ? catStyle : null} onClick={() => clickHandler(0)} className={styles.cat}>Recent</p>
                <p style={currentCat == 1 ? catStyle : null} onClick={() => clickHandler(1)} className={styles.cat}>Most Liked</p>
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
                            />
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Home;



