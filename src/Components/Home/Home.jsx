import { useContext } from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import { SarfrozContext } from '../../sarfrozContext.js';
import Loading from '../Loading/Loading.jsx';
import ErrorPage from '../../../ErrorPage.jsx';
import { useEffect } from 'react';
import { useState } from 'react';
import PostCardPreview from '../PostCardPreview/PostCardPreview.jsx';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const api1 = `${VITE_BASE_URL}/home`;

const useFetchData = (currentCat) => {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
        let data = {};
        data['currentCat'] = currentCat;
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
            console.log(res1);
            if (!res1.ok) {
                throw new Error(`HTTP error! Status: ${Response.status}`);
            }

            const data1 = await res1.json();
            console.log('data1', data1);
            setPostData(data1);
        
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    fetchPosts();

  }, [currentCat]);

  return { loading, error, postData };
};

const Home = () => {
    const [currentCat, setCurrentCat] = useState(0);
    const { loading, error, postData } = useFetchData(currentCat);
    

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <ErrorPage />;
    }    

    const catStyle = {
        color: 'blue'
    }
    const clickHandler = () => {
        setCurrentCat(!currentCat);
    }

    return (
        <div className={styles.homePage}>
            
            <div className={styles.categories}>
                <p style={currentCat == 0 ? catStyle : null} onClick={clickHandler} className={styles.cat}>Recent</p>
                <p style={currentCat == 1 ? catStyle : null} onClick={clickHandler} className={styles.cat}>Most Liked</p>
            </div>
            <div className={styles.posts}>
                {
                    postData.map((post) => {
                        return (
                            <PostCardPreview 
                                key={post.id}
                                post={post}
                                user={post.user}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Home;
