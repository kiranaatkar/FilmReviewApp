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
          FilmService.getUserRating(filmData.id, 4), // temp hack
        ]);

        setFilmPeakRating(filmPeakRating.points);
        setAverageRating(avg);
        setUserRating(rating.points);
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
            posterUrl={film.poster_url}
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
            <p><strong>Runtime:</strong> placeholder</p>
            <p><strong>Genre:</strong> placeholder</p>
            <p><strong>Rating:</strong> placeholder</p>
            <p><strong>Key Actors:</strong> placeholder</p>
            <p><strong>Director:</strong> placeholder</p>
          </div>
        </>
      ) : (
        <div>{error && <p className="error">{error}</p>}</div>
      )}
    </div>
  );
};

export default FilmPage;
