import styles from "./UpdateTask.module.css";
import { useState, useEffect } from "react";
import { getTaskById, updateTask } from "../../api/internal"; 
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TextInput from "../../components/TextInput/TextInput";

function UpdateTask() {
    const navigate = useNavigate();
    const { id: taskId } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const author = useSelector((state) => state.user?._id);

    // 🔹 Fetch task details
    useEffect(() => {
        async function getTaskDetails() {
            const response = await getTaskById(taskId);
            if (response.status === 200) {
                setTitle(response.data.title);
                setDescription(response.data.description);
            }
        }
        getTaskDetails();
    }, []);

    // 🔹 Update Task
    // const updateHandler = async () => {
    //     const data = { author, title, description };
    //     const response = await updateTask(taskId, data);

    //     if (response.status === 200) {
    //         navigate("/");
    //     }
    // };

    const updateHandler = async () => {
        const data = { title, description };
        try {
          const response = await updateTask(taskId, data);
          if (!response || typeof response.status === "undefined") {
            console.error("No valid response received from updateTask", response);
            return;
          }
          if (response.status === 200) {
            navigate("/");
          } else {
            console.error("Task update failed:", response);
          }
        } catch (error) {
          console.error("Error updating task:", error);
        }
      };
      

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Edit Your Task</div>
            <TextInput
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "60%" }}
            />
            <textarea
                className={styles.content}
                placeholder="Your content"
                maxLength={400}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button className={styles.update} onClick={updateHandler}>Update</button>
        </div>
    );
}

export default UpdateTask;
