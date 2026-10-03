import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import PasswordInput from '../components/PasswordInput';
import { useToast } from '../components/ToastContext';
import '../all.css';
import api from '../api';

function SignIn(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const {showToast}=useToast();

    const navigate=useNavigate();

    const handleSubmit= async (e)=>{
        e.preventDefault();
        try{
            const resp=await api.post("/login",{
                email:email,
                password:password,
            });
            const data=resp.data;
            localStorage.setItem("access_token",data.access_token);
            showToast("Login Successful","success");
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
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-description">Sign in to manage your shortened URLs</p>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        </div>
                        <PasswordInput id="password" label="Password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
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