import React, { useState } from "react";
import MovieCard from "./components/MovieCard";

const App: React.FC = () => {
  const movie = { id: 1, title: "LEG", year: 2025, posterUrl: "/assets/lighthouse.png"};

  return (
    <div>
      <h1>Film Peak Reviews</h1>
      <MovieCard key={movie.id} movie={movie} />
    </div>
  );
};

export default App;
