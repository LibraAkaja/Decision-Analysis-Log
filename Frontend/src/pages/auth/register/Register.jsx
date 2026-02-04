import { useState } from "react";
import {customerRegister, providerRegister} from "../../../api/client";
import "../../../Style/Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        gender: "",
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
            const role = formData.role.toLowerCase();
            if(role === "provider"){
                await providerRegister({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    gender: formData.gender
                });
            }
            if(role === "customer"){
                await customerRegister({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    gender: formData.gender
                });
            }
            setSucceess(`${formData.role} Registration Successful!`);
            setTimeout(()=> navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Registration Failed!");
            setFormData({
                email: "",
                first_name: "",
                last_name: "",
                gender: "",
                password: "",
                confirmPassword: "",
                role: ""
            });
        }
    };
    return(
        <form className="register-form" onSubmit={handleSubmit}>
            <fieldset>
                <legend>Register</legend>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <span>
                    <label htmlFor="reg-email">Enter your email</label>
                    <input type="email" id="reg-email" name="email" value={formData.email} onChange={handleChange} required/>
                </span>
                <span>
                    <span>
                        <label htmlFor="reg-fname">First Name</label>
                        <input type="text" id="reg-fname" name="first_name" value={formData.first_name} onChange={handleChange} required/>
                    </span>
                    <span>
                        <label htmlFor="reg-lname">Last Name</label>
                        <input type="text" id="reg-lname" name="last_name" value={formData.last_name} onChange={handleChange} required/>
                    </span>
                </span>
                <span>
                    <label>Gender</label>
                    <select className="select-gender" name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value={""} disabled hidden>Choose your gender</option>
                        <option value={"Female"}>Female</option>
                        <option value={"Male"}>Male</option>
                        <option value={"Others"}>Others</option>
                    </select>
                </span>
                <span>
                    <label htmlFor="select-role">Your Role</label>
                    <select className="select-role" id="select-role" name="role" value={formData.role} onChange={handleChange} required>
                        <option value={""} disabled hidden>Choose an option</option>
                        <option value={"Customer"}>Customer</option>
                        <option value={"Provider"}>Provider</option>
                    </select>
                </span>
                <span>
                    <label htmlFor="reg-pass">Password</label>
                    <input type="password" id="reg-pass" name="password" value={formData.password} onChange={handleChange} required/>
                </span>
                <span>
                    <label htmlFor="reg-confirm-pass">Confirm Password</label>
                    <input type="password" id="reg-confirm-pass" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
                </span>
                <button type="submit">Register</button>
            </fieldset>
        </form>
    );
};

export default Register;