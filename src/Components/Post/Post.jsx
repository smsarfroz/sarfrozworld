import { Link } from 'react-router-dom';
import styles from './Post.module.css'
import { AiOutlinePicture } from "react-icons/ai";
import { TbMovie } from "react-icons/tb";
import { useRef, useState } from 'react';
import { GiCancel } from "react-icons/gi";
import Gif from '../Gif/Gif.jsx';

const Post = () => {
    const [count, setCount] = useState(0);
    const fileInputRef = useRef(null);
    const [imageLink, setImageLink] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [showGif, setShowGif] = useState(false);

    const handlePictureClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            console.log('Selected file:', files[0].name);
            setImageLink(URL.createObjectURL(files[0]));
            setShowImage(true);
        }
    };
    const handleCancel = () => {
        setShowImage(false);
    };
    const handleGifClick = () => {
        setShowGif(true);
        console.log("Gif", showGif);
    }
    const handleGifLinkChange = (link) => {
        setImageLink(link);
        setShowImage(true);
        setShowGif(false);
    }

    return (
        <div className={styles.postPage}>
            <div className={styles.textareaContainer}>
                <textarea name="" id="" placeholder='Share something...' maxLength="2000" rows="5" cols="10" onChange={e => setCount(e.target.value.length)}>
                </textarea>
                {showImage ? 
                    <div className={styles.previewImageContainer}>
                        <img src={imageLink} alt="" className={styles.previewImage} onLoad={() => URL.revokeObjectURL(imageLink)}/>
                        <GiCancel size={25} className={styles.cancelButton} onClick={handleCancel}/>
                    </div> : 
                    null
                }
                <div className={styles.featuresContainer}>
                    <div className={styles.iconsContainer}>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        
                        <AiOutlinePicture size={50} className={styles.icon} onClick={handlePictureClick}/>
                        <TbMovie size={50} className={styles.icon} onClick={handleGifClick}/>
                    </div>
                    <div className={styles.postContainer}>
                        <p className={styles.characterCounter}>{count}/2000</p>
                        <button className={styles.postButton}>Post</button>
                    </div>
                </div>
            </div>
            {showGif ?
                <>
                    <Gif handleGifLinkChange={handleGifLinkChange} />
                </> :
                null
            }
        </div>
    )
};

export default Post;