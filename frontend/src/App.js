import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import styles from "./App.module.css";
import Protected from "./components/Protected/Protected";
import Error from "./pages/Error/Error";
import Login from "./pages/Login/Login";
import { useSelector } from "react-redux";
import Signup from "./pages/Signup/Signup";
import Task from "./pages/Task/Task";
import SubmitTask from "./pages/SubmitTask/SubmitTask";
import TaskDetails from "./pages/TaskDetails/TaskDetails";
import UpdateTask from "./pages/UpdateTask/UpdateTask";
import useAutoLogin from "./hooks/useAutoLogin";
import Loader from "./components/Loader/Loader";

function App() {
  const isAuth = useSelector(state => state.user.auth);

  const loading = useAutoLogin();

  return loading ? <Loader text='...'/> : (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path="/"
              exact
              element={
                <div className={styles.main}>
                  <Home />
                </div>
              }
            />

            <Route
              path="task"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <Task />
                  </div>
                </Protected>
              }
            />

            <Route
              path="task/:id"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <TaskDetails />
                  </div>
                </Protected>
              }
            />

            <Route
              path="task-update/:id"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <UpdateTask />
                  </div>
                </Protected>
              }
            />

            <Route
              path="submit"
              exact
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <SubmitTask />
                  </div>
                </Protected>
              }
            />

            <Route
              path="signup"
              exact
              element={
                <div className={styles.main}>
                  <Signup />
                </div>}
            />

            <Route
              path="login"
              exact
              element={<div className={styles.main}>
                <Login />
              </div>}
            />

            <Route
              path="*"
              element={
                <div className={styles.main}>
                  <Error />
                </div>
              }
            />

          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
