import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "../types/FilmTypes";
import FilmCard from "../components/FilmCard";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

interface HomeProps {
  films: Film[];
}

const Home: React.FC<HomeProps> = ({ films }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="home">
      <div className="film-cards">
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
