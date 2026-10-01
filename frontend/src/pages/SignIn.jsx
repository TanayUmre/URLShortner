import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../all.css';

function SignIn(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const navigate=useNavigate();

    const handleSubmit= async (e)=>{
        e.preventDefault();
        try{
            const resp=await fetch("http://localhost:8000/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    email:email,
                    password:password,
                }),
            });
            const data=await resp.json();
            if(!resp.ok){
                throw new Error(data.detail || "Login failed"); 
            }
            localStorage.setItem("access_token",data.access_token);
            navigate("/profile");
            console.log(data.message)
        }
        catch(error){
            console.error("Login Error:",error);
        }
    };

    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="auth-section">
                <div className="auth-card">
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-description">Sign in to manage your shortened URLs</p>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                        </div>
                        <button type="submit" className="auth-button">Sign In</button>
                    </form>
                    <p className="auth-footer">{' '}<Link>Forgot Password?</Link></p>
                    <p className="auth-footer">Don't have an account?{' '}<Link to="/signup">Sign Up</Link></p>
                </div>
            </main>
        </div>
    );
}

export default SignIn;