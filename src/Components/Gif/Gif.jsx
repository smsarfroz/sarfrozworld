import { useEffect, useState } from 'react';
import styles from './Gif.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getErrorMessage from '../../utils/getErrorMessage';

const useGif = () => {

  const getGifs = async (url) => {
      
    try {
      console.log("here");
      const res1 = await (
        fetch(url, {
          headers: {
              "Content-Type": "application/json",
          },
        })
      );
      console.log('res1 in getGifs', res1);
      if (!res1.ok) {
        toast.error(getErrorMessage(res1.status));
        throw new Error(`HTTP error! Status: ${res1.status}`);
      }

      const data1 = await res1.json();
      console.log("images", data1);
      return data1.data;

    } catch (error) {
      console.error(`There was a problem with the fetch operation:`, error);
      toast.error('There was a problem with fetch operation');
      throw error;    
    }
  };

  return { getGifs };
};

const Gif = ({ handleGifLinkChange }) => {
    const [searchText, setSearchText] = useState("");
    const [gifList, setGifList] = useState(null);
    const [trendingGifList, setTrendingGifList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { getGifs } = useGif();
    const navigate = useNavigate();
  
    const api1 = import.meta.env.VITE_API_KEY;
    
    const gifUrl2 = `https://api.giphy.com/v1/gifs/trending?api_key=${api1}&limit=25&offset=0&rating=g&bundle=messaging_non_clips`;

    console.log("in Gif component");
    useEffect(() => {
      console.log("in useEffect");
      const fetchData = async () => {
        try {
          console.log("inside fetchData");
          const list = await getGifs(gifUrl2);
          setTrendingGifList(list);
        } catch (error) {
          setError(error);
          console.error("Fetch error:", error);
        }
      }
      fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const safeQuery = encodeURIComponent(searchText.trim());
        const gifUrl1 = `https://api.giphy.com/v1/gifs/search?api_key=${api1}&q=${safeQuery}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;
        const url = searchText == "" ? gifUrl2 : gifUrl1;
        try {
          const list = await getGifs(url);
          setGifList(list);
          // navigate('/home');
        } catch (error) {
          console.error("Submission Error:", error);
          toast.error("There was a problem while submitting.");
        } finally {
          setLoading(false);
        }
    };

    if (error) {
      return <div>Error: {error.message}</div>;
    }
    return (
        <div className={styles.GifContainer}>
            <form action="" method='post' onSubmit={handleSubmit}>
              <div className={styles.topContainer}>
                    <input type="text" className={styles.searchBar} placeholder='Search GIFs' value={searchText} maxLength={50} onChange={(e) => setSearchText(e.target.value)}/>
                    <button type='submit' className={styles.submitButton} onClick={handleSubmit}>Submit</button>
              </div>
            </form>

            <div className={styles.gifGridContainer}>
              {
                loading ?
                <p className={styles.loadingLine}>Loading...</p> :
              
                <>
              
                  {
                    gifList != null ?
                    <div className={styles.gif}>
                      {
                        gifList.map((gif, i) => {
                          return (
                            <img src={gif.images.fixed_height.url} alt="" key={i} className={styles.gifImg} onClick={() => handleGifLinkChange(gif.images.fixed_height.url)}/>
                          )
                        })
                      }
                    </div>  :
                    <div className={styles.gif}>
                      {
                        trendingGifList.map((gif, i) => {
                          return (
                            <img src={gif.images.fixed_height.url} alt="" key={i} className={styles.gifImg} onClick={() => handleGifLinkChange(gif.images.fixed_height.url)}/>
                          )
                        })
                      }
                    </div>
                  }
                </>
              }
            </div>
            
        </div>
    )
};

export default Gif;