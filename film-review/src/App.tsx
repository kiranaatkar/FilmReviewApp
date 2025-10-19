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
import { Film } from "./types/FilmTypes";
import "./styles/App.css";
import OnboardingPage from "./pages/OnboardingPage";

const AppContent: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const films = await FilmService.getFilms();
        setFilms(films);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilms();
  }, []);

  const filteredFilms = films.filter(film =>
    film.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {showFooter && <Footer onSearch={setSearchQuery} />}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;