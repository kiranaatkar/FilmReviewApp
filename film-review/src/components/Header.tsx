import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useAuth } from "../context/AuthContext";
import InstagramIcon from "../svgs/InstagramIcon";
import AnonymousUserIcon from "../svgs/AnonymousUserIcon";
import MainTitle from "../svgs/MainTitle";

const Header: React.FC = () => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header>
      <div className="header-content">
        <div className="triangle-svg" />
        <div className="header-links">
            {user ? (
            <Link to="/profile" className="profile-icon" title="View Profile">
              {getInitials(user.username || "U N")}
            </Link>
            ) : (
            <Link to="/onboarding" className="profile-icon" title="Sign Up / Login">
              <AnonymousUserIcon size={32} color="#848484" />
            </Link>
            )}
          <Link to="/home">
            <MainTitle />
          </Link>

          <a
            href="https://www.instagram.com/film_peak_reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
          >
            <InstagramIcon size={36} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
