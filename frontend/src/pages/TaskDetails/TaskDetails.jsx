import styles from './TaskDetails.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTaskById, deleteTask} from '../../api/internal';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';


function TaskDetails(){

    const [task, setTask] = useState([]);
    const [ownsTask, setOwnsTask] = useState(false);
    const [reload, setReload] = useState(false);

    const navigate = useNavigate();

    const params = useParams();
    const taskId = params.id;

    const username = useSelector(state=>state.user.username);
    const userId = useSelector(state=>state.user._id);

    useEffect(() => {
        async function getTaskDetails() {
    
            const taskResponse = await getTaskById(taskId);
            if (taskResponse.status === 200) {
                setOwnsTask(username === taskResponse.data.authorUsername); 
                setTask(taskResponse.data);
            }
        }
        getTaskDetails();
    }, [reload, taskId, username]);  
    
    const deleteTaskHandler = async() => {
        const response = await deleteTask(taskId);

        if(response.status === 200){
            navigate('/');
        }
    };

    if (task.length === 0){
        return <Loader text="task details"/>
    }

    return(
        <div className={styles.detailsWrapper}>
            <div className={styles.left}>
                <h1 className={styles.title}>{task.title}</h1>
                
                <p className={styles.content}>
                    {task.description}
                </p>
             
            
                        <div className={styles.controls}>
                            <button className={styles.editButton} onClick={() => {navigate(`/task-update/${task._id}`)}}>Edit</button>
                            <button className={styles.deleteButton} onClick={deleteTaskHandler}>Delete</button>
                        </div>
                
            </div>
        </div>
    )
}

export default TaskDetails;