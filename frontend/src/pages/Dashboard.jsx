import Navbar from "../components/Navbar";
import { useToast } from "../components/ToastContext";
import "../all.css";
import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom"

function Dashboard(){
    const [urls,setUrls]=useState([]);
    const [user,setUser]=useState(null);
    const {showToast}=useToast();
    const navigate=useNavigate();

    const totalUrls=user?.total_urls_created??0;
    const totalClicks=user?.total_clicks??0;
    const activeUrls=urls.filter((url)=>new Date(url.expires_at)>new Date()).length;
    const expiredUrls=totalUrls-activeUrls;

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
            navigate("/signin");
            return;
        }
        const getDashboardData=async()=>{
            try{
                const [userResp,urlResp]=await Promise.all([
                    fetch("http://localhost:8000/me",{
                        method:"GET",
                        headers:{
                            "Authorization":`Bearer ${token}`,
                        },
                    }),
                    fetch("http://localhost:8000/urls",{
                        method:"GET",
                        headers:{
                            "Authorization":`Bearer ${token}`,
                        },
                    })
                ]);
                const userdata=await userResp.json();
                const urldata=await urlResp.json();
                if(!userResp.ok){
                    throw new Error(userdata.detail || "Failed to load URLs");
                }
                if(!urlResp.ok){
                    throw new Error(urldata.detail || "Failed to load URLs");
                }
                setUrls(urldata);
                setUser(userdata);
            }
            catch(error){
                showToast(error.message,"error");
            }
        };
        getDashboardData();
    },[navigate,showToast]);

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