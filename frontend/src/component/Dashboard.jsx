import React from "react";
// ✅ PAS d'import CSS ici — les styles viennent de App.css déjà chargé dans App.jsx
import gRingImg from "../assets/grenRING.jpg";
import sRingImg from "../assets/silverRING.jpg";
import { FaUser, FaMoon } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const Dashboard = ({ onViewTrending }) => {
  return (
    <main className="main">
      <header className="topbar">
        <div>
          <h1 className="hello-title">Hello, Alexandra!</h1>
          <p className="hello-sub">Let's refine your craft today</p>
        </div>
        <div className="topbar-right">
          <div className="search">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Collection Data"
              className="search-input"
            />
          </div>
          <button className="icon-btn">
            <FaUser />
          </button>
          <button className="icon-btn">
            <FaMoon />
          </button>
        </div>
      </header>

      <section className="top-widgets">
        <div className="market-section">
          <div className="section-label live-label">
            LIVE MARKET DATA • LIVE
          </div>
          <div className="market-cards">
            <div className="market-card">
              <div className="market-tag gold-tag">G</div>
              <div className="market-info">
                <div className="market-title">GOLD VALUE</div>
              </div>
              <div className="market-price">
                <span className="price">$2,345.10</span>
              </div>
            </div>
            <div className="market-card">
              <div className="market-tag silver-tag">S</div>
              <div className="market-info">
                <div className="market-title">SILVER VALUE</div>
              </div>
              <div className="market-price">
                <span className="price">$28.45</span>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <div className="section-label">Quick Actions</div>
          <button className="qa-card">
            <div className="qa-icon">✨</div>
            <div className="qa-text">
              <div className="qa-title">AI Design</div>
              <div className="qa-sub">Create custom pieces</div>
            </div>
          </button>
          <button className="qa-card">
            <div className="qa-icon">📦</div>
            <div className="qa-text">
              <div className="qa-title">Market Intel</div>
              <div className="qa-sub">Live price tracking</div>
            </div>
          </button>
        </div>
      </section>

      <section className="bottom-section">
        <div className="trending">
          <div className="trending-header">
            <h2 className="section-title">Trending Now</h2>
            <button className="link-btn" onClick={onViewTrending}>
              View global trends
            </button>
          </div>

          <div className="trending-cards">
            <div className="trend-card">
              <img
                src={gRingImg}
                alt="Ethereal Solitaire"
                className="trend-img"
              />
              <div className="trend-body overlay-body">
                <div className="trend-title">The Ethereal Solitaire</div>
                <div className="trend-sub">Vogue selection</div>
                <div className="trend-meta">
                  <span className="trend-number">8.4k</span>
                  <span className="trend-label">Interests</span>
                </div>
              </div>
            </div>

            <div className="trend-card">
              <img
                src={sRingImg}
                alt="Liquid Gold Chain"
                className="trend-img"
              />
              <div className="trend-body overlay-body">
                <div className="trend-title">Liquid Gold Chain</div>
                <div className="trend-sub">New series</div>
                <div className="trend-meta">
                  <span className="trend-number">12.1k</span>
                  <span className="trend-label">Interests</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="reach-card">
          <div className="section-label">Your reach</div>
          <div className="reach-main">
            <span className="reach-number">2.4k</span>
            <span className="reach-label">Saved designs</span>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Dashboard;
