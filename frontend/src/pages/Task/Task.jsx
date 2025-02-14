import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserTasks } from "../../api/internal";
import styles from "./Task.module.css";
import { Link } from "react-router-dom";

function Task() {
    const [tasks, setTasks] = useState([]);
    const userId = useSelector((state) => state.user._id);

    useEffect(() => {
        async function fetchTasks() {
            const response = await getUserTasks(userId);
            console.log("API Response:", response); // Debugging
            if (response?.status === 200) {
                setTasks(response.data);
            } else {
                console.error("Failed to fetch tasks:", response);
            }
        }
        if (userId) {
            fetchTasks();
        }
    }, [userId]);

    return (
        <div className={styles.taskLayout}>
        <div className={styles.taskWrapper}>
            <div className={styles.taskHeading}><h2>Your Tasks</h2></div>
            {tasks.length === 0 ? (
                <p className={styles.noTask}>No tasks available.</p>
            ) : (
                tasks.map((task) => (
                    <div key={task._id} className={styles.taskItem}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <div className={styles.viewDetails}>
                            <button>
                            <Link to={`/task/${task._id}`}>
                                View Details
                                </Link>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
        </div>
    );
}

export default Task;
