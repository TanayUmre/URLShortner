import Navbar from "../components/Navbar";
import { useToast } from "../components/ToastContext";
import "../all.css";
import {useEffect,useState} from "react";

function Dashboard(){
    const [urls,setUrls]=useState([]);
    const {showToast}=useToast();

    const totalUrls=urls.length;
    const totalClicks=urls.reduce((total,url)=>total+url.clicked_count,0);
    const activeUrls=urls.filter((url)=>new Date(url.expires_at)>new Date()).length;
    const expiredUrls=urls.filter((url)=>new Date(url.expires_at)<=new Date()).length;

    const handleDelete=async (urlID)=>{
        const token=localStorage.getItem("access_token");
        try{
            const resp=await fetch(`http://localhost:8000/urls/${urlID}`,
                {
                    method:"DELETE",
                    headers:{
                        "Authorization":`Bearer ${token}`,
                    },
                }
            );
            const data=await resp.json();
            if(!resp.ok)
            {
                throw new Error(data.detail || "Failed to delete URL");
            }
            setUrls((currentUrls)=>currentUrls.filter((url)=>url.id!==urlID));
            showToast("URL deleted successfully","success");
        }
        catch(error){
            showToast(error.message,"error");
        }
    }

    useEffect(()=>{
        const token=localStorage.getItem("access_token");
        if(!token){
            showToast("You must be logged in to view the dashboard","error");
            return;
        }
        const getUrls=async()=>{
            try{
                const resp=await fetch("http://localhost:8000/urls",{
                    method:"GET",
                    headers:{
                        "Authorization":`Bearer ${token}`,
                    },
                });
                const data=await resp.json();
                if(!resp.ok){
                    throw new Error(data.detail || "Failed to load URLs");
                }
                setUrls(data);
            }
            catch(error){
                setToast({
                    message:error.message,
                    type:"error"
                });
            }
        };
        getUrls();
    },[]);

    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="dashboard-section">
                <div className="dashboard-container">
                    <h1 className="dashboard-title">
                        Your Dashboard
                    </h1>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span>Total URLs</span>
                            <p>{totalUrls}</p>
                        </div>
                        <div className="stat-card">
                            <span>Active</span>
                            <p>{activeUrls}</p>
                        </div>
                        <div className="stat-card">
                            <span>Expired</span>
                            <p>{expiredUrls}</p>
                        </div>
                        <div className="stat-card">
                            <span>Total Clicks</span>
                            <p>{totalClicks}</p>
                        </div>
                    </div>
                    {urls.length===0?(
                        <p>No shortened URLs found</p>
                        ):(
                        <div className="url-list">
                            {urls.map((item)=>(
                                <div className="url-card" key={item.id}>
                                    <div className="url-info">
                                        <span>Original URL</span>
                                        <p>{item.url}</p>
                                    </div>
                                    <div className="url-info">
                                        <span>Short URL</span>
                                        <a href={`http://localhost:8000/${item.shortened_url}`} target="_blank" rel="noopener noreferrer">
                                            {item.shortened_url}
                                        </a>
                                    </div>
                                    <div className="url-info">
                                        <span>Created At</span>
                                        <p>{new Date(item.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="url-info">
                                        <span>Expires At</span>
                                        <p>{new Date(item.expires_at).toLocaleString()}</p>
                                    </div>
                                    <div className="url-info">
                                        <span>Status</span>
                                        <p>
                                            {new Date(item.expires_at)>new Date()?"Active":"Expired"}
                                        </p>
                                    </div>
                                    <div className="url-info">
                                        <span>Click</span>
                                        <p>{item.clicked_count}</p>
                                    </div>
                                    <button className="delete-button" onClick={()=>handleDelete(item.id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;