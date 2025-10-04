import React from "react";
import { Film } from "../types/FilmTypes";
import FilmCard from "../components/FilmCard";
import "../styles/Home.css";

interface HomeProps {
  films: Film[];
}

const Home: React.FC<HomeProps> = ({ films }) => {
  return (
    <div className="home">
      <div className="film-cards">
        {films.length === 0 ? (
          <p className="error">No films found.</p>
        ) : (
          films.map((film) => <FilmCard key={film.id} film={film} />)
        )}
        {films.length === 0 ? (
          <p className="error">No films found.</p>
        ) : (
          films.map((film) => <FilmCard key={film.id} film={film} />)
        )}
        {films.length === 0 ? (
          <p className="error">No films found.</p>
        ) : (
          films.map((film) => <FilmCard key={film.id} film={film} />)
        )}
      </div>
    </div>
  );
};


export default Home;
