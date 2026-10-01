import {useNavigate} from "react-router-dom";

function Navbar(){
    const navigate=useNavigate();

    const handleProfileClick=()=>{
        const token=localStorage.getItem("access_token");
        if(token){
            navigate("/profile");
        }
        else{
            navigate("/login");
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                URL Shortner
            </div>

            <button className="profile-icon" onClick={handleProfileClick}>
                👤
            </button>
        </nav>
    );
}

export default Navbar;