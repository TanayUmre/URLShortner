import {useEffect} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {useToast} from "../components/ToastContext";
import Navbar from "../components/Navbar";
import api from "../api";
import "../all.css";

function ShortUrlRedirect(){
    const {shortcode}=useParams();
    const navigate=useNavigate();
    const {showToast}=useToast();

    useEffect(()=>{
        const resolveShortUrl=async()=>{
            try{
                const resp=await api.get(`/resolve/${shortcode}`);
                window.location.href=resp.data.url;
            }
            catch(error){
                showToast(error.response?.data?.detail||"This URL is either expired or it never existed","error");
                navigate("/");
            }
        };
        resolveShortUrl();
    },[shortcode,navigate,showToast]);
    
    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="auth-section">
                <p>Redirecting...</p>
            </main>
        </div>
    );
}

export default ShortUrlRedirect;