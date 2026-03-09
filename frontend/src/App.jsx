import "./styles/StudioPage.module.css";
import "./App.css";
import StudioPage from "./component/StudioPage";
import SideBar from "./component/SideBar";
import Market from "./component/Market";
import EditProfile from "./component/EditProfile";
import ProfileCard from "./component/ProfileCard";
import StatsSection from "./component/StatsSection";
import "./styles/styles.css";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: "40px 36px" }}
    >
      <h1
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 32,
          color: "#1a1a1a",
          marginBottom: 8,
        }}
      >
        Dashboard
      </h1>
      <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
        Welcome back, Alexandra. Your portfolio overview will appear here.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginTop: 32,
        }}
      >
        {[
          { label: "Portfolio Value", value: "$124,850", change: "+3.2%", positive: true },
          { label: "Gold Holdings", value: "58.4 oz", change: "+1.8%", positive: true },
          { label: "Silver Holdings", value: "1,240 oz", change: "-0.4%", positive: false },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(212,160,23,0.15)" }}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.05)",
              cursor: "default",
            }}
          >
            <div style={{ fontSize: 11, color: "#999", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111", fontFamily: "'DM Sans', sans-serif" }}>
              {card.value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, color: card.positive ? "#22c55e" : "#ef4444" }}>
              {card.positive ? "▲" : "▼"} {card.change}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function Profile({ setActiveTab }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: "40px 36px" }}
    >
      <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 32, color: "#1a1a1a", marginBottom: 32 }}>
        Profile
      </h1>
      <ProfileCard onEditClick={() => setActiveTab("edit-profile")} />
      <StatsSection />
    </motion.div>
  );
}

// ─── renderPage : fonction pure, pas d'objet avec JSX ────────────────────────
function renderPage(activeTab, setActiveTab) {
  switch (activeTab) {
    case "dashboard":
      return <Dashboard />;
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
      return <Dashboard />;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("market-intel");

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
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

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