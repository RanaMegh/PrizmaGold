import React, { useState } from "react";

import "../index.css";

import gRingImg from "../assets/grenRING.jpg";
import all from "../assets/all.png";
import bracelet from "../assets/bracelet.png";
import earing from "../assets/earing.png";
import neck from "../assets/neck.png";
import ring from "../assets/ring.png";

const categories = [
  { id: "all", iconImg: all },
  { id: "rings", iconImg: ring },
  { id: "necklaces", iconImg: neck },
  { id: "bracelets", iconImg: bracelet },
  { id: "earrings", iconImg: earing },
];

const products = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: "LUXURIOUS GOLD RING",
  price: "$3,800",
  image: gRingImg,
  category: i % 2 === 0 ? "rings" : "bracelets",
}));

export default function TrendingPage({ onBack }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );

  return (
    <div className="tp-page">
      <header className="tp-top-bar">
        <button className="tp-back-link" onClick={onBack}>
          ← ALL
        </button>
        <h1 className="tp-page-title">TRENDING NOW</h1>
        <button className="tp-search-btn">🔍</button>
      </header>

      <section className="tp-category-section">
        <h2 className="tp-section-title">EXPLORE BY CATEGORY</h2>
        <div className="tp-category-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={
                "tp-category-card" +
                (activeCategory === cat.id ? " tp-category-card--active" : "")
              }
              onClick={() => setActiveCategory(cat.id)}
            >
              <div className="tp-category-thumb">
                <img src={cat.iconImg} alt={cat.id} />
              </div>
              <span className="tp-category-label">{cat.id}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="tp-product-section">
        <h2 className="tp-section-title">TRENDING NOW</h2>
        <div className="tp-product-grid">
          {filtered.map((p) => (
            <article key={p.id} className="tp-product-card">
              <div className="tp-product-image-wrapper">
                <img src={p.image} alt={p.title} className="tp-product-image" />
                <button
                  className={
                    "tp-favorite-btn" +
                    (favorites.includes(p.id) ? " tp-favorite-btn--active" : "")
                  }
                  onClick={() => toggleFavorite(p.id)}
                >
                  ❤
                </button>
                <div className="tp-product-overlay">
                  <h3 className="tp-product-title">{p.title}</h3>
                  <p className="tp-product-price">{p.price}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
