import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Point, Rating } from "../types/GraphTypes";
import { GRAPH_CONFIG } from "../config/GraphConfig";
import { Film } from "../types/FilmTypes";
import Graph from "../components/Graph";
import FilmService from "../services/FilmService";
import { useAuth } from "../context/AuthContext";

const FilmPage: React.FC = () => {
  const { titleParam } = useParams<{ titleParam: string }>();
  const [points, setPoints] = useState<Point[]>([]);
  const [average, setAverage] = useState<Point[]>([]);
  const [film, setFilm] = useState<Film>();
  const [error, setError] = useState<string | null>(null);
  const [showAvg, setShowAvg] = useState<boolean>(false);
  const { user } = useAuth();

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
          setError("Film leg.");
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

  const OnShowAverage = async () => {
    setShowAvg(!showAvg);
  };

  return (
    <div className="film-card">
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
            showAvg={showAvg}
            config={GRAPH_CONFIG}
          />
          <button onClick={OnSubmit}>Submit</button>
          <button onClick={OnShowAverage}>{showAvg ? "Hide Average" : "Show Average"}</button>
        </>
      ) : (
        <div>{error && <p className="error">{error}</p>}</div>
      )}
    </div>
  );
};

export default FilmPage;
