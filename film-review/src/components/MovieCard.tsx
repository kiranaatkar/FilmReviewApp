import React, { useState } from "react";
import Graph from "./Graph";
import { Point, GraphConfig } from "../types/GraphTypes"
import "../styles/MovieCard.css"
import { Movie } from "../types/MovieTypes";



type Props = {
  movie: Movie;
};

const GRAPH_CONFIG: GraphConfig = {
  svgBoxWidth: 400,
  svgBoxHeight: 400,
  graphPadding: 20,
  pointPadding: 30,
  verticalGridPadding: 10,
  graphWidth: 400 - 20, // width - padding
  graphHeight: 400 - 20, // width - padding
  horizontalGridLines: 5,
  verticalGridLines: 2
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  const [data, setData] = useState<Point[]>([
      { x: GRAPH_CONFIG.graphPadding, y: 257 },
      { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth / 8, y: 295 },
      { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth / 4, y: 152 },
      { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth / 2, y: 200 },
      { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth - (GRAPH_CONFIG.graphWidth / 4), y: 95 },
      { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth - (GRAPH_CONFIG.graphWidth / 8), y: 266 },
      { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth, y: 152 },
    ]);

  const OnSubmit = () => {
    console.log(data)
  }

  return (
    <div className="movie-card">
      <h2>
        <span className="movie-title">{movie.title}</span>{" "}
        <span className="movie-year">({movie.year})</span>
      </h2>
        <Graph posterUrl={movie.posterUrl} data={data} config={GRAPH_CONFIG}/>
        <button onClick={OnSubmit}>Submit</button>
    </div>
  );
};

export default MovieCard;
