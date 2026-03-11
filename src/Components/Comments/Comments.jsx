import { useContext, useEffect, useState } from 'react';
import styles from './Comments.module.css';
import TextareaAutosize from 'react-textarea-autosize';
import { useParams } from 'react-router';
import { SarfrozContext } from '../../sarfrozContext';
import { useQuery } from '@tanstack/react-query';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Comments = () => {
    const [charCount, setCharCount] = useState(0);
    const { userId } = useContext(SarfrozContext);
    const { postId } = useParams();
    const [content, setContent] = useState("");
    const [comments, setComments] = useState(null);
    const id = parseInt(postId);

    const api1 = `${VITE_BASE_URL}/posts/${id}/comments`;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ["commentData"],
        staleTime: 0,   
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const jsonData = await response.json();
                setComments(jsonData);
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

    }, [ refetch, data ]);

    const postComment = async () => {
        const api = `${VITE_BASE_URL}/posts/${id}/comments`;
        try {
            const [res1] = await Promise.all([
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
            ]);
            if (!res1.ok) {
                throw new Error(`HTTP error! Status: ${Response.status}`);
            }
            const data = res1.json();
            console.log('added comment', data);
            setContent("");
            setCharCount(0); 

        } catch (error) {
            console.error(`There was a problem with the fetch operation:`, error);
            throw error;
        }
    };


    const handleCommentChange = (e) => {
        setCharCount(e.target.value.length);
        setContent(e.target.value);
    };

    const styleObject = {
        filter: "brightness(100%)"
    }

    return (

        <div styleName={styles.biggerContainer}>
            <div className={styles.commentContainer}>
                <TextareaAutosize name="addComment" id="" placeholder='Add a comment...' className={styles.comments} onChange={handleCommentChange} maxLength={500} rows="5" cols="30">
            
                </TextareaAutosize>
                <div className={styles.container}>
                    <p className={styles.charCount}>{charCount}/500</p>
                    <button onClick={postComment} style={charCount > 0 ? styleObject : null}>Reply</button>
                </div>
            </div>

        </div>
    )
};

export default Comments; 