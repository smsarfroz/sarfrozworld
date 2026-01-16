import { Link } from 'react-router-dom';
import styles from './Post.module.css'
import { AiOutlinePicture } from "react-icons/ai";
import { TbMovie } from "react-icons/tb";

const Post = () => {

    return (
        <div className={styles.postPage}>
            <div className={styles.textareaContainer}>
                <textarea name="" id="" placeholder='Share something...' maxLength="2000" rows="5" cols="10">
                </textarea>
                <div className={styles.featuresContainer}>
                    <div className={styles.iconsContainer}>
                        <AiOutlinePicture size={50} className={styles.icon}/>
                        <TbMovie size={50} className={styles.icon}/>
                    </div>
                    <div className={styles.postContainer}>
                        <p className={styles.characterCounter}>0/2000</p>
                        <button className={styles.postButton}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Post;