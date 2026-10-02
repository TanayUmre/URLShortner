import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import PasswordInput from "../components/PasswordInput";
import { useToast } from "../components/ToastContext";
import "../all.css"

function ChangePassword(){
    const [currentPassword,setCurrentPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const {showToast}=useToast();
    const navigate=useNavigate();
    
    useEffect(()=>{
        const token=localStorage.getItem("access_token");
        if(!token){
            showToast("Please log in to change your password","error");
            navigate("/signin");
        }
    },[navigate]);

    const handleSubmit=async (e)=>{
        e.preventDefault();
        if(newPassword.length<8){
            showToast("New password must be at least 8 characters long","error");
            return;
        }
        if(newPassword===currentPassword){
            showToast("New password must be different from your current password","error");
            return;
        }
        if(newPassword!==confirmPassword){
            showToast("New password and Confirm password does not match","error");
            return;
        };
        const token=localStorage.getItem("access_token");
        try{
            const resp=await fetch("http://localhost:8000/change-password",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({
                    current_password:currentPassword,
                    new_password:newPassword
                }),
            });
            const data=await resp.json();
            if(!resp.ok){
                showToast(data.detail||"Fail to change password","error");
                return;
            }
            showToast("Password changed successfully","success");
            navigate("/profile");
        }
        catch(error){
            showToast("Unable to connect to server","error");
        }
    };

    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="auth-section">
                <div className="auth-card">
                    <h2 className="auth-title">
                        Change Password
                    </h2>
                    <p className="auth-subtitle">
                        Update your account password
                    </p>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <PasswordInput id="current-password" label="Current Password" placeholder="Enter your current password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>
                        <PasswordInput id="new-password" label="New Password" placeholder="Enter your new password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                        <PasswordInput id="confirm-password" label="Confirm Password" placeholder="Confirm your new password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                        <button type="submit" className="auth-button">Change Password</button>
                    </form>
                    <button className="profile-button" onClick={()=>navigate("/profile")}>Back to profile</button>
                </div>
            </main>
        </div>
    );
}

export default ChangePassword;