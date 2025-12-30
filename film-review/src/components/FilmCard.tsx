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
  const [isNew, setIsNew] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!film || !user) return;
    console.log({film})
    const fetchFilmData = async () => {
      try {
        const filmData: Film = await FilmService.getFilm(film.title);

        const averageData: Point[] = await FilmService.getAverageRating(
          filmData.id
        );
        setAverage(averageData);
        setIsNew(isWithinLast7Days(filmData.createdAt));
      } catch (err: any) {
        console.log(err.response);
      }
    };

    fetchFilmData();
  }, [film, user]);

  const isWithinLast7Days = (isoString: string): boolean => {
    console.log(isoString)
    const date = new Date(isoString);
    console.log({film, date})
    const now = new Date();
    const sevenDaysAgo = new Date(now);      
    sevenDaysAgo.setDate(now.getDate() - 7);

    return date >= sevenDaysAgo && date <= now;
  };

  return (
    <Link className="film-card" to={`/film/${encodeURIComponent(film.title)}`}>
      <StaticGraph
        posterUrl={film.posterUrl}
        data={average} // or film.graphPoints if you prefer raw
      />

      {isNew && <div className="new-badge">New</div>}

    </Link>
  );
};

export default FilmCard;
