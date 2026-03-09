import { Link } from 'react-router-dom';
import styles from './Post.module.css'
import { AiOutlinePicture } from "react-icons/ai";
import { TbMovie } from "react-icons/tb";
import { useCallback, useEffect, useRef, useState } from 'react';
import { GiCancel } from "react-icons/gi";
import Gif from '../Gif/Gif.jsx';
import { SarfrozContext } from '../../sarfrozContext.js';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const Post = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const fileInputRef = useRef(null);
    const [imageLink, setImageLink] = useState(null);
    const [showImage, setShowImage] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [publicURL, setPublicURL] = useState(null);
    const [showGif, setShowGif] = useState(false);
    const [text, setText] = useState(null);
    const [clicked, setClicked] = useState(false);
    const { userId } = useContext(SarfrozContext);

    const handlePost = useCallback(() => {
        const api1 = `${VITE_BASE_URL}/post`;
        // console.log('imageLink, publicUrl', imageLink, publicURL);
        const sendPost = async () => {
            let data = {};
            data['text'] = text;
            data['imageLink'] = (imageLink ? imageLink : publicURL);
            data['userId'] = userId;
            try {
                const [res1] = await Promise.all([
                    fetch(api1, {
                        mode: 'cors',
                        credentials: 'include',
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                ]);
                if (!res1.ok) {
                    throw new Error(`HTTP error! Status: ${Response.status}`);
                }

                const data1 = await res1.json();
                navigate('/home');
                return data1;
                
            } catch (error) {
                console.error(`There was a problem with the fetch operation:`, error);
                throw error;
            }
        };
        sendPost();    
    }, [text, userId, navigate, publicURL, imageLink]);

    // useEffect(() => {
    //     if (publicURL) {
    //         handlePost();
    //     }
    // }, [publicURL, handlePost]);
    const handlePictureClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // console.log('Selected file:', files[0].name, files[0]);
            // console.log(URL.createObjectURL(files[0]));
            setImageFile(files[0]);
            setImageLink(URL.createObjectURL(files[0]));
            setShowImage(true);
        }
    };
    const handleCancel = () => {
        setShowImage(false);
    };
    const handleGifClick = () => {
        setShowGif(true);
    }
    const handleGifLinkChange = (link) => {
        setImageLink(link);
        setShowImage(true);
        setShowGif(false);
        setImageFile(null);
    }
    
    const sendFile = async () => {
        
        if (clicked) return;

        setClicked(true);
        if (!imageFile) {
            await handlePost();
            setClicked(false);
            return;
        }
        const api1 = `${VITE_BASE_URL}/uploadfile`;
        const sendImage = async () => {
            const formData = new FormData();
            formData.append('file', imageFile);
            console.log('formData', [...formData]);
            try {
                const [res1] = await Promise.all([
                    fetch(api1, {
                        mode: 'cors',
                        credentials: 'include',
                        method: "post",
                        body: formData
                    })
                ]); 
                console.log('res1', res1);
                if (!res1.ok) {
                    throw new Error(`HTTP error! Status: ${res1.status}`);
                }

                const data1 = await res1.json();
                setPublicURL(data1);

                await handlePost();
                setClicked(false);
                
            } catch (error) {
                console.error(`There was a problem with the fetch operation:`, error);
                setClicked(false);
                throw error;
            }
        };
        await sendImage();
    }
    const customStyle = {
        color: "red"
    };

    return (
        <div className={styles.postPage}>
            <div className={styles.textareaContainer}>
                <textarea name="" id="" placeholder='Share something...' disabled={clicked} maxLength="2000" rows="5" cols="10" onChange={e => {setCount(e.target.value.length); setText(e.target.value)}}>
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
                        
                        <AiOutlinePicture size={50} className={styles.icon} onClick={clicked ? null : handlePictureClick}/>
                        <TbMovie size={50} className={styles.icon} onClick={clicked ? null : handleGifClick}/>
                    </div>
                    <div className={styles.postContainer}>
                        <p className={styles.characterCounter}>{count}/2000</p>
                        {clicked ? 
                        
                            <button className={styles.postButton} style={customStyle} onClick={sendFile}>Posting...</button>
                            :
                            <button className={styles.postButton} onClick={sendFile}>Post</button>
                        }
                    </div>
                </div>
            </div>
            {showGif && !clicked ?
                <>
                    <Gif handleGifLinkChange={handleGifLinkChange} />
                </> :
                null
            }
        </div>
    )
};

export default Post;