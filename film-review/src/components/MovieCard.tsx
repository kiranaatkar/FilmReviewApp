import React from "react";
import Graph from "./Graph";

type Movie = {
  id: number;
  title: string;
  posterUrl: string;
};

type Props = {
  movie: Movie;
};

const MovieCard: React.FC<Props> = ({ movie }) => {

  return (
    <div>
      <h2>{movie.title}</h2>
      <div style={{ width: "80%", margin: "auto" }}>
        <Graph posterUrl={movie.posterUrl}/>
      </div>
    </div>
  );
};

export default MovieCard;
