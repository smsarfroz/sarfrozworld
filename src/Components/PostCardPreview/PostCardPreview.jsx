import styles from './PostCardPreview.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { Link } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

function PostCardPreview({ post, user }) {
    const [tempLike, setTempLike] = useState(null);
    useEffect(() => {
        setTempLike(post.likes);
    }, [post.likes]);
    console.log('post from PostCardPreview', post, post.likes, tempLike);
    const handleLikes = async () => {
        setTempLike((prevLike) => prevLike + 1);
        const api1 = `${VITE_BASE_URL}/post/update`;
        const likePost = async () => {
            let data = {};
            data['postId'] = post.id;
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
        };
        likePost();
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
                <FaRegHeart onClick={handleLikes} className={styles.icon}/>{tempLike}
                <FaRegComment className={styles.icon}/> 
            </div>
        </div>
    )
}

export default PostCardPreview;

