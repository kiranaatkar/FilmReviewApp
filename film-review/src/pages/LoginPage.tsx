import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilmService from "../services/FilmService";
import { TokenResponse } from "../types/AuthTypes";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { Link } from "react-router-dom";


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
      if (user) navigate("/home");
    }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res: TokenResponse | string = await FilmService.SignIn(username, password);

      if (typeof res !== "string") {
        login(res.token);
        navigate("/home");
      } else {
        setMessage(`❌ ${res}`);
      }
    } catch (error) {
      setMessage("❌ Error signing up. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Log In</h2>

        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
        </form>

        <p className="signup-redirect">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>


        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
