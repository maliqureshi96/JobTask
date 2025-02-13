import { useState, useEffect } from 'react';
import Loader from '../../components/Loader/Loader';
import { getAllTasks } from '../../api/internal';
import styles from './Task.module.css';
import { useNavigate } from 'react-router-dom';

function Task() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        (async function getAllTaskApiCall() {
            const response = await getAllTasks();
            if (response.status === 200) {
                setTasks(response.data);
            }
        })();
    }, []);

    // if (tasks.length === 0) {
    //     return <Loader text="tasks" />;
    // }

    return (
        <div className={styles.blogsWrapper}>
            {tasks.map((task) => (
                <div key={task._id} className={styles.blog} onClick={() => navigate(`/task/${task._id}`)}>
                    <h1>{task.title}</h1>
                    <p>{task.content}</p>
                </div>
            ))}
        </div>
    );
}

export default Task;
