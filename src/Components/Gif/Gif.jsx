import { useState } from 'react';
import styles from './Gif.module.css';

const useGif = () => {

  const getGifs = async (searchText) => {
      const api1 = import.meta.env.VITE_API_KEY;
      const gifUrl = `https://api.giphy.com/v1/gifs/search?api_key=${api1}&q=${searchText}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;
  
      try {
        const [res1] = await Promise.all([
          fetch(gifUrl, {
            mode: 'cors',
          })
        ]);
        if (!res1.ok) {
          throw new Error(`HTTP error! Status: ${Response.status}`);
        }

        const data1 = await res1.json();
        console.log("images", data1.data);
        return data1.data;
    
      } catch (error) {
        console.error(`There was a problem with the fetch operation:`, error);
        throw error;
      }
  };

  return { getGifs };
};

const Gif = () => {
    const [searchText, setSearchText] = useState("");
    const [gifList, setGifList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { getGifs } = useGif();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const list = await getGifs(searchText);
        setGifList(list);
        setLoading(false);
    };

    return (
        <div className={styles.GifContainer}>
            <form action="" method='post' onSubmit={handleSubmit}>
              <div className={styles.topContainer}>
                    <input type="text" className={styles.searchBar} placeholder='Search GIFs' value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                    <button type='submit' className={styles.submitButton} onClick={handleSubmit}>Submit</button>
              </div>
            </form>

            {
              loading ? 
              <p className={styles.loadingLine}>Loading...</p> :

              <div className={styles.gif}>
                {
                  gifList.map((gif, i) => {
                    return (
                      <img src={gif.images.fixed_height.url} alt="" key={i} className={styles.gifImg}/>
                    )
                  })
                }
              </div> 
            }
            
        </div>
    )
};

export default Gif;