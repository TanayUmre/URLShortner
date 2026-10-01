import Navbar from "../components/Navbar";
import "../all.css";

function Profile() {
    return (
        <div className="shorten-main">
            <Navbar/>
            <main className="profile-section">
                <div className="profile-card">
                    <div className="profile-pic">
                        👤
                    </div>
                    <h2 className="profile-title">Your Profile</h2>
                    <div className="profile-info">
                        <div className="profile-field">
                            <span>Name</span>
                            <p>Test User</p>
                        </div>

                        <div className="profile-field">
                            <span>Email</span>
                            <p>test@gmail.com</p>
                        </div>
                    </div>
                    <button className="profile-button">
                        Change Password
                    </button>
                    <button className="logout-button">
                        Logout
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Profile;