import React, { useState } from "react";
import "../styles/FilmFilterPopup.css";

interface FilmFilterPopupProps {
  onApply: (filters: { fromYear?: number; toYear?: number; genre?: string; sortBy?: string }) => void;
  onReset?: () => void;
}

const FilmFilterPopup: React.FC<FilmFilterPopupProps> = ({ onApply, onReset }) => {
  const [fromYear, setFromYear] = useState<number | undefined>();
  const [toYear, setToYear] = useState<number | undefined>();
  const [genre, setGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("latest");

  const handleApply = () => {
    onApply({ fromYear, toYear, genre, sortBy });
  };

  const handleReset = () => {
    setFromYear(undefined);
    setToYear(undefined);
    setGenre("");
    setSortBy("latest");
    onReset?.();
  };

  return (
    <div className="film-filter-popup">
      <div className="filter-group">
        <label>Year Range</label>
        <div className="year-range">
          <input
            type="number"
            placeholder="From"
            value={fromYear ?? ""}
            onChange={(e) => setFromYear(e.target.value ? Number(e.target.value) : undefined)}
          />
          <span className="range-sep">–</span>
          <input
            type="number"
            placeholder="To"
            value={toYear ?? ""}
            onChange={(e) => setToYear(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Genre</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Thriller">Thriller</option>
          <option value="Romance">Romance</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="titleAsc">Title (A–Z)</option>
          <option value="titleDesc">Title (Z–A)</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="reset-btn" onClick={handleReset}>Reset</button>
        <button className="apply-btn" onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default FilmFilterPopup;
