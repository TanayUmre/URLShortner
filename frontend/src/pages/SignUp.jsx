import {useState} from "react";
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar";
import "../all.css";

function SignUp(){
    const [username,setUsername]=useState("");
    const [useremail,setUseremail]=useState("");
    const [userpassword,setUserpassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [passwordError,setPasswordError]=useState("");

    const handleSubmit= async (e)=>{
        e.preventDefault();

        if(userpassword !== confirmPassword){
            setPasswordError("Passwords Doesn't Match");
            return;
        }
        setPasswordError("");
        try{
            const resp=await fetch("http://localhost:8000/signup",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name:username,
                    email:useremail,
                    password:userpassword
                }),
            });
            const data=await resp.json();
            if(!resp.ok){
                throw new Error(data.message || "Failed to create account");
            }
            console.log(data.message);
        }
        catch(error){
            console.error("Error:",error.message);
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
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" placeholder="Enter your password" value={userpassword} onChange={(e)=>setUserpassword(e.target.value)} required></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input id="confirm-password" type="text" placeholder="Confirm your password" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value);setPasswordError("");}} required></input>
                            {passwordError && (
                                <p className="password-error">{passwordError}</p>
                            )}
                        </div>
                        <button type="submit" className="auth-button">Create Account</button>
                    </form>
                    <p className="auth-footer">Already have an account?{''}<Link to="/signin">Sign In</Link></p>
                </div>
            </main>
        </div>
    );
}

export default SignUp;