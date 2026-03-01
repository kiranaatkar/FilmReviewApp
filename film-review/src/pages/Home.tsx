import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Film } from "../types/FilmTypes";
import FilmCard from "../components/FilmCard";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

interface HomeProps {
  films: Film[];
}

const Home: React.FC<HomeProps> = ({ films }) => {
  const { user } = useAuth();

  const filmCards = useMemo(() => {
    if (!films.length) {
      return <p className="error">No films found.</p>;
    }
    return films.map((film) => <FilmCard key={film.id} film={film} />);
  }, [films]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="home">
      <div className="film-cards">{filmCards}</div>
    </div>
  );
};

export default React.memo(Home);