import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilmService from "../services/FilmService";
import { TokenResponse } from "../types/AuthTypes";
import { useAuth } from "../context/AuthContext";
import "../styles/SignUp.css";
import { Link } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!isValidEmail(email)) {
      setMessage("❌ Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res: TokenResponse | string =
        await FilmService.SignUp(username, email, password);

      if (typeof res !== "string") {
        login(res.token);
        navigate("/home");
      } else {
        setMessage(`${res}`);
      }
    } catch (error) {
      setMessage("Error signing up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-form">
        <h2>Create Account</h2>

        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="login-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
};

export default SignUpPage;