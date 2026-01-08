import styles from "./Loading.module.css";
import { Trefoil } from 'ldrs/react'
import 'ldrs/react/Trefoil.css'


const Loading = () => {

    return <>
        
            <Trefoil
            size="40"
            stroke="4"
            strokeLength="0.15"
            bgOpacity="0.1"
            speed="1.4"
            color="white" 
            className={styles.loadingIcon}
            />
        
    </>

};

export default Loading;