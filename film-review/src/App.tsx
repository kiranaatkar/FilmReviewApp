import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import FilmPage from "./pages/FilmPage";
import Header from "./components/Header";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import FilmService from "./services/FilmService";
import { Film, Genre } from "./types/FilmTypes";
import "./styles/App.css";
import OnboardingPage from "./pages/OnboardingPage";

const AppContent: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const [filters, setFilters] = useState<{
    fromYear?: number;
    toYear?: number;
    selectedGenres: Genre[];
    sortBy?: string;
  }>({ selectedGenres: [] });

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const films = await FilmService.getFilms();
        setFilms(films);
        const uniqueGenres = Array.from(
          new Map(
            films
              .flatMap(film => film.genres)
              .map(genre => [genre.id, genre])
          ).values()
        );
        setGenres(uniqueGenres);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilms();
  }, []);

  const filteredFilms = films
  .filter((film) =>
    film.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter((film) => {
    // Year filter
    if (filters.fromYear && film.year < filters.fromYear) return false;
    if (filters.toYear && film.year > filters.toYear) return false;

    // Genre filter
    if (filters.selectedGenres && filters.selectedGenres.length > 0) {
      const filmGenreIds = film.genres.map((g) => g.id);
      const selectedIds = filters.selectedGenres.map((g) => g.id);
      if (!selectedIds.some((id) => filmGenreIds.includes(id))) return false;
    }

    return true;
  })
  .sort((a, b) => {
    switch (filters.sortBy) {
      case "oldest":
        return a.year - b.year;
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      case "latest":
      default:
        return b.year - a.year;
    }
  });

  // Only show footer on /home and /film/* routes
  const showFooter =
    location.pathname.startsWith("/home") ||
    location.pathname.startsWith("/film");

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/home" element={<Home films={filteredFilms} />} />
          <Route path="/film/:titleParam" element={<FilmPage />} />
        </Routes>
      </main>
      {showFooter && <Footer onSearch={setSearchQuery} genres={genres} onApplyFilters={setFilters}/>}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;