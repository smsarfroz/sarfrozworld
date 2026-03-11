import PostContent from "../PostContent/PostContent.jsx";

function PostCardPreview({ post, user, setDeleted }) {
    return (
        <PostContent
            post={post}
            user={user}
            setDeleted={setDeleted}
            showFullContent={false}
        />
    );
}

export default PostCardPreview;