import { useContext, useEffect, useState } from "react";
import PostContent from "../PostContent/PostContent.jsx";
import styles from './PostCard.module.css';
import { SarfrozContext } from "../../sarfrozContext.js";
import { useParams } from "react-router-dom";
import Comments from "../Comments/Comments.jsx";
import { useQuery } from '@tanstack/react-query';
import { toast } from "react-toastify";
import getErrorMessage from "../../utils/getErrorMessage.js";

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

function PostCard() {
    const { postId } = useParams();
    const api = `${VITE_BASE_URL}/post/${postId}`;
    const { isPending, error, data, refetch } = useQuery({
        queryKey: ["postData", api],
        staleTime: 0,   
        queryFn: async () => {
            try {                
                const response = await fetch(api, {
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

    const { setDeleted } = useContext(SarfrozContext);

    if (isPending) return <p className={styles.loading}>loading...</p>;
    if (error) return <p>{error}</p>
    const post = data;

    const commentsCount = post?.comments?.length ?? 0;

    return (
        <>
            {
                (data?.comments?.length !== commentsCount) ? 
                (
                    <p className={styles.loading}>loading...</p>
                ): (
                    <div className={styles.postCardPage}>
                        <div className={styles.post}>
                            <PostContent
                                post={post}
                                user={post.user}
                                setDeleted={setDeleted}
                                showFullContent={true}
                                commentsCount={commentsCount}
                            />
                        </div>
                        <Comments 
                            refetchPost={refetch}
                        />
                    </div>
                )
            }
        </>
    )
}

export default PostCard;