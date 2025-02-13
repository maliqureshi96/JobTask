import {useState} from 'react';
import {submitTask} from '../../api/internal';
import { useSelector } from 'react-redux';
import TextInput from '../../components/TextInput/TextInput';
import { useNavigate } from 'react-router-dom';
import styles from './SubmitTask.module.css';

// in this page we are not using formik so we use states to validate

function SubmitTask () {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const author = useSelector(state => state.user?._id);

    const submitHandler = async () => {
        const data = {
            // author,
            title,
            description,
        };
        const response = await submitTask(data);

        if(response.status === 201){
            navigate('/')
        }
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.header}>Create a Task</div>
            <TextInput
                type ="text"
                name = "title"
                placeholder = "title"
                value = {title}
                onChange = {(e)=> setTitle(e.target.value)}
                style={{width: '60%'}}
            />
            <textarea
                className={styles.content}
                placeholder='your content'
                maxLength={400}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button className={styles.submit} onClick={submitHandler}
            disabled={title === '' || description === ''}
            >Submit</button>
        </div>
    )
}

export default SubmitTask;