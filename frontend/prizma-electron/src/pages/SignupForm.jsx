import React, { useState } from "react";
import { Eye, EyeOff, Mail, User ,Lock} from "lucide-react";
import { Link } from "react-router-dom";
import jewelryBg from "../../public/jewelry-bg.jpg";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
   <div className="fixed inset-0 min-h-screen w-full bg-linear-to-br from-[#06120b] via-[#0f2417] to-[#041008] flex items-center justify-center p-6 font-sans overflow-y-auto">
     <div 
             className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
             style={{ backgroundImage: `url(${jewelryBg})` }}
           ></div>
     
     
      {/* Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
         <div className="w-11 h-11 rounded-xl bg-[#d4af37]/20 overflow-hidden border border-[#d4af37]/30">
          <img 
              src="/PrizmaGold.jpg" 
              alt="Golden Atelier Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold text-white tracking-wide">
            PriZma Gold
          </h1>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-2">
            Start your luxury journey
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 opacity-70" />
              <input
                type="text"
                placeholder="First name"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              />
            </div>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 opacity-70" />
              <input
                type="text"
                placeholder="Last name"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 opacity-70" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-5 h-5 opacity-70" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-xs text-white">
            Password must contain at least 8 characters
          </p>

          {/* Submit */}
          <button className="w-full py-3 rounded-xl bg-linear-to-r from-[#e9b964] to-[#d4af37] text-black font-semibold hover:opacity-90 transition">
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-400 uppercase">
              or continue
            </span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition">
              Google
            </button>

            <button className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition">
              Apple
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-[#e9b964] cursor-pointer hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;