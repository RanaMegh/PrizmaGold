import "./styles/StudioPage.module.css";
import "./App.css";
import "./styles/styles.css";

import StudioPage from "./component/StudioPage";
import SideBar from "./component/SideBar";
import Market from "./component/Market";
import EditProfile from "./component/EditProfile";
// ✅ Nouveaux composants récupérés depuis le pull
import ProfileCard from "./component/ProfileCard";
import StatsSection from "./component/StatsSection";
// ✅ Ton composant Dashboard (page complète avec market data + trending)
import Dashboard from "./component/Dashboard";
// ✅ TrendingPage
import TrendingPage from "./component/TrendingPage";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── renderPage ───────────────────────────────────────────────────────────────
function renderPage(activeTab, setActiveTab) {
  switch (activeTab) {
    case "dashboard":
      // ✅ Vrai composant Dashboard avec prop onViewTrending
      return <Dashboard onViewTrending={() => setActiveTab("trending")} />;

    case "trending":
      // ✅ TrendingPage avec sidebar cachée + bouton retour
      return <TrendingPage onBack={() => setActiveTab("dashboard")} />;

    case "ai-studio":
      return <StudioPage />;

    case "market-intel":
      return <Market />;

    case "profile":
      return <Profile setActiveTab={setActiveTab} />;

    case "edit-profile":
      return (
        <EditProfile
          onCancel={() => setActiveTab("profile")}
          onSave={() => setActiveTab("profile")}
        />
      );

    default:
      return <Dashboard onViewTrending={() => setActiveTab("trending")} />;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // ✅ "dashboard" par défaut
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        background: "#f8f7f4",
      }}
    >
      {/* ✅ Sidebar cachée sur la page trending */}
      {activeTab !== "trending" && (
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ height: "100%", overflow: "auto" }}
          >
            {renderPage(activeTab, setActiveTab)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
