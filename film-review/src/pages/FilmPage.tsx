import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Point, GraphConfig, Rating } from "../types/GraphTypes";
import { Film } from "../types/FilmTypes";
import Graph from "../components/Graph";
import FilmService from "../services/PeakReviewService";

const GRAPH_CONFIG: GraphConfig = {
  svgBoxWidth: 400,
  svgBoxHeight: 400,
  graphPadding: 20,
  pointPadding: 30,
  verticalGridPadding: 10,
  graphWidth: 400 - 20, // width - padding
  graphHeight: 400 - 20, // width - padding
  horizontalGridLines: 5,
  verticalGridLines: 2,
};

const FilmPage: React.FC = () => {
  const { titleParam } = useParams<{ titleParam: string }>();
  const [points, setPoints] = useState<Point[]>([]);
  const [average, setAverage] = useState<Point[]>([]);
  const [film, setFilm] = useState<Film>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!titleParam) return;
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
          1
        );
        setPoints(userRating.points);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchFilmData();
  }, [titleParam]);

  const OnSubmit = async () => {
    if (!film) return;

    try {
      const rating = {
        userId: 1,
        filmId: film.id,
        points: points,
      };
      await FilmService.postRating(rating);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const OnShowAverage = async () => {
    console.log(average);
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
            config={GRAPH_CONFIG}
          />
          <button onClick={OnSubmit}>Submit</button>
          <button onClick={OnShowAverage}>Show average</button>
        </>
      ) : (
        <div>{error && <p className="error">{error}</p>}</div>
      )}
    </div>
  );
};

export default FilmPage;
