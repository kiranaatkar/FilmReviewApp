import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Film, FilmPreview } from "../types/FilmTypes";
import FilmCard from "../components/FilmCard";
import { useAuth } from "../context/AuthContext";
import FilmService from "../services/FilmService";
import { useGraphFilterStore } from "../store/useGraphFilterStore";
import "../styles/Home.css";

interface HomeProps {
  films: Film[];
}

const Home: React.FC<HomeProps> = ({ films }) => {
  const { user } = useAuth();
  const [previews, setPreviews] = useState<Record<number, FilmPreview>>({});
  const [loadingPreviews, setLoadingPreviews] = useState(false);

  const filmPeak = useGraphFilterStore((s) => s.filmPeak);
  const audience = useGraphFilterStore((s) => s.audience);
  const you = useGraphFilterStore((s) => s.you);

  useEffect(() => {
    if (!user?.id || !films.length) return;

    let mounted = true;
    (async () => {
      try {
        setLoadingPreviews(true);
        const filmIds = films.map((f) => f.id);
        const previewList = await FilmService.getFilmPreviews(user.id, filmIds);
        if (!mounted) return;

        const previewMap = Object.fromEntries(previewList.map((p) => [p.filmId, p]));
        setPreviews(previewMap);
      } catch (error) {
        console.error("Failed to load previews:", error);
        if (mounted) setPreviews({});
      } finally {
        if (mounted) setLoadingPreviews(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.id, films]);

  const filmCards = useMemo(() => {
    return films.map((film) => (
      <FilmCard
        key={film.id}
        film={film}
        preview={previews[film.id]}
        showAudience={audience}
        showYou={you}
        showFilmPeak={filmPeak}
      />
    ));
  }, [films, previews, audience, you, filmPeak]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="home">
      {loadingPreviews && <p>Loading graph previews…</p>}
      <div className="film-cards">{filmCards}</div>
    </div>
  );
};

export default React.memo(Home);