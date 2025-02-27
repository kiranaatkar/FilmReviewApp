import React from "react";
import { Link } from "react-router-dom";

const movies = [
  { id: 1, title: "LEG", year: 2025, posterUrl: "/assets/lighthouse.png" },
  { id: 2, title: "Matrix", year: 1999, posterUrl: "/assets/matrix.png" },
];

const Home: React.FC = () => {
  return (
    <div>
      <h1>Film Peak Reviews</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movie/${encodeURIComponent(movie.title)}`}>{movie.title} ({movie.year})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
