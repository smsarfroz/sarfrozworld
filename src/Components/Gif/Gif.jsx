import { useEffect, useState } from 'react';
import styles from './Gif.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getErrorMessage from '../../utils/getErrorMessage';

const VITE_BASE_URL =  import.meta.env.VITE_BASE_URL || '/api';

const api = `${VITE_BASE_URL}/gifs/search`;

const useGif = () => {

  const getGifs = async (searchText) => {
        
    try {
      const res1 = await (
        fetch(`${api}?searchText=${searchText}`, {
          headers: {
              "Content-Type": "application/json",
          },
        })
      );

      if (!res1.ok) {
        toast.error(getErrorMessage(res1.status));
        throw new Error(`HTTP error! Status: ${res1.status}`);
      }

      const data1 = await res1.json();

      return data1;

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
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const list = await getGifs(searchText);
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
        try {
          const list = await getGifs(safeQuery);
          setGifList(list);
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