import axios from 'axios';

// Base axios instance
const api = axios.create({
    baseURL: 'https://decision-analyzer-log-backend.onrender.com/api/v1', //Backend url
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//User info fetch
export const fetchUsers = () => 
    api.get("/accounts/user");

export const fetchUsersById = (id) => 
    api.get(`/accounts/user/${id}`);

//User registration info post and login
export const UserLogin = (data) =>
    api.post("/accounts/user/login",data);

export const UserRegister = (data) => 
    api.post("/accounts/user/register",data);

//Admin login
export const adminLogin = (data) => 
    api.post("/accounts/admin/login",data);

export default api;