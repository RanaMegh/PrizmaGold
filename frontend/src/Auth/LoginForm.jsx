import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

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

    // Replace with real auth logic
    onLogin();
    navigate("/app");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center font-sans overflow-hidden">
      {/* Background avec Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/jewelry-bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Card - Centrée verticalement */}
      <div
        className="relative z-10 w-full max-w-115 rounded-[45px] px-8 py-14 shadow-2xl flex flex-col items-center justify-center gap-8"
        style={{
          background: "rgba(15, 15, 15, 0.5)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          minHeight: "620px",
        }}
      >
        {/* LOGO SECTION - Positionnée en haut du groupe central */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-[#0a1a0a]">
            <img
              src="/PrizmaGold.jpg"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            PriZma Gold
          </h1>
        </div>
        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl font-bold italic">Welcome Back</h2>
          <p className="text-gray-400 text-[11px] tracking-[0.2em] uppercase mt-2 opacity-70">
            Sign in to continue
          </p>
        </div>

        {/* Form Container */}
        <form className="w-full space-y-4 px-2 text-center" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-400 text-xs text-center mb-2">{error}</p>
          )}

          {/* Email */}
          <div className="relative group max-w-[80%] ">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative group max-w-[80%] ">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-4 h-4 opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end pr-1">
            <span className="text-xs text-[#e3bc54] cursor-pointer hover:underline opacity-80 hover:opacity-100 transition-opacity">
              Forgot password?
            </span>
          </div>

          {/* Sign In button - Matched WelcomePage style */}
          <button
            type="submit"
            className="w-full rounded-xl max-w-[80%]  text-black font-bold text-lg transition-all active:scale-[0.98] mt-2 shadow-lg shadow-black/20"
            style={{
              padding: "16px 0",
              background: "#e3bc54",
            }}
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-gray-400 text-xs mt-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#e3bc54] hover:underline font-bold">
            Sign up
          </Link>
        </p>

        {/* Decorative Divider */}
        <div className="mt-8 flex flex-col items-center opacity-30">
          <div className="w-8 h-px bg-[#d4af37] mb-2" />
          <p className="text-[9px] text-gray-300 uppercase tracking-[0.5em]">
            Artisanal Luxury
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;