import Navbar from "../components/Navbar";
import { useToast } from "../components/ToastContext";
import "../all.css";
import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

function Profile() {
    const[user,setUser]=useState(null);
    const {showToast}=useToast();
    const navigate=useNavigate();
    
    const handleLogout=()=>{
        localStorage.removeItem("access_token");
        showToast("Logged out successfully","success");
        navigate("/signin");
    }

    useEffect(()=>{
        const token=localStorage.getItem("access_token");
        if(!token){
            showToast("You are not logged in. Please log in to view your profile.","error");
            navigate("/signin");
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
                    showToast(data.detail||"Failed to load profile","error");
                    if(response.status===401){
                        localStorage.removeItem("access_token");
                        navigate("/signin");
                    }
                    return;
                }
                setUser(data);
            }
            catch(error){
                showToast("Unable to connect to server","error");
            }
        };
        getprofile();
    },[showToast,navigate]);

    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="profile-section">
                <div className="profile-card">
                    <div className="profile-pic">
                        👤
                    </div>
                    <h2 className="profile-title">Your Profile</h2>
                    {user?(
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
                    <button className="profile-button" onClick={()=>navigate("/change-password")}>
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