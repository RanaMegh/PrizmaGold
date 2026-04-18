import React from "react";
import { Link } from "react-router-dom";
import "../styles/WelcomePage.css";

const WelcomePage = () => {
  return (
    <div className="welcome-container">

      {/* Background */}
      <div className="background">
        <div className="overlay"></div>
      </div>

      {/* Card */}
      <div className="welcome-card">

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-box">
            <img src="/PrizmaGold.jpg" alt="Logo" />
          </div>
          <h1>PriZma Gold</h1>
        </div>

        {/* Title */}
        <div className="title-section">
          <h2>Welcome to Excellence</h2>
          <p>Refine your craft today</p>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <Link to="/login">
            <button className="btn primary">Sign In</button>
          </Link>

          <Link to="/signup">
            <button className="btn secondary">Create Account</button>
          </Link>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="line"></div>
          <p>Artisanal Luxury</p>
        </div>

      </div>
    </div>
  );
};

export default WelcomePage;