import {useState} from 'react';
import './all.css';
import Navbar from './components/Navbar';

function App(){
    const [inputUrl, setInputUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("Your shortened URL will appear here");

    const handleChange = (e)=> {
        setInputUrl(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/shorten',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({url:inputUrl}),
            });

            if (!response.ok){
                throw new Error('Network response was not ok');
            }

            const data=await response.json();
            setShortenedUrl(data.url);

        } 
        catch(error){
            console.error('Error:',error);
        }
    }

    return (
      <div className="shorten-main">
        <Navbar/>
        <main className="shorten-mained">
            <h2 className="shorten-heading">Shorten your URLs</h2>
            <p className="shorten-subheading">Fast. Simple. Easy to Share.</p>
            <form onSubmit={handleSubmit} className="shorten-form">
                <input className="urlinput" type="url" placeholder="Paste your url here..." value={inputUrl} onChange={handleChange} required></input>
                <button className="shorten-button" type="submit">Shorten URL</button>
            </form>
            <div className="shortened-url-section">
                <p>Your shortened URL</p>
                <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
            </div>
            <p className="expiry-text">Link Expires after 30 days</p>
        </main>
      </div>
    )
}

export default App;