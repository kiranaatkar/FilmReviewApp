import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FilmCard.css";
import { Film } from "../types/FilmTypes";
import StaticGraph from "./StaticGraph";
import { Point } from "../types/GraphTypes";
import FilmService from "../services/FilmService";

type Props = {
  film: Film;
};

const DEBUG = true;

const FilmCard: React.FC<Props> = ({ film }) => {
  const [average, setAverage] = useState<Point[]>([]);

  const isNew = useMemo(() => {
    if (!film.createdAt) return false;
    const created = new Date(film.createdAt).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return created >= sevenDaysAgo;
  }, [film.createdAt]);

  useEffect(() => {
    let mounted = true;

    FilmService.getAverageRating(film.id)
      .then((avg) => {
        if (mounted) setAverage(avg);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [film.id]);

  // stable graph data reference
  const memoData = useMemo(() => average, [average]);

  return (
    <Link className="film-card" to={`/film/${encodeURIComponent(film.title)}`}>
      <StaticGraph posterUrl={film.posterUrl} data={memoData} />

      {isNew && <div className="new-badge">New</div>}

      {DEBUG && (
        <div className="debug-overlay">
          <div><strong>Title:</strong> {film.title}</div>
          <div><strong>Year:</strong> {film.year}</div>
          <div><strong>ID:</strong> {film.id}</div>
          <div><strong>Runtime:</strong> {film.runtime} min</div>
          {film.genres?.length ? (
            <div>
              <strong>Genres:</strong>{" "}
              {film.genres.map(g => g.name).join(", ")}
            </div>
          ) : null}
        </div>
      )}
    </Link>
  );
};

export default React.memo(FilmCard);