import './../../../Style/Root.css';
import './../../../Style/Login.css';
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { customerLogin, providerLogin } from '../../../api/client';
import { useAuth } from '../../../hooks/useAuth';

const Login = () => {
    const { login } = useAuth();
    // const [def, setDefault] = useState(1);  // 1 is for customers
    // const [login, setLogin] = useState(customerLogin);
    const [role, setRole] = useState("customer");
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
            const loginApi = (role === "customer" ? customerLogin : providerLogin);
            const response = await loginApi(credentials);
            login({...response.data, role});
            navigate(role === "customer" ? "/customer" : "/provider");
        } catch (err){
            setError(err.response?.data?.message || "Invalid email or password");
            setCredentials({ email: "", password: "" });
        }
    };
    return(
        <>
            <section className='login-as'>
                <div className="login-as-op" onClick={()=>setRole("customer")} style={{background:`${role==="customer" ? 'rgba(135, 206, 235, 0.75)': 'none'}`}}>Customer Login</div>
                <div className="login-as-op" onClick={()=>setRole("provider")} style={{background:`${role==="provider" ? 'rgba(135, 206, 235, 0.75)': 'none'}`}}>Provider Login</div>
            </section>
            <form className='login-form' onSubmit={handleSubmit}>
            <fieldset>
                <legend>{role==="customer"? "Customer": "Provider"} Login</legend>
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