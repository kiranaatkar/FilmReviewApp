import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Point, Rating } from "../types/GraphTypes";
import { Film } from "../types/FilmTypes";
import Graph from "../components/Graph";
import FilmService from "../services/FilmService";
import { useAuth } from "../context/AuthContext";
import { useGraphFilterStore } from "../store/useGraphFilterStore";
import "../styles/FilmPage.css";

const FilmPage: React.FC = () => {
  const { titleParam } = useParams<{ titleParam: string }>();
  const [points, setUserRating] = useState<Point[]>([]);
  const [average, setAverageRating] = useState<Point[]>([]);
  const [filmPeakPoints, setFilmPeakRating] = useState<Point[]>([]);
  const [film, setFilm] = useState<Film>();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { filmPeak, audience, you } = useGraphFilterStore();

  // Fetch film + ratings
  useEffect(() => {
    if (!titleParam || !user) return;

    (async () => {
      try {
        const filmData = await FilmService.getFilm(titleParam);
        setFilm(filmData);

        const [avg, rating, filmPeakRating] = await Promise.all([
          FilmService.getAverageRating(filmData.id),
          FilmService.getUserRating(filmData.id, user.id),
          FilmService.getUserRating(filmData.id, 1), // temp hack for film peak (userId 1 is admin)
        ]);

        // create clones to avoid mutating state
        setFilmPeakRating(filmPeakRating.points.map(p => ({ ...p })));
        setAverageRating(avg.map(p => ({ ...p })));
        setUserRating(rating.points.map(p => ({ ...p })));
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch film data");
      }
    })();
  }, [titleParam, user]);

  // Memoize the arrays so they don’t break Graph’s dependency list
  const memoizedFilmPeakPoints = useMemo(() => filmPeakPoints, [filmPeakPoints]);
  const memoizedAverage = useMemo(() => average, [average]);
  const memoizedPoints = useMemo(() => points, [points]);

  const OnSubmit = async () => {
    if (!film || !user) return;
    const rating: Rating = { userId: user.id, filmId: film.id, points };

    try {
      await FilmService.postRating(rating);
      setAverageRating(await FilmService.getAverageRating(film.id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const OnEdit = () => console.log("Edit review clicked");

  return (
    <div className="film-page">
      {film && points.length > 0 ? (
        <>
          <h2>
            <span className="film-title">{film.title}</span>{" "}
            <span className="film-year">({film.year})</span>
          </h2>

          <Graph
            key={film.id}
            posterUrl={film.posterUrl}
            filmPeakPoints={memoizedFilmPeakPoints}
            data={memoizedPoints}
            audienceData={memoizedAverage}
            showFilmPeak={filmPeak}
            showAudience={audience}
            showYou={you}
          />

          <div className="review-control-buttons">
            <button className="edit-button" onClick={OnEdit}>
              Edit Review
            </button>
            <button className="submit-button" onClick={OnSubmit}>
              Submit Review
            </button>
          </div>

          <div className="film-information">
            <p><strong>Runtime:</strong> {film.runtime} min</p>

            <p>
              <strong>Genres:</strong>{" "}
              {film.genres?.length
                ? film.genres.map(g => g.name).join(", ")
                : "No genres listed"}
            </p>

            <p>
              <strong>Director:</strong>{" "}
              {film.directors?.length
                ? film.directors.map(d => d.name).join(", ")
                : "Unknown"}
            </p>

            <p>
              <strong>Key Actors:</strong>{" "}
              {film.actors?.length
                ? film.actors.map(a => a.name).join(", ")
                : "No actors listed"}
            </p>
          </div>

        </>
      ) : (
        <div>{error && <p className="error">{error}</p>}</div>
      )}
    </div>
  );
};

export default FilmPage;
