import './../../../Style/Root.css';
import './../../../Style/Login.css';
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { supabase } from '../../../api/supabaseClient';
import { useAuth } from '../../../hooks/useAuth';

const Login = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });
            if (error) throw error;
            const accessToken = data?.session?.access_token;
            if (!accessToken) throw new Error("No session returned");
            localStorage.setItem("token", accessToken);
            // Store minimal user state expected by the app
            login({ token: accessToken, role: "User" });
            navigate("/user");
        } catch (err){
            setError(err.message || err.error_description || "Invalid email or password");
            setCredentials({ email: "", password: "" });
        }
    };

    return(
        <>
            <form className='login-form' onSubmit={handleSubmit}>
            <fieldset>
                <legend>User Login</legend>
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
        </>
    );
};

export default Login;