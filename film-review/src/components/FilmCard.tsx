import React from "react";
import { Link } from "react-router-dom";
import "../styles/FilmCard.css"
import { Film } from "../types/FilmTypes";

type Props = {
    film: Film
}

const FilmCard: React.FC<Props> = ({ film }) => {
  
  return (
    <div className="film-card">
      <Link to={`/film/${encodeURIComponent(film.title)}`}>
        <img className="film-poster" src={film.poster_url} alt={`${film.title} poster`}/>
        <div className="film-identifier">
          {film.title} ({film.year})
        </div>
      </Link>
    </div>
  );
};

export default FilmCard;
