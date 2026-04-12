import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
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

        {/* TITRE & SOUS-TITRE - Très proches l'un de l'autre */}
        <div className="text-center mb-14 gap-8">
          <h2 className="text-white text-[35px] font-bold italic leading-tight">
            Welcome to Excellence
          </h2>
          <p className="text-gray-400 text-[11px] tracking-[0.3em]  uppercase mt-2">
            Refine your craft today
          </p>
        </div>

        {/* BOUTONS - Bloc compact au centre */}
        <div className="w-full max-w-[80%] flex flex-col gap-8 mb-14">
          <Link to="/login" className="w-full">
            <button
              className="w-full rounded-[18px] text-black font-bold text-lg transition-all active:scale-[0.98]"
              style={{
                padding: "18px 0",
                background: "#e3bc54", // Couleur or unie comme sur la photo
              }}
            >
              Sign In
            </button>
          </Link>

          <Link to="/signup" className="w-full">
            <button
              className="w-full rounded-[18px] text-white font-medium text-lg transition-all border border-white/10"
              style={{
                padding: "18px 0",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            >
              Create Account
            </button>
          </Link>
        </div>

        {/* FOOTER - Rapproché du groupe central */}
        <div className="flex flex-col items-center opacity-40 gap-8">
          <div className="w-10 h-px bg-[#d4af37] mb-3" />
          <p className="text-[10px] text-gray-300 uppercase tracking-[0.5em]">
            Artisanal Luxury
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;