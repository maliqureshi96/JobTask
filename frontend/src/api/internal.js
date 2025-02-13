import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_INTERNAL_API_PATH || "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = async (data) => {
    let response;
    try {
        response = await api.post('/login', data);
    } catch (error) {
        return error;
    }

    return response;
};

export const signup = async (data) =>{
    let response;

    try {
        response = await api.post('/register', data);
    } catch (error) {
        return error.response;
    }

    return response;
};

export const signout = async() =>{
    let response;

    try {
        response = await api.post('/logout');
    } catch (error) {
        return error;
    }
    return response;
};

export const getAllTasks = async () => {
    let response;

    try {
        response = await api.get('/task/all');
    } catch (error) {
        
    }
    return response;
}

export const submitTask = async (data) => {
    let response;

    try {
        response = await api.post('/task', data);
    } catch (error) {
        return error.response;
    }

    return response;
};

export const getTaskById = async(id) =>{
    let response;

    try {
        response = await api.get(`/task/${id}`);

    } catch (error) {
        return error;
    }

    return response;
};


export const deleteTask = async (id) =>{
    let response;

    try {
        response = await api.delete(`/task/${id}`);
    } catch (error) {
        return error;
    }
    return response;
};

export const updateTask = async(id, data) => {
    let response;

    try {
        response = await api.put(`/task/${id}`, data);
    } catch (error) {
        return error;
    }
    return response;
};

// auto token refresh

// protected-resource -> 401
// /refresh -> authenthicated state
// /protected-resource

api.interceptors.response.use(
    config => config,
    async (error) => {
        const originalReq = error.config;

        if((error.response.status === 401 || error.response.status === 500 ) && originalReq && !originalReq._isRetry){
            originalReq._isRetry = true;

            try {
                await axios.get(`${process.env.REACT_APP_INTERNAL_API_PATH}/refresh`, {
                    withCredentials:true
                });

                return api.request(originalReq)
            } catch (error) {
                return error;
            }
        }
    }
)