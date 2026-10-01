import {Link} from "react-router-dom";

function Navbar(){
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                URL Shortner
            </div>

            <Link to="/profile" className="profile-icon">
                👤
            </Link>
        </nav>
    );
}

export default Navbar;