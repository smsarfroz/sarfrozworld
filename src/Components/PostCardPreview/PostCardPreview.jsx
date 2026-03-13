import PostContent from "../PostContent/PostContent.jsx";

function PostCardPreview({ post, user, setDeleted, commentsCount }) {
    return (
        <PostContent
            post={post}
            user={user}
            setDeleted={setDeleted}
            showFullContent={false}
            commentsCount={commentsCount}
        />
    );
}

export default PostCardPreview;