import styles from './PostCardPreview.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";

function PostCardPreview({ post, user }) {
    return (
        <div className={styles.post}>
            <div className={styles.userDetails}>
                <div className={styles.leftPart}>
                    <img src={user.photo} alt="" className={styles.profilePhoto}/>
                    <p>{user.username}</p>
                    <p>• {post.createdAt}</p>
                </div>
                {/* <RiDeleteBin6Line /> */}
            </div>
            <p className={styles.text}>{post.text}</p>    
            <div className={styles.postImage}><img src={post.imageLink} alt="" /></div>
            <div className={styles.icons}>
                <FaRegHeart />
                <FaRegComment />
            </div>
        </div>
    )
}

export default PostCardPreview;