import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilmService from "../services/FilmService";
import { TokenResponse } from "../types/AuthTypes";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      setIsSubmitting(true);

      const res: TokenResponse | string = await FilmService.SignIn(
        identifier,
        password
      );

      if (typeof res !== "string") {
        login(res.token);
        navigate("/home");
      } else {
        setMessage(`${res}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Error logging in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Log In</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="show-password">
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="signup-redirect">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;