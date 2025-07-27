import React from "react";
import "../styles/Footer.css";

interface FooterProps {
  onSearch: (query: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onSearch }) => {

  const PopupGraphFiler = () => {
    // Function to handle the graph filter popup
    console.log("Graph filter popup opened");
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
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
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="35" viewBox="0 0 45 35" fill="none">
          <path d="M22.5 28L3.01443 7L41.9856 7L22.5 28Z" fill="white"/>
          <rect x="19" y="15" width="7" height="20" fill="white"/>
        </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
