import styles from './Gif.module.css';

const Gif = () => {

    return (
        <div className={styles.GifContainer}>
            <div className={styles.topContainer}>
                <input type="text" className={styles.searchBar} placeholder='Search GIFs'/>
                <button className={styles.submitButton}>Submit</button>
            </div>
        </div>
    )
};

export default Gif;