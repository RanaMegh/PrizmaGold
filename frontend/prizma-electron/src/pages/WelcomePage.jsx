import React from "react";
import { Link } from "react-router-dom";
import jewelryBg from "../../public/jewelry-bg.jpg";

const WelcomePage = () => {
  return (
    <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center p-6 font-sans overflow-hidden">
      
      {/* Conteneur de l'image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${jewelryBg})` }}
      >
        {/* Overlay sombre pour le luxe et la lisibilité */}
        <div className="absolute inset-0 bg-black/60 bg-linear-to-b from-black/20 via-transparent to-black/80" />
      </div>
      {/* Card - Même style que Signup */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col items-center">
        
        {/* Logo - Exactement comme votre Signup */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-14 h-14 rounded-xl bg-[#d4af37]/20 overflow-hidden border border-[#d4af37]/30">
            <img 
              src="/PrizmaGold.jpg" 
              alt="Golden Atelier Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            PriZma Gold
          </h1>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white italic">Welcome to Excellence</h2>
          <p className="text-gray-400 text-sm mt-3 tracking-wide uppercase">
            Refine your craft today
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <Link to="/login" className="block w-full">
            <button className="w-full py-4 rounded-xl bg-linear-to-r from-[#e9b964] to-[#d4af37] text-black font-bold text-lg hover:opacity-90 transition shadow-lg shadow-[#d4af37]/10 active:scale-[0.98]">
              Sign In
            </button>
          </Link>

          <Link to="/signup" className="block w-full">
            <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition active:scale-[0.98]">
              Create Account
            </button>
          </Link>
        </div>

        {/* Decorative Footer */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="w-12 h-px bg-[#d4af37]/30"></div>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em]">
            Artisanal Luxury
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;