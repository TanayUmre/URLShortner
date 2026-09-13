import {useState} from 'react';
import './all.css';

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
        <div className="top-bar">
                <h1 className="shorten-heading">URL Shortener</h1>
                <button className="profile-icon">👤</button>
            </div>
        <form onSubmit={handleSubmit} className="shorten-form">
          <input className="urlinput" placeholder="Enter the url" value={inputUrl} onChange={handleChange}></input>
          <button className="shorten-button" type="submit">Shorten</button>
        </form>

        <div className="shortenedURLsection">
          <a href={shortenedUrl}>{shortenedUrl}</a>
        </div>
      </div>
    )
}

export default App;