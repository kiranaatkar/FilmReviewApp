import React, { useState, useEffect } from "react";
import { Film } from "../types/FilmTypes";
import FilmService from "../services/PeakReviewService";
import FilmCard from "../components/FilmCard";
import "../styles/Home.css"

const Home: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFilms = async () => {
          try {
            const films = await FilmService.getFilms();
            setFilms(films);
          } catch (err: any) {
            console.error(err);
            setError(err.message);
          }
        };
        fetchFilms();
      }, []);
  return (
    <div className="film-cards">
      {error && <p className="error">{error}</p>}
        {films.map((film) => (
            <FilmCard key={film.id} film={film}/>
        ))}
    </div>
  );
};

export default Home;
