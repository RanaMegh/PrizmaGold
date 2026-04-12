import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ── Styles ────────────────────────────────────────────────────────────────────
import "./styles/StudioPage.module.css";
import "./App.css";
import "./styles/styles.css";

// ── Auth pages ────────────────────────────────────────────────────────────────
import WelcomePage from "./Auth/WelcomePage";
import LoginForm   from "./Auth/LoginForm";
import SignupForm  from "./Auth/SignupForm";

// ── Main app components ───────────────────────────────────────────────────────
import SideBar    from "./components/SideBar";
import StudioPage from "./components/StudioPage";
import Market     from "./components/Market";
import EditProfile from "./components/EditProfile";
import ProfileCard from "./components/ProfileCard";
import StatsSection from "./components/StatsSection";
import Dashboard  from "./components/Dashboard";
import TrendingPage from "./components/TrendingPage";

// ══════════════════════════════════════════════════════════════════════════════
// Profile page
// ══════════════════════════════════════════════════════════════════════════════
function Profile({ setActiveTab }) {
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
          marginBottom: 32,
        }}
      >
        Profile
      </h1>
      <ProfileCard onEditClick={() => setActiveTab("edit-profile")} />
      <StatsSection />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Page renderer — tab-based navigation inside the main app
// ══════════════════════════════════════════════════════════════════════════════
function renderPage(activeTab, setActiveTab, darkMode, setDarkMode) {
  switch (activeTab) {
    case "dashboard":
      return (
        <Dashboard
          onViewTrending={() => setActiveTab("trending")}
          onViewAIStudio={() => setActiveTab("ai-studio")}
          onViewMarketIntel={() => setActiveTab("market-intel")}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />
      );
    case "trending":
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
      return (
        <Dashboard
          onViewTrending={() => setActiveTab("trending")}
          onViewAIStudio={() => setActiveTab("ai-studio")}
          onViewMarketIntel={() => setActiveTab("market-intel")}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />
      );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// MainApp — the full dashboard shell (shown after login)
// ══════════════════════════════════════════════════════════════════════════════
function MainApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode]   = useState(false);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        background: darkMode ? "#121212" : "#f8f7f4",
        color: darkMode ? "#ffffff" : "inherit",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {activeTab !== "trending" && (
        <SideBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
        />
      )}

      <main
        className={darkMode ? "dark-mode" : ""}
        style={{ flex: 1, overflow: "hidden", position: "relative" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ height: "100%", overflow: "auto" }}
          >
            {renderPage(activeTab, setActiveTab, darkMode, setDarkMode)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ProtectedRoute — redirects to "/" if user is not authenticated
// ══════════════════════════════════════════════════════════════════════════════
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

// ══════════════════════════════════════════════════════════════════════════════
// App — root with router + auth state
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // isLoggedIn persists across page refreshes via localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("prizmagold_auth") === "true"
  );

  function handleLogin() {
    localStorage.setItem("prizmagold_auth", "true");
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("prizmagold_auth");
    setIsLoggedIn(false);
  }

  return (
    <Router>
      <Routes>

        {/* ── Public routes ── */}
        <Route
          path="/"
          element={
            // If already logged in, skip welcome and go straight to app
            isLoggedIn
              ? <Navigate to="/app" replace />
              : <WelcomePage />
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/app" replace />
              : <LoginForm onLogin={handleLogin} />
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn
              ? <Navigate to="/app" replace />
              : <SignupForm onLogin={handleLogin} />
          }
        />

        {/* ── Protected main app ── */}
        <Route
          path="/app"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MainApp onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}