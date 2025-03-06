import React, { useEffect, useState }  from "react";
import { useParams } from "react-router-dom";
import { Point, GraphConfig } from "../types/GraphTypes"
import { Film } from "../types/FilmTypes";
import Graph from "../components/Graph";
import FilmService from "../services/PeakReviewService";


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

const FilmPage: React.FC = () => {
  const { titleParam } = useParams<{ titleParam: string }>();
  const [data, setData] = useState<Point[]>([]);
  const [film, setFilm] = useState<Film>();
  const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchFilm = async (title: string) => {
            try {
              const film = await FilmService.getFilm(title);
              setFilm(film);
            } catch (err: any) {
              setError(err.message);
            }
          };
        if (titleParam) {
            fetchFilm(titleParam);
            setData([
                { x: GRAPH_CONFIG.graphPadding, y: 257 },
                { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth / 8, y: 295 },
                { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth / 4, y: 152 },
                { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth / 2, y: 200 },
                { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth - (GRAPH_CONFIG.graphWidth / 4), y: 95 },
                { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth - (GRAPH_CONFIG.graphWidth / 8), y: 266 },
                { x: GRAPH_CONFIG.graphPadding + GRAPH_CONFIG.graphWidth, y: 152 },
              ])
        }
    }, [titleParam]);

    const OnSubmit = async () => {
      if (!film) return;

      try {
        const rating = {
          userId: 1,
          filmId: film.id,
          points: data
        }
        await FilmService.postRating(rating);
      } catch (err: any) {
        setError(err.message);
      }
    }
    

    return (
        <div className="film-card">
          {error && <p className="error">{error}</p>}
          {film && (
            <>
                <h2>
                <span className="film-title">{film.title}</span>{" "}
                <span className="film-year">({film.year})</span>
                </h2>
                <Graph posterUrl={film.poster_url} data={data} config={GRAPH_CONFIG} />
                <button onClick={OnSubmit}>Submit</button>
            </>
            )}
        </div>
      );
};

export default FilmPage;
