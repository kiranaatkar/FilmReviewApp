import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <Link to="/">
        <h1>Film Peak Reviews</h1>
      </Link>
      {user && (
        <button onClick={() => handleLogout()}>
          <Link to="/Login">Log Out</Link>
        </button>
      )}
      {!user && (
        <div>
          <button>
            <Link to="/SignUp">Sign Up</Link>
          </button>
          <button>
            <Link to="/Login">Login</Link>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
