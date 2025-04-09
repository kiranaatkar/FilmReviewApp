import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FilmPage from "./pages/FilmPage";
import Header from "./components/Header";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  return (
    <Router basename="/FilmReviewApp/film-review">
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/film/:titleParam" element={<FilmPage />} />
      </Routes>
    </Router>
  );
};

export default App;
