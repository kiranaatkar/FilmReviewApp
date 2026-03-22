import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Film, FilmPreview } from "../types/FilmTypes";
import StaticGraph from "./StaticGraph";
import "../styles/FilmCard.css";

type Props = {
  film: Film;
  preview?: FilmPreview;
  showAudience: boolean;
  showYou: boolean;
  showFilmPeak: boolean;
};

const FilmCard: React.FC<Props> = ({ film, preview, showAudience, showYou, showFilmPeak }) => {
  const isNew = useMemo(() => {
    if (!film.createdAt) return false;
    const created = new Date(film.createdAt).getTime();
    return created >= Date.now() - 7 * 24 * 60 * 60 * 1000;
  }, [film.createdAt]);

  return (
    <Link className="film-card" to={`/film/${encodeURIComponent(film.title)}`}>
      <StaticGraph
        posterUrl={film.posterUrl}
        averageData={preview?.average ?? []}
        userData={preview?.userRating ?? []}
        filmPeakData={preview?.filmPeak ?? []}
        showAudience={showAudience}
        showYou={showYou}
        showFilmPeak={showFilmPeak}
      />

      {isNew && <div className="new-badge">New</div>}
    </Link>
  );
};

export default React.memo(FilmCard);