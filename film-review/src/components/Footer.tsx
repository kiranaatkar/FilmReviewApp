import React, { useState } from "react";
import GraphFilterPopup from "./GraphFilterPopup";
import FilmFilterPopup from "./FilmFilterPopup";
import "../styles/Footer.css";

interface FooterProps {
  onSearch: (query: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onSearch }) => {
  const [isGraphFilterOpen, setIsGraphFilterOpen] = useState(false);
  const [isFilmFilterOpen, setIsFilmFilterOpen] = useState(false);

  const PopupFiler = (type: string) => {
    if (type === "Graph") {
      return () => {
        setIsFilmFilterOpen(false);
        setIsGraphFilterOpen((prev) => !prev);
      };
    }
    return () => {
      setIsGraphFilterOpen(false);
      setIsFilmFilterOpen((prev) => !prev);
    };
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <footer
      className={`footer ${
        isGraphFilterOpen ? "graph-filter-popup-open" : 
        isFilmFilterOpen ? "film-filter-popup-open" :""
      }`}
    >
      <div className="footer-content">
        {/* Popups */}
        <div className="filter-popup">
          {isGraphFilterOpen && (
            <GraphFilterPopup
              onApply={(filters) => console.log("Filters applied:", filters)}
            />
          )}
          {isFilmFilterOpen && (
            <FilmFilterPopup
              onApply={(filters) => console.log("Filters applied:", filters)}
              onReset={() => console.log("Filters reset")}
            />
          )}
        </div>

        {/* Footer controls */}
        <div className="footer-filters">
          <button className="graph-filter" onClick={PopupFiler("Graph")}>
            <div className="triangle red" />
            <div className="triangle blue" />
            <div className="triangle green" />
          </button>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="footer-search"
              onChange={handleSearch}
            />
          </div>

          <button className="film-filter" title="Filter" onClick={PopupFiler("Film")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45"
              height="35"
              viewBox="0 0 45 35"
              fill="none"
            >
              <path d="M22.5 28L3.01443 7L41.9856 7L22.5 28Z" fill="white" />
              <rect x="19" y="15" width="7" height="20" fill="white" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
