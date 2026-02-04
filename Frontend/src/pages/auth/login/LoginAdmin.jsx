import './../../../Style/Root.css';
import './../../../Style/Login.css';
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { adminLogin } from '../../../api/client';
import {useAuth} from "../../../hooks/useAuth";

const LoginAdmin = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try{
            const response = await adminLogin(credentials);
            login({...response.data, role: "admin"});
            navigate("/admin");
        } catch (err){
            setError(err.response?.data?.message || "Invalid email or password");
            setCredentials({email:"", password:""});
        }
    };
    return(
        <form className='login-admin-form' onSubmit={handleSubmit}>
            <fieldset>
                <legend>Admin Login</legend>
                {error && <p className='error'>{error}</p>}
                <span>
                    <label htmlFor="username-email">Username/Email</label>
                    <input type="text" id="username-email" name="email" value={credentials.email} onChange={handleChange} required/>  
                </span>
                <span>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required/>
                </span>
                <button type="submit">Login</button>
            </fieldset>
        </form>
    );
};

export default LoginAdmin;