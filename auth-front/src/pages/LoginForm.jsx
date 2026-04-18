import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import "../styles/LoginForm.css";

const LoginForm = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    // Save user (simple auth)
    localStorage.setItem("user", JSON.stringify(data.user));

    onLogin();
    navigate("/app");

  } catch (err) {
    setError("Server error");
  }
};
  };

  return (
    <div className="login-container">
      
      {/* Background */}
      <div className="background">
        <div className="overlay"></div>
      </div>

      {/* Card */}
      <div className="login-card">

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-box">
            <img src="/PrizmaGold.jpg" alt="Logo" />
          </div>
          <h1>PriZma Gold</h1>
        </div>

        {/* Title */}
        <div className="title-section">
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>
        </div>

        {/* Form */}
        <form className="form" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}

          {/* Email */}
          <div className="input-group">
            <Mail className="icon left" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <Lock className="icon left" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot */}
          <div className="forgot">
            <span>Forgot password?</span>
          </div>

          {/* Button */}
          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="footer-text">
          Don't have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>

        {/* Divider */}
        <div className="divider">
          <div></div>
          <p>Artisanal Luxury</p>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;