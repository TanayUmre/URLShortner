import {useState} from 'react';
import Navbar from '../components/Navbar';
import { useToast } from '../components/ToastContext';
import "../all.css";
import {useNavigate} from "react-router-dom"

function Home(){

    const [inputUrl, setInputUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [customAlias,setCustomAlias]=useState("");
    const [useCustomAlias,setUseCustomAlias]=useState(false);
    const {showToast}=useToast();
    const navigate=useNavigate();

    const handleChange = (e)=> {
        setInputUrl(e.target.value);
    }

    const handleAliasChange = (e)=> {
        setCustomAlias(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token=localStorage.getItem("access_token");
        if(!token){
            showToast("Please log in to shorten URLs.","error");
            navigate("/signin");
            return;
        }
        if(useCustomAlias){
            if(customAlias.length<3||customAlias.length>20){
                showToast("Custom alias must be between 3 and 20 characters","error");
                return;
            }
            const aliaspat=/^[a-zA-Z0-9_-]+$/;
            if(!aliaspat.test(customAlias)){
                showToast("Custom alias can only contain letters, numbers, '_' and '-'","error");
                return;
            }
        }
        try {
            const response = await fetch('http://localhost:8000/shorten',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`,
                },
                body:JSON.stringify({url:inputUrl,custom_alias:useCustomAlias?customAlias:null}),
            });

            const data=await response.json();

            if (!response.ok){
                showToast(data.detail||"Failed to shorten URL","error");
                return;
            }

            setShortenedUrl(data.url);
            showToast(data.message,"success");
        } 
        catch(error){
            showToast("Unable to connect to server","error");
        }
    };

    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="shortened-main">
                <h2 className="shorten-heading">Shorten your URLs</h2>
                <p className="shorten-subheading">Fast. Simple. Easy to Share.</p>
                <form onSubmit={handleSubmit} className="shorten-form">
                    <input className="urlinput" type="url" placeholder="Paste your url here..." value={inputUrl} onChange={handleChange} required></input>
                    <label className="alias-toggle">
                        <input type="checkbox" checked={useCustomAlias} onChange={(e)=>{
                            setUseCustomAlias(e.target.checked);
                            if(!e.target.checked){
                                setCustomAlias("");
                            }
                        }}/>
                        <span>Use custom alias</span>
                    </label>
                    {useCustomAlias && (
                        <input className="urlinput" type="text" placeholder="Enter your custom alias..." value={customAlias} onChange={(e)=>setCustomAlias(e.target.value)} maxLength={20}/>
                    )}
                    <button className="shorten-button" type="submit">Shorten URL</button>
                </form>
                {shortenedUrl && (
                    <div className="shortened-url-section">
                        <p>Your shortened URL</p>
                        <a href={`http://localhost:8000/${shortenedUrl}`} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
                    </div>
                )}
                <p className="expiry-text">Link Expires after 30 days</p>
            </main>
        </div>
    );
}

export default Home;