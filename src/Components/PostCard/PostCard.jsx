import { useContext, useEffect, useState } from "react";
import PostContent from "../PostContent/PostContent.jsx";
import { SarfrozContext } from "../../sarfrozContext.js";
import { useParams } from "react-router-dom";
import Comments from "../Comments/Comments.jsx";

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const usePost = (postId) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const api = `${VITE_BASE_URL}/post/${postId}`;

    useEffect(() => {
        const fn = async () => {
            try {
                const res = await fetch(api, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${Response.status}`);
                }
                
                const data = await res.json();
                setPost(data);
                setLoading(false);
            } catch (error) {
                console.error(`There was a problem with fetch error:`, error);
                setError(error);
                throw error;
            } 
        };
        fn();
    }, [api]);

    return { post, loading, error };
};

function PostCard() {
    const { postId } = useParams();
    const { post, loading, error } = usePost(parseInt(postId));
    const { setDeleted } = useContext(SarfrozContext);

    if (loading) return <p>loading...</p>;
    if (error) return <p>{error}</p>

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
            />
            <Comments />
        </>
    )
}

export default PostCard;