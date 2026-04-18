import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignupForm.css";

const SignupForm = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ SINGLE handleSubmit (correct)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // ✅ Redirect after success
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="signup-container">

      <div className="background">
        <div className="overlay"></div>
      </div>

      <div className="signup-card">

        <div className="logo-section">
          <div className="logo-box">
            <img src="/PrizmaGold.jpg" alt="Logo" />
          </div>
          <h1>PriZma Gold</h1>
        </div>

        <div className="title-section">
          <h2>Create Account</h2>
          <p>Start your luxury journey</p>
        </div>

        {error && <p className="error">{error}</p>}

        <form className="form" onSubmit={handleSubmit}>

          <div className="name-row">
            <div className="input-group">
              <User className="icon left" />
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <User className="icon left" />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <Mail className="icon left" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="password-info">
            Password must contain at least 8 characters
          </p>

          <button type="submit" className="signup-btn">
            Create Account
          </button>

          <div className="divider">
            <div></div>
            <span>or continue</span>
            <div></div>
          </div>

          <div className="social-row">
            <button type="button">Google</button>
            <button type="button">Apple</button>
          </div>

        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default SignupForm;