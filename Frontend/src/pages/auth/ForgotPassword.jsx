import { useState } from "react";

const ForgotPassword = () => {
    const [method, setMethod] = useState("");
    return(
        <section className="forgot-password-section" style={{minWidth:'250px', border:'2px solid red', display:'flex', justifyContent:'space-evenly',alignItems:'center', flexDirection:'column', margin:'5vh', padding:'25px', color:'white'}}>
            <h2>Forgot Password?</h2>
            <form style={{display:'flex', flexDirection:'column'}}>
                <span>
                    <label>Select recovery method: </label>
                    <select  name="recovery-method" onChange={(e) => setMethod(e.target.value)} value={method}>
                        <option value={""} disabled hidden>Choose an Option</option>
                        <option value={"email"}>Mail OTP to Recovery Email</option>
                        <option value={"phone"}>Send OTP to your Phone Number</option>
                    </select>
                </span>
                <span >
                    <label htmlFor="emergency-contact">Enter your {method == "email"? "recovery email address": "recovery phone number"}</label>
                    <input type={method.includes("phone")?"tel":"email"} id="emergency-contact" name={method.includes("phone")?"phone":"email"} required/>
                </span>
            </form>
            <button>Ok</button>
            {/* Logic for OTP */}
        </section>
    );
};

export default ForgotPassword;