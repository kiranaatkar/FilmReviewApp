import React, { useState } from "react";
import MovieCard from "./components/MovieCard";

const App: React.FC = () => {
  const movie = { id: 1, title: "LEG", posterUrl: "/assets/lighthouse.png"};

  return (
    <div>
      <h1>Movie Ratings</h1>
      <div>
      <MovieCard key={movie.id} movie={movie} />
      </div>
    </div>
  );
};

export default App;
