import { useState } from 'react';
import styles from './Gif.module.css';

const useGif = (searchText) => {
  const api1 = import.meta.env.VITE_API_KEY;
  const gifUrl = `https://api.giphy.com/v1/gifs/translate?api_key=${api1}&s=${searchText}&weirdness=4`;

  const getGifs = async () => {
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
        console.log("data1", data1);
        return data1;
        
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
    const { getGifs } = useGif();
    console.log(searchText);
    console.log("gifList", gifList);
    const handleSubmit = () => {
        setGifList(getGifs(searchText));
    };

    return (
        <div className={styles.GifContainer}>
            <div className={styles.topContainer}>
                <input type="text" className={styles.searchBar} placeholder='Search GIFs' value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
};

export default Gif;