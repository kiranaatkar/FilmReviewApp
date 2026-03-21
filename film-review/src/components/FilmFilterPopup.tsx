import React, { useState, useEffect } from "react";
import "../styles/FilmFilterPopup.css";
import { Genre } from "../types/FilmTypes";
import { MultiSelect } from "./MultiSelect";
import { InlineSelect } from "./InlineSelect";
import {
  FILM_SORT_OPTIONS,
  DEFAULT_FILM_SORT,
  FilmSortOption,
} from "../config/FilmFilters";

interface FilmFilterPopupProps {
  onApply: (filters: {
    fromYear?: number;
    toYear?: number;
    selectedGenres: Genre[];
    sortBy: FilmSortOption;
  }) => void;
  genres: Genre[];
}

const FilmFilterPopup: React.FC<FilmFilterPopupProps> = ({
  onApply,
  genres,
}) => {
  const [fromYear, setFromYear] = useState<number | undefined>();
  const [toYear, setToYear] = useState<number | undefined>();
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [sortBy, setSortBy] = useState<FilmSortOption>(DEFAULT_FILM_SORT);

  useEffect(() => {
    onApply({ fromYear, toYear, selectedGenres, sortBy });
  }, [fromYear, toYear, selectedGenres, sortBy, onApply]);

  const handleReset = () => {
    setFromYear(undefined);
    setToYear(undefined);
    setSelectedGenres([]);
    setSortBy(DEFAULT_FILM_SORT);
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
            onChange={(e) =>
              setFromYear(e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <span className="range-sep">–</span>
          <input
            type="number"
            placeholder="To"
            value={toYear ?? ""}
            onChange={(e) =>
              setToYear(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Genre</label>
        <MultiSelect
          options={genres}
          value={selectedGenres}
          onChange={setSelectedGenres}
          getLabel={(g) => g.name}
          getKey={(g) => g.id}
          placeholder="All genres"
        />
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <InlineSelect
          value={sortBy}
          onChange={(value) => setSortBy(value as FilmSortOption)}
          options={FILM_SORT_OPTIONS}
        />
      </div>

      <div className="filter-actions">
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilmFilterPopup;