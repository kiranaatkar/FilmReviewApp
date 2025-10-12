import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Point, Rating } from "../types/GraphTypes";
import { Film } from "../types/FilmTypes";
import Graph from "../components/Graph";
import FilmService from "../services/FilmService";
import { useAuth } from "../context/AuthContext";
import { useGraphFilterStore } from "../store/useGraphFilterStore";

const FilmPage: React.FC = () => {
  const { titleParam } = useParams<{ titleParam: string }>();
  const [points, setPoints] = useState<Point[]>([]);
  const [average, setAverage] = useState<Point[]>([]);
  const [film, setFilm] = useState<Film>();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { audience, you } = useGraphFilterStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!titleParam || !user) return;
    const fetchFilmData = async () => {
      try {
        const filmData: Film = await FilmService.getFilm(titleParam);
        setFilm(filmData);

        const averageData: Point[] = await FilmService.getAverageRating(
          filmData.id
        );
        setAverage(averageData);
        const userRating: Rating = await FilmService.getUserRating(
          filmData.id,
          user.id
        );

        setPoints(userRating.points);
      } catch (err: any) {
        console.log(err.response);
        if (err.response === 404) {
          setError("Film not found.");
        }
        setError(err.message);
      }
    };

    fetchFilmData();
  }, [titleParam, user]);

  const OnSubmit = async () => {
    if (!film || !user) return;

    try {
      const rating: Rating = {
        userId: user.id,
        filmId: film.id,
        points: points,
      };
      await FilmService.postRating(rating);
      const averageData: Point[] = await FilmService.getAverageRating(film.id);
      setAverage(averageData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const redirectHome = () => {
    navigate("/home");
  };

  return (
    <div className="film-page">
      <button onClick={redirectHome}>
        Back
      </button>
      {film && points.length > 0 ? (
        <>
          <h2>
            <span className="film-title">{film.title}</span>{" "}
            <span className="film-year">({film.year})</span>
          </h2>
          <Graph
            posterUrl={film.poster_url}
            data={points}
            avgData={average}
            showAvg={audience}
            showUserPoints={you}
          />
          <button onClick={OnSubmit}>Submit</button>
        </>
      ) : (
        <div>{error && <p className="error">{error}</p>}</div>
      )}
    </div>
  );
};

export default FilmPage;
