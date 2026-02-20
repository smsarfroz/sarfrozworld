import styles from './PostCardPreview.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { Link } from 'react-router';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { SarfrozContext } from '../../sarfrozContext';
import { FaHeart } from "react-icons/fa";

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

function PostCardPreview({ post, user }) {
    const { likesState, updateLikeState } = useContext(SarfrozContext);
    // console.log('likesState', likesState, likesState[post.id], post.id, likesState[post.id]['likesCount']);
    const [tempLike, setTempLike] = useState(null);
    const [liked, setLiked] = useState(null);

    // console.log('tempLke', tempLike);

    useEffect(() => {
        
        if (likesState[post.id]) {
            setTempLike(likesState[post.id].likesCount);
            setLiked(likesState[post.id].liked);
        } else {
            setTempLike(post.likes);
            setLiked(false);
        }

    }, [post.likes, post.id, likesState]);
    // console.log('post from PostCardPreview', post, post.likes, tempLike);
    const handleLikes = async () => {
        let delta = 0;
        if (liked) {
            // setTempLike((prevLike) => prevLike - 1);
            // setLiked(false);
            updateLikeState(post.id, false, tempLike - 1);
        } else {
            // setTempLike((prevLike) => prevLike + 1);
            // setLiked(true);
            updateLikeState(post.id, true, tempLike + 1);
            delta = 1;
        }
        const api1 = `${VITE_BASE_URL}/post/update`;
        let data = {};
        data['postId'] = post.id;
        data['delta'] = delta;
        // console.log('data', data);
        try {
            const [res1] = await Promise.all([
                fetch(api1, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                })
            ]);
            if (!res1.ok) {
                throw new Error(`HTTP error! Status: ${Response.status}`);
            }

            // const data1 = await res1.json();

            // return data1;
            
        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            throw error;
        }
    }

    return (
        <div className={styles.post}>
            <Link to={`/posts/${post.id}`} key={post.id}>
                <div className={styles.userDetails}>
                    <div className={styles.leftPart}>
                        <img src={user.photo} alt="" className={styles.profilePhoto}/>
                        <Link to={`/u/${user.username}`} className={styles.username}>
                            <p>{user.username}</p>
                        </Link>
                        <p>• {post.createdAt}</p>
                    </div>
                    {/* <RiDeleteBin6Line /> */}
                </div>
                <p className={styles.text}>{post.text}</p>    
                <div className={styles.postImage}><img src={post.imageLink} alt="" /></div>
            </Link>
            <div className={styles.icons}>
                { 
                    liked ?
                    <FaHeart onClick={handleLikes} className={styles.icon}/>
                        :
                    <FaRegHeart onClick={handleLikes} className={styles.icon}/>
                }{tempLike}
                <FaRegComment className={styles.icon}/> 
            </div>
        </div>
    )
}

export default PostCardPreview;

