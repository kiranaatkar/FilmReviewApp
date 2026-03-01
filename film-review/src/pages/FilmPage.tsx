import React, { useEffect, useState } from "react";
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
  const { user } = useAuth();

  const filmPeak = useGraphFilterStore(s => s.filmPeak);
  const audience = useGraphFilterStore(s => s.audience);
  const you = useGraphFilterStore(s => s.you);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [film, setFilm] = useState<Film>();
  const [points, setUserRating] = useState<Point[]>([]);
  const [average, setAverageRating] = useState<Point[]>([]);
  const [filmPeakPoints, setFilmPeakRating] = useState<Point[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch film + ratings
  useEffect(() => {
    if (!titleParam || !user?.id) return;

    (async () => {
      try {
        setLoading(true);

        const filmData = await FilmService.getFilm(titleParam);
        setFilm(filmData);

        const [avg, rating, peak] = await Promise.all([
          FilmService.getAverageRating(filmData.id),
          FilmService.getUserRating(filmData.id, user.id),
          FilmService.getUserRating(filmData.id, 1), // TODO replace
        ]);

        setFilmPeakRating(peak.points);
        setAverageRating(avg);
        setUserRating(rating.points);
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch film data");
      } finally {
        setLoading(false);
      }
    })();
  }, [titleParam, user?.id]);

  const handleSubmit = async () => {
    if (!film || !user) return;

    setIsSaving(true);
    const rating: Rating = { userId: user.id, filmId: film.id, points };

    try {
      await FilmService.postRating(rating);
      const avg = await FilmService.getAverageRating(film.id);
      setAverageRating(avg);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  if (loading) return <p>Loading film…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!film) return null;

  return (
    <div className="film-page">
      <h2>
        <span className="film-title">{film.title}</span>{" "}
        <span className="film-year">({film.year})</span>
      </h2>

      <Graph
        posterUrl={film.posterUrl}
        filmPeakPoints={filmPeakPoints}
        data={points}
        audienceData={average}
        showFilmPeak={filmPeak}
        showAudience={audience}
        showYou={you}
        onUserChange={setUserRating}
      />

      <div className="review-control-buttons">
        <button className="edit-button">Edit Review</button>

        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Submit Review"}
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

      {showToast && <div className="toast">Review saved</div>}
    </div>
  );
};

export default FilmPage;