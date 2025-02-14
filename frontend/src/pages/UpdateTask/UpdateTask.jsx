import styles from "./UpdateTask.module.css";
import { useState, useEffect } from "react";
import { getTaskById, updateTask } from "../../api/internal"; 
import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
import TextInput from "../../components/TextInput/TextInput";
import Loader from "../../components/Loader/Loader";

function UpdateTask() {
    const navigate = useNavigate();
    const { id: taskId } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // const author = useSelector((state) => state.user?._id);

    // 🔹 Fetch task details
    useEffect(() => {
        async function getTaskDetails() {
            try {
                const response = await getTaskById(taskId);
                if (response.status === 200) {
                    setTitle(response.data.title);
                    setDescription(response.data.description);
                } else {
                    setError("Failed to fetch task details.");
                }
            } catch (err) {
                console.error("Error fetching task details:", err);
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        getTaskDetails();
    }, [taskId]);

    // 🔹 Update Task Handler
   // 🔹 Update Task Handler
const updateHandler = async () => {
    if (!title.trim() || !description.trim()) {
        setError("Title and description cannot be empty.");
        return;
    }

    const data = { title, description }; 
    setError("");

    try {
        const response = await updateTask(taskId, data);
        if (response.status === 200) {
            navigate("/tasks"); // Redirect to the tasks list after update
        } else {
            setError(response.data?.message || "Failed to update task. Please try again.");
        }
    } catch (error) {
        console.error("Error updating task:", error);
        setError(error.response?.data?.message || "Something went wrong while updating.");
    }
};


    if (loading) {
        return <Loader text="Loading task..." />;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}><h2>Edit Your Task</h2></div>
            {error && <p className={styles.error}>{error}</p>}
            <TextInput
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "63%" }}
            />
            <textarea
                className={styles.content}
                placeholder="Your content"
                maxLength={400}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button
                className={styles.update}
                onClick={updateHandler}
                disabled={!title.trim() || !description.trim()}
            >
                Update
            </button>
        </div>
    );
}

export default UpdateTask;
