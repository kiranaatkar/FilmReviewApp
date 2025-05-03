import React from "react";
import "../styles/Footer.css";

const Footer: React.FC = () => {

  const PopupGraphFiler = () => {
    // Function to handle the graph filter popup
    console.log("Graph filter popup opened");
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Function to handle search input
    const query = event.target.value;
    console.log("Search query:", query);
  };

  const handleFilmFilter = () => {
    // Function to handle film filter
    console.log("Film filter clicked");
  };
  return (
    <footer className="footer">
      <div className="footer-content">
        <button className="graph-filter" onClick={PopupGraphFiler}>
          <div className="triangle red" />
          <div className="triangle green" />
          <div className="triangle blue" />
        </button>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            className="footer-search"
            onChange={handleSearch}
          />
        </div>

        <button className="film-filter" title="Filter" onClick={handleFilmFilter}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 6h18v2H3V6zm4 5h10v2H7v-2zm2 5h6v2H9v-2z" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
