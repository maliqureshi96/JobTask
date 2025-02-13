import styles from './Home.module.css';
import Loader from '../../components/Loader/Loader';

function Home(){
     
    return(
        <>
            <div className={styles.maindiv}>
            <h1 className={styles.main}>Welcome to Task Flow</h1>
            </div>
        </>
    );
}

export default Home;
