import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_INTERNAL_API_PATH || "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = async (data) => {
    try {
        return await api.post('/login', data);
    } catch (error) {
        return error.response;
    }
};

export const signup = async (data) => {
    try {
        return await api.post('/register', data);
    } catch (error) {
        return error.response;
    }
};

export const signout = async () => {
    try {
        return await api.post('/logout');
    } catch (error) {
        return error.response;
    }
};

export const getUserTasks = async (userId) => {
    try {
        return await api.get(`/tasks/${userId}`);
    } catch (error) {
        return error.response;
    }
};

export const submitTask = async (data) => {
    try {
        return await api.post('/task', data);
    } catch (error) {
        return error.response;
    }
};

export const getTaskById = async (id) => {
    try {
        return await api.get(`/task/${id}`);
    } catch (error) {
        return error.response;
    }
};

export const updateTask = async (id, data) => {
    try {
        return await api.put(`/task/${id}`, data);
    } catch (error) {
        return error.response;
    }
};

export const deleteTask = async (id) => {
    try {
        return await api.delete(`/task/${id}`);
    } catch (error) {
        return error.response;
    }
};

// Auto token refresh interceptor
api.interceptors.response.use(
    config => config,
    async (error) => {
        const originalReq = error.config;
        
        if ((error.response.status === 401 || error.response.status === 500) && originalReq && !originalReq._isRetry) {
            originalReq._isRetry = true;
            
            try {
                await axios.get(`${process.env.REACT_APP_INTERNAL_API_PATH}/refresh`, {
                    withCredentials: true
                });
                return api.request(originalReq);
            } catch (err) {
                return err.response;
            }
        }
    }
);