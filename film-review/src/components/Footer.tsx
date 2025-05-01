import React from "react";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="graph-filter">
          <div className="triangle red" />
          <div className="triangle green" />
          <div className="triangle blue" />
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            className="footer-search"
          />
        </div>

        <div className="film-filter" title="Filter">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 6h18v2H3V6zm4 5h10v2H7v-2zm2 5h6v2H9v-2z" />
          </svg>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
