import React, { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


const SignupForm = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [error, setError]               = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Replace with real signup API call
    onLogin();
    navigate("/app");
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center p-6 font-sans overflow-y-auto">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url('/jewelry-bg.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl px-12 py-12 shadow-2xl">

        {/* Logo — large green square */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#1a3a22] overflow-hidden border border-[#d4af37]/30 shadow-lg">
            <img
              src="/PrizmaGold.jpg"
              alt="PrizmaGold Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            PriZma Gold
          </h1>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-2">Start your luxury journey</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 opacity-60" />
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-11 pr-3 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 opacity-60" />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-11 pr-3 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 opacity-60" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 opacity-60" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Password must contain at least 8 characters
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#e9b964] to-[#c8961f] text-black font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#d4af37]/20"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-400 uppercase tracking-widest">or continue</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white text-sm transition"
            >
              Google
            </button>
            <button
              type="button"
              className="py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white text-sm transition"
            >
              Apple
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-300 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-[#e9b964] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;