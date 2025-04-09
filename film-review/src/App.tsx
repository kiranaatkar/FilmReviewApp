import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FilmPage from "./pages/FilmPage";
import Header from "./components/Header";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/FilmReviewApp/film-review/" element={<LoginPage />} />
        <Route path="/FilmReviewApp/film-review/signUp" element={<SignUpPage />} />
        <Route path="/FilmReviewApp/film-review/login" element={<LoginPage />} />
        <Route path="/FilmReviewApp/film-review/home" element={<Home />} />
        <Route path="/FilmReviewApp/film-review/film/:titleParam" element={<FilmPage />} />
      </Routes>
    </Router>
  );
};

export default App;
