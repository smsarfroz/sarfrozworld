import { useContext, useEffect, useState } from "react";
import PostContent from "../PostContent/PostContent.jsx";
import { SarfrozContext } from "../../sarfrozContext.js";
import { useParams } from "react-router-dom";
import Comments from "../Comments/Comments.jsx";
import { useQuery } from '@tanstack/react-query';
import { toast } from "react-toastify";
import getErrorMessage from "../../utils/getErrorMessage.js";

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

function PostCard() {
    const { postId } = useParams();
    const [commentsCount, setCommentsCount] = useState(0);
    const api = `${VITE_BASE_URL}/post/${postId}`;
    const { isPending, error, data } = useQuery({
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
                setCommentsCount(jsonData.comments.length);
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

    if (isPending) return <p>loading...</p>;
    if (error) return <p>{error}</p>
    const post = data;
    // console.log('post', post);
    

    // const handleDelete = async () => {
    //     const api = `${VITE_BASE_URL}/post/delete`;
    //     try {
    //         const res = await fetch(api, {
    //             mode: 'cors',
    //             credentials: 'include',
    //             method: "get",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         })

    //         if (!res.ok) {
    //             throw new Error(`HTTP error! Status: ${res.status}`);
    //         }

    //     } catch(error) {
    //         console.error(`There was an error while fetching: `,error);
    //         throw error;
    //     }
    // };

    return (
        <>
            <PostContent
                post={post}
                user={post.user}
                setDeleted={setDeleted}
                showFullContent={true}
                commentsCount={commentsCount}
            />
            <Comments 
                setCommentsCount={setCommentsCount}
            />
        </>
    )
}

export default PostCard;