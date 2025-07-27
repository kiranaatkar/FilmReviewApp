import React from "react";
import MainTitleWrapped from "../svgs/MainTitleWrapped";
import Triangle from "../svgs/Triangle";
import "../styles/Onboarding.css";
import { Link } from "react-router-dom";


const OnboardingPage: React.FC = () => {

  return (
    <div className="onboarding-page">
        <div className="icon">
            <Triangle />
            <MainTitleWrapped fill="white"/>
        </div>
        <div className="buttons-container">
            <Link to="/sign-up" className="sign-up-button">
                <button className="sign-up-button-text">Sign Up</button>
            </Link>
            <Link to="/login" className="login-button">
                <button className="login-button-text">Login</button>
            </Link>
        </div>
    </div>
  );
};

export default OnboardingPage;
