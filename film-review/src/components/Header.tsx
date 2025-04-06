import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/FilmReviewApp/film-review/login");
  };

  return (
    <header>
      <Link to="/FilmReviewApp/film-review/home">
        <h1>Film Peak Reviews</h1>
      </Link>
      {user && (
        <button onClick={() => handleLogout()}>
          <Link to="/FilmReviewApp/film-review/Login">Log Out</Link>
        </button>
      )}
      {!user && (
        <div>
          <button>
            <Link to="/FilmReviewApp/film-review/SignUp">Sign Up</Link>
          </button>
          <button>
            <Link to="/FilmReviewApp/film-review/Login">Login</Link>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
