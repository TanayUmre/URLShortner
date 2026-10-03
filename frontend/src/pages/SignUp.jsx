import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import PasswordInput from "../components/PasswordInput";
import { useToast } from "../components/ToastContext";
import "../all.css";
import api from "../api";

function SignUp(){
    const [username,setUsername]=useState("");
    const [useremail,setUseremail]=useState("");
    const [userpassword,setUserpassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const {showToast}=useToast();

    const navigate=useNavigate();

    const handleSubmit= async (e)=>{
        e.preventDefault();
        if(userpassword.length<8){
            showToast("Password must be at least 8 characters long","error");
            return;
        }

        if(userpassword !== confirmPassword){
            showToast("Passwords do not match","error");
            return;
        }
        try{
            const resp=await api.post("/signup",{
                name:username,
                email:useremail,
                password:userpassword
            });
            const loginResp=await api.post("/login",{
                    email:useremail,
                    password:userpassword
            });
            const loginData=loginResp.data;
            localStorage.setItem("access_token",loginData.access_token);
            showToast("Account created successfully","success");
            navigate("/profile");
        }
        catch(error){
            showToast(error.response?.data?.detail||"Unable to connect to server","error");
        }
    };

    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="auth-section">
                <div className="auth-card">
                    <h2 className="auth-title">
                        Create Account
                    </h2>
                    <p className="auth-description">
                        Create an account to manage your shortened URLs
                    </p>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input id="username" type="text" placeholder="Enter your username" value={username} onChange={(e)=>setUsername(e.target.value)} required></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" placeholder="Enter your email" value={useremail} onChange={(e)=>setUseremail(e.target.value)} required></input>
                        </div>
                        <PasswordInput id="password" label="Password" placeholder="Enter your password" value={userpassword} onChange={(e)=>setUserpassword(e.target.value)} required/>
                        <PasswordInput id="confirm-password" label="Confirm Password" placeholder="Confirm your password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required/>
                        <button type="submit" className="auth-button">Create Account</button>
                    </form>
                    <p className="auth-footer">Already have an account?{''}<Link to="/signin">Sign In</Link></p>
                </div>
            </main>
        </div>
    );
}

export default SignUp;