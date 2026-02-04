import { useState } from "react";
import {adminRegister} from "../../../api/client";
import "../../../Style/Register.css";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
    const [formData, setFormData] = useState({
        email: "",
        // username: "",
        password: "",
        confirmPassword: "",
        role: "",
    });
    const [error, setError] = useState("");
    const [success, setSucceess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSucceess("");
        if(formData.password !== formData.confirmPassword){
            setError("Passwords do not match");
            return;
        }
        try{
            if(formData.role === "admin"){
                await adminRegister({
                    email: formData.email,
                    password: formData.password,
                });
            }
            setSucceess("Admin Registration Successful!");
            setTimeout(()=>navigate("/login"),1500);
        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed!");
            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
                role: ""
            });
        }
    };
    return(
        <form className="register-admin-form" onSubmit={handleSubmit}>
            <fieldset>
                <legend>Admin Register</legend>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <span>
                    <label htmlFor="reg-email">Enter your email</label>
                    <input type="email" id="reg-email" name="email" value={formData.email} onChange={handleChange} required/>
                </span>
                {/* <span>
                    <label for="reg-username">Username</label>
                    <input type="text" id="reg-username" name="reg-username" required/>
                </span> */}
                <span>
                    <label htmlFor="reg-pass">Password</label>
                    <input type="password" id="reg-pass" name="password" value={formData.password} onChange={handleChange} required/>
                </span>
                <span>
                    <label htmlFor="reg-confirm-pass">Confirm Password</label>
                    <input type="password" id="reg-confirm-pass" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
                </span>
                <span>
                    <label htmlFor="select-role">Your Role</label>
                    <select className="select-role" id="select-role" name="role" value={formData.role} onChange={handleChange}>
                        <option value={"admin"}>Admin</option>
                    </select>
                </span>
                <button type="submit">Register</button>
            </fieldset>
        </form>
    );
};

export default RegisterAdmin;