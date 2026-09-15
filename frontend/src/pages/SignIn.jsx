import {useState} from 'react';
import {Link} from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../all.css';

function SignIn(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Email:",email);
        console.log("Password:",password);
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
                            <label htmlfor="email">Email</label>
                            <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        </div>
                        <div className="form-group">
                            <label htmlfor="password">Password</label>
                            <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                        </div>
                        <button type="submit" className="auth-button">Sign In</button>
                    </form>
                    <p className="auth-footer">Don't have an account?{' '}<Link to="/signup">Sign Up</Link></p>
                </div>
            </main>
        </div>
    );
}

export default SignIn;