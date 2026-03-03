import styles from './PostCardPreview.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { Link } from 'react-router';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { SarfrozContext } from '../../sarfrozContext';
import { FaHeart } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

function PostCardPreview({ post, user, setDeleted }) {
    const { likesState, updateLikeState, userId } = useContext(SarfrozContext);
    const [tempLike, setTempLike] = useState(null);
    const [liked, setLiked] = useState(null);

    useEffect(() => {
        
        if (likesState[post.id]) {
            setTempLike(likesState[post.id].likesCount);
            setLiked(likesState[post.id].liked);
        } else {
            setTempLike(post.likes);
            setLiked(false);
        }

    }, [post.likes, post.id, likesState, post.imageLink]);

    const handleLikes = async () => {
        let delta = 0;
        if (liked) {
            updateLikeState(post.id, false, tempLike - 1);
        } else {
            updateLikeState(post.id, true, tempLike + 1);
            delta = 1;
        }
        const api1 = `${VITE_BASE_URL}/post/update`;
        let data = {};
        data['postId'] = post.id;
        data['delta'] = delta;
        data['userId'] = userId;
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

        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            throw error;
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const api1 = `${VITE_BASE_URL}/post/delete`;
        let data = {};
        data['postId'] = post.id;
        try {
            const res1 = await (
                fetch(api1, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                })
            );
            if (!res1.ok) {
                throw new Error(`HTTP error! Status: ${Response.status}`);
            }
            
        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            throw error;
        }
        setDeleted(true);
        
    };

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
                    { userId === user.id ? 
                    
                        <RiDeleteBinLine className={styles.deleteIcon} onClick={handleDelete}/>
                        :
                        null
                    }
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

