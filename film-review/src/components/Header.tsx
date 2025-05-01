import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useAuth } from "../context/AuthContext";
import InstagramIcon from "../svgs/InstagramIcon";
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
      <div className="triangle-svg" />
      <div className="header-main-content">
        {user && (
          <Link to="/profile" className="profile-icon" title="View Profile">
            {getInitials(user.username || "U N")}
          </Link>
        )}
        <Link to="/home">
          <MainTitle />
        </Link>

        <a
          href="https://www.instagram.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-link"
        >
          <InstagramIcon size={36} />
        </a>
      </div>
    </header>
  );
};

export default Header;
