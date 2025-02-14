import { useState } from 'react';
import { submitTask } from '../../api/internal';
import { useSelector } from 'react-redux';
import TextInput from '../../components/TextInput/TextInput';
import { useNavigate } from 'react-router-dom';
import styles from './SubmitTask.module.css';

function SubmitTask() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const userId = useSelector(state => state.user?._id); // Get userId from Redux state

    const submitHandler = async () => {
        if (!userId) {
            alert('User not logged in. Please login first.');
            return;
        }

        const data = {
            userId, // Include userId in request
            title,
            description,
            completed: false, // Default to false (optional)
        };

        const response = await submitTask(data);

        if (response.status === 201) {
            navigate('/tasks'); // Redirect to task list page
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}><h2>Create a Task</h2></div>
            <TextInput
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '64%' }}
            />
            <textarea
                className={styles.content}
                placeholder="Your description"
                maxLength={400}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button
                className={styles.submit}
                onClick={submitHandler}
                disabled={!title || !description} // Disable if fields are empty
            >
                Submit
            </button>
        </div>
    );
}

export default SubmitTask;
