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
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import getErrorMessage from '../../utils/getErrorMessage.js';
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
    const [text, setText] = useState("");
    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const { userId } = useContext(SarfrozContext);
    const gifRef = useRef(null);

    const textArea = document.querySelector('textarea');
    const textRowCount = textArea ? textArea.value.split("\n").length : 0;
    const rows = textRowCount + 1;

    useEffect(() => {

        const handleClickOutside = (event) => {
            if (gifRef.current && !gifRef.current.contains(event.target)) {
                setShowGif(false);
            }
        };  
        if (showGif) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [showGif]);

    const handlePost = useCallback((publicURL) => {
        if (text.trim() !== "" && !imageLink) return;
        const api1 = `${VITE_BASE_URL}/post`;
        const sendPost = async () => {
            let data = {};
            data['text'] = text;
            data['imageLink'] = (publicURL ? publicURL : imageLink);
            data['userId'] = userId;
            try {
                const res1 = await (
                    fetch(api1, {
                        mode: 'cors',
                        credentials: 'include',
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                );
                if (!res1.ok) {
                    setLoading(false);
                    toast.error(getErrorMessage(res1.status));
                    throw new Error(`HTTP error! Status: ${res1.status}`);
                }

                const data1 = await res1.json();
                setLoading(false);
                navigate('/');
                return data1;
                
            } catch (error) {
                setLoading(false);
                console.error(`There was a problem with the fetch operation:`, error);
                toast.error(`There was a problem with the fetch operation`);
                throw error;
            }
        };
        sendPost();    
    }, [text, userId, navigate, imageLink]);

    const handlePictureClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImageFile(files[0]);
            setImageLink(URL.createObjectURL(files[0]));
            setShowImage(true);
        }
    };
    const handleCancel = () => {
        setShowImage(false);
        setImageLink(null);
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
        
        setLoading(true);
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
            // console.log('formData', [...formData]);
            try {
                const res1 = await (
                    fetch(api1, {
                        mode: 'cors',
                        credentials: 'include',
                        method: "post",
                        body: formData
                    })
                ); 
                if (!res1.ok) {
                    setLoading(false);
                    return res1.json().then(errorData => {
                        console.log('errorData', errorData);
                        console.error('Server errors:', errorData.error);
                        toast.error(errorData.error);
                        throw new Error(`HTTP error! status: ${res1.status}`);
                    })
                }

                const data1 = await res1.json();
                setPublicURL(data1);

                await handlePost(data1);
                setClicked(false);
                
            } catch (error) {
                setLoading(false);
                console.error(`There was a problem with the fetch operation:`, error);
                toast.error(error);
                setClicked(false);
                throw error;
            }
        };
        await sendImage();
    }
    const customStyle = {
        backgroundColor: "rgb(118, 118, 241)"
    };
    const styleObject = {
        brightness: '100%',
        cursor: "pointer"
    }

    return (
        <div className={styles.postPage}>
            <div className={styles.textareaContainer}>
                <TextareaAutosize className={styles.textareaAutosize} rows="10" name="" id="" placeholder='Share something...' disabled={loading} maxLength="2000" cols="10" onChange={e => {setCount(e.target.value.length); setText(e.target.value)}}>
                </TextareaAutosize>
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
                        {loading ? 
                        
                            <button className={styles.postButton} style={customStyle} onClick={sendFile}>Posting...</button>
                            :
                            <button className={styles.postButton} onClick={sendFile} disabled={!count && !imageLink} style={count > 0 ? styleObject : null}>Post</button>
                        }
                    </div>
                </div>
            </div>
            {showGif && !clicked ?
                <>
                    <div styleName={styles.gifWrapper} ref={gifRef}>
                        <Gif handleGifLinkChange={handleGifLinkChange} />
                    </div>
                </> :
                null
            }
        </div>
    )
};

export default Post;