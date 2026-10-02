import Navbar from "../components/Navbar";
import "../all.css";
import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

function Profile() {
    const[user,setUser]=useState(null);
    const[error,setError]=useState("");
    const navigate=useNavigate();
    
    const handleLogout=()=>{
        localStorage.removeItem("access_token");
        navigate("/signin");
    }

    useEffect(()=>{
        const token=localStorage.getItem("access_token");
        if(!token){
            setError("You are not logged in. Please log in to view your profile.");
            return
        }
        const getprofile=async()=>{
            try{
                const response=await fetch("http://localhost:8000/me",{
                    method:"GET",
                    headers:{
                        "Authorization":`Bearer ${token}`,
                    },
                });
                const data=await response.json();
                if(!response.ok){
                    throw new Error(data.detail||"Failed to load profile");
                }
                setUser(data);
            }
            catch(error){
                setError(error.message);
            }
        };
        getprofile();
    },[]);

    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="profile-section">
                <div className="profile-card">
                    <div className="profile-pic">
                        👤
                    </div>
                    <h2 className="profile-title">Your Profile</h2>
                    {error?(
                        <p className="password-error">{error}</p>
                    ):user?(
                        <div className="profile-info">
                            <div className="profile-field">
                                <span>Name</span>
                                <p>{user.name}</p>
                            </div>
                            <div className="profile-field">
                                <span>Email</span>
                                <p>{user.email}</p>
                            </div>
                        </div>
                    ):(
                        <p>Loading...</p>
                    )}
                    <button className="profile-button" onClick={()=>navigate("/dashboard")}>
                        Dashboard
                    </button>
                    <button className="profile-button">
                        Change Password
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Profile;