import styles from './TaskDetails.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, deleteTask } from '../../api/internal';
import Loader from '../../components/Loader/Loader';

function TaskDetails() {
    const [task, setTask] = useState(null);
    const [ownsTask, setOwnsTask] = useState(false);
    // const [reload, setReload] = useState(false);

    const navigate = useNavigate();
    const { id: taskId } = useParams();

    const userId = useSelector(state => state.user?._id);

    useEffect(() => {
        async function getTaskDetails() {
            const taskResponse = await getTaskById(taskId);
            if (taskResponse.status === 200) {
                setTask(taskResponse.data);
                setOwnsTask(userId === taskResponse.data.userId); // Compare userId instead of username
            }
        }
        getTaskDetails();
    }, [ taskId, userId]);

    const deleteTaskHandler = async () => {
        const response = await deleteTask(taskId);
        if (response.status === 200) {
            navigate('/tasks'); // Navigate back to tasks list
        }
    };

    if (task === null) {
        return <Loader text="task details" />;
    }

    return (
        <div className={styles.taskDetailsLayout}>
        <div className={styles.detailsWrapper}>
            <div className={styles.left}>
                <h1 className={styles.title} style={{ color: "white" }}>{task.title}</h1>
                <p className={styles.content} style={{ color: "white" }}>{task.description}</p>

                {ownsTask && (
                    <div className={styles.controls}>
                        <button className={styles.editButton} onClick={() => navigate(`/task-update/${task._id}`)}>
                            Edit
                        </button>
                        <button className={styles.deleteButton} onClick={deleteTaskHandler}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}

export default TaskDetails;
