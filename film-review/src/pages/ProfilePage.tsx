import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear auth state
    navigate("/login"); // Redirect to login page
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>

        <div className="profile-info">
          <p><strong>Username:</strong> {user.username}</p>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
