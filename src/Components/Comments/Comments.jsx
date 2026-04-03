import { useContext, useEffect, useState } from 'react';
import styles from './Comments.module.css';
import TextareaAutosize from 'react-textarea-autosize';
import { useParams } from 'react-router';
import { SarfrozContext } from '../../sarfrozContext';
import { useQuery } from '@tanstack/react-query';
import { RiDeleteBinLine } from "react-icons/ri";
import TimeAgo from 'react-timeago';
import { toast } from 'react-toastify';
import getErrorMessage from '../../utils/getErrorMessage';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Comments = ({ setCommentsCount=false }) => {
    const [charCount, setCharCount] = useState(0);
    const { userId } = useContext(SarfrozContext);
    const { postId } = useParams();
    const [content, setContent] = useState("");
    // const [comments, setComments] = useState(null);
    const [hoveredCommentId, setHoveredCommentId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const id = parseInt(postId);

    const api1 = `${VITE_BASE_URL}/posts/${id}/comments`;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ["commentData", id],
        staleTime: 30000,   
        queryFn: async () => {
            try {                
                const response = await fetch(api1, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    toast.error(getErrorMessage(response.status));
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const jsonData = await response.json();
                // setComments(jsonData);
                return jsonData;
                
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('There was a problem with fetch operation');
                throw error;
            }
        },
        refetchOnWindowFocus: true, 
        refetchOnMount: true, 
        refetchOnReconnect: true,
    })

    // useEffect(() => {
    //      refetch();
    // }, [ id, refetch ]);

    const comments = data;

    const postComment = async () => {
        if (!content.trim()) return;

        const api = `${VITE_BASE_URL}/posts/${id}/comments`;
        try {
            const [res1] = await (
                fetch(api, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        postId: id, 
                        userId: userId, 
                        content: content
                    })
                })
            );
            if (!res1.ok) {
                toast.error(getErrorMessage(res1.status));
                throw new Error(`HTTP error! Status: ${res1.status}`);
            }
            const data = await res1.json();
            console.log('added comment', data);
            setCommentsCount(prevCt => prevCt + 1);
            setContent("");
            setCharCount(0); 
            refetch();

        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error('There was a problem with fetch operation');
            throw error;
        }
    };

    const handleDelete = async (commentId, e) => {
        e.stopPropagation();

        if (deletingCommentId === commentId) return;

        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        setDeletingCommentId(commentId);

        const api = `${VITE_BASE_URL}/posts/${id}/comments/${commentId}`;
        try {
            const res1 = await (
                fetch(api, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "delete",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );
            if (!res1.ok) {
                toast.error(getErrorMessage(res1.status));
                throw new Error(`HTTP error! Status: ${res1.status}`);
            }
            const data = await res1.json();
            console.log('deleted comment', data);

            // setComments(prevComments => 
            //     prevComments.filter(comment => comment.id !== commentId)
            // );
            setCommentsCount(prevCt => prevCt - 1);
            refetch();
            
        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            toast.error('There was a problem with fetch operation');
            refetch();
            throw error;
        } finally {
            setDeletingCommentId(null);
        }
    };

    const handleCommentChange = (e) => {
        setCharCount(e.target.value.length);
        setContent(e.target.value);
    };

    const styleObject = {
        filter: "brightness(100%)",
        cursor: "pointer",
        outline: "none",
        border: "none"
    }

    return (

        <div className={styles.biggerContainer}>
            <div className={styles.commentContainer}>
                <TextareaAutosize name="addComment" id="" placeholder='Add a comment...' className={styles.comments} value={content} onChange={handleCommentChange} maxLength={500} rows="5" cols="30">
                </TextareaAutosize>
                <div className={styles.container}>
                    <p className={styles.charCount}>{charCount}/500</p>
                    <button className={styles.replyButton} onClick={postComment} style={charCount > 0 ? styleObject : null} disabled={!content.trim()}>Reply</button>
                </div>
            </div>
            {
                isPending ? (
                    <p>Loading...</p>
                ): error ? (
                    <p>{error}</p>
                ): (
                    <>
                        {
                            comments && comments.length > 0 ? (comments.map((comment) => {
                                return (
                                    <div className={styles.comment} key={comment.id} onMouseEnter={() => setHoveredCommentId(comment.id)} onMouseLeave={() => setHoveredCommentId(null)}>
                                        <div className={styles.leftPart}>
                                            <div className={styles.photo}><img src={comment.user.photo} alt="" className={styles.userPhoto}/></div>
                                            <div className={styles.text}>
                                                <div className={styles.details}>
                                                    <p className={styles.username}>{comment.user.username} </p>
                                                    <p className={styles.createdAt}>{' '} • <TimeAgo date={comment.createdAt} /></p>
                                                </div>
                                                <p className={styles.content}>{comment.content}</p>
                                            </div>
                                        </div>

                                        { userId === comment.user.id && hoveredCommentId === comment.id ? 
                                                            
                                            <RiDeleteBinLine className={`${styles.deleteIcon} ${deletingCommentId === comment.id ? styles.deleting : ''}`} onClick={(e) => handleDelete(comment.id, e)}/>
                                            :
                                            null
                                        }
                                    </div>
                                )
                            })) : (
                                null
                            )
                        }
                    </>
                )
            }
        </div>
    )
};

export default Comments; 