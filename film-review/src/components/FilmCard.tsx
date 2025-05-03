import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FilmCard.css";
import { Film } from "../types/FilmTypes";
import StaticGraph from "./StaticGraph";
import { Point } from "../types/GraphTypes";
import FilmService from "../services/FilmService";
import { useAuth } from "../context/AuthContext";

type Props = {
  film: Film;
};

const FilmCard: React.FC<Props> = ({ film }) => {
  const [average, setAverage] = useState<Point[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!film || !user) return;
    const fetchFilmData = async () => {
      try {
        const filmData: Film = await FilmService.getFilm(film.title);

        const averageData: Point[] = await FilmService.getAverageRating(
          filmData.id
        );
        setAverage(averageData);
      } catch (err: any) {
        console.log(err.response);
      }
    };

    fetchFilmData();
  }, [film, user]);

  return (
    <Link className="film-card" to={`/film/${encodeURIComponent(film.title)}`}>
      {/* <div className="film-card-inner">
        <img
          className="film-poster"
          src={film.poster_url}
          alt={`${film.title} poster`}
        />
      </div>
      <div className="film-identifier">
        {film.title} ({film.year})
      </div> */}
      <StaticGraph
  posterUrl={film.poster_url}
  data={average} // or film.graphPoints if you prefer raw
/>

    </Link>
  );
};

export default FilmCard;
