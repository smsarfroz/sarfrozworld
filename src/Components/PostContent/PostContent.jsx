import styles from './PostContent.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { Link, Navigate } from 'react-router';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { SarfrozContext } from '../../sarfrozContext.js';
import { FaHeart } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { toast } from 'react-toastify';
import getErrorMessage from '../../utils/getErrorMessage.js';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

function PostContent({ post, user, setDeleted, showFullContent = false, commentsCount}) {
    const navigate = useNavigate();
    const { likesState, updateLikeState, userObj } = useContext(SarfrozContext);
    const [tempLike, setTempLike] = useState(null);
    const [liked, setLiked] = useState(null);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        
        if (likesState[post.id]) {
            setTempLike(likesState[post.id].likesCount);
            setLiked(likesState[post.id].liked);
        } else {
            setTempLike(post.likes);
            setLiked(false);
        }

    }, [post.likes, post.id, likesState, post.imageLink]);

    const onHover = () => {
        setHover(true);
    }

    const onLeave = () => {
        setHover(false);
    }

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
        data['userId'] = userObj.userId;
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
                toast.error(getErrorMessage(res1.status));
                throw new Error(`HTTP error! Status: ${res1.status}`);
            }

        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error('There was a problem with fetch operation');
            throw error;
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to delete this post?");

        if (isConfirmed) {

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
                    toast.error(getErrorMessage(res1.status));
                    throw new Error(`HTTP error! Status: ${res1.status}`);
                }
            } catch (error) {
                console.error(`There was a problem with the fetch operation:`, error);
                toast.error('There was a problem with fetch operation');
                throw error;
            }
            setDeleted(true);
            toast.success(`Post deleted successfully.`);
            if (showFullContent) {
                navigate('/home');
            }
        } 
    };

    const ContentWrapper = showFullContent ? 'div' : 'div';
    const wrapperProps = showFullContent 
        ? { className: styles.ContentWrapper }
        : { className: styles.ContentWrapper };

    function handleClickContentWrapper(pid) {
        if (!showFullContent) {
            navigate(`/posts/${pid}`);
        }
    }
    function handleUserClick(e, uid) {
        e.stopPropagation();
        navigate(`/u/${uid}`);
    }

    return (
        <div className={styles.post} onMouseEnter={onHover} onMouseLeave={onLeave}>
            <ContentWrapper {...wrapperProps} key={post.id} onClick={() => handleClickContentWrapper(post.id)}>
                <div className={styles.userDetails}>
                    <div className={styles.leftPart}>
                        <img src={user.photo} alt="" className={styles.profilePhoto}/>
                        <span onClick={(e) => handleUserClick(e, user.id)} className={styles.username}>
                            <p className={styles.username}>{user.username}</p>
                        </span>
                        <p className={styles.createdAt}>• <TimeAgo date={post.createdAt}/></p>
                    </div>
                    { userObj.userId === user.id && hover ? 
                    
                        <RiDeleteBinLine className={styles.deleteIcon} onClick={handleDelete}/>
                        :
                        null
                    }
                </div>
                <p className={styles.text}>{post.text}</p>    
                {post.imageLink && (
                    <div className={styles.postImage}><img src={post.imageLink} alt="" className={styles.contentImage}/></div>
                )}
            </ContentWrapper>

            <div className={styles.icons}>
                <div className={styles.likeSection}>
                    {
                        liked ?
                        <FaHeart onClick={handleLikes} className={styles.icon}/>
                            :
                        <FaRegHeart onClick={handleLikes} className={styles.icon}/>
                    }
                    <p>{tempLike}</p>
                </div>
                <div className={styles.commentsSection} onClick={() => handleClickContentWrapper(post.id)}>
                    <FaRegComment className={styles.icon}/> 
                    <p>{commentsCount}</p>
                </div>
            </div>
        </div>
    )
}

export default PostContent;

