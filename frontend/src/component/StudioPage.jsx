import React, { useState } from "react";
import styles from "../styles/StudioPage.module.css";
import DetailsPanel from "./DetailsPanel";
import AISidePanel from "./AISidePanel";
import PriceEstimationPage from "./PriceEstimationPage";
import bgEmeraldSatin from "../assets/Gemini_Generated_Image.png";

const StudioPage = () => {
  const [specs, setSpecs] = useState({
    size:   "—",
    metal:  "—",
    stone:  "—",
    weight: "—",
    cost:   "—",
  });

  const [activeMetal, setActiveMetal] = useState("emerald");
  const [imageUrl,    setImageUrl]    = useState(null);  // 2D image from AI backend
  const [confirmed,   setConfirmed]   = useState(false); // controls Module 3 transition

  /* Called by AISidePanel when the backend returns a response */
  const handleDesignUpdate = (newSpecs, newImageUrl) => {
    if (newSpecs) {
      setSpecs(newSpecs);

      if (newSpecs.metal) {
        const metalMap = {
          "18k gold":   "emerald",
          "rose gold":  "verdigris",
          "silver 925": "malachite",
          "platinum":   "jade",
        };
        const key = metalMap[newSpecs.metal.toLowerCase()] ?? "emerald";
        setActiveMetal(key);
      }
    }

    if (newImageUrl) setImageUrl(newImageUrl);
  };

  /* ── Module 3: show estimation page after user confirms design ── */
  if (confirmed) {
    return (
      <PriceEstimationPage
        confirmedDesign={{ specs, imageUrl }}
        onBack={() => setConfirmed(false)}
      />
    );
  }

  /* ── Module 1: Studio page ── */
  return (
    <div
      className={styles.pageRoot}
      style={{ backgroundImage: `url(${bgEmeraldSatin})` }}
    >
      <div className={styles.mainWrapper}>
        <DetailsPanel
          activeMetal={activeMetal}
          setActiveMetal={setActiveMetal}
          specs={specs}
          imageUrl={imageUrl}
        />
        <AISidePanel
          onDesignUpdate={handleDesignUpdate}
          currentSpecs={specs}
        />
      </div>

      {/* Confirm button appears only once a design image has been generated */}
      {imageUrl && (
        <button
          className={styles.confirmBtn}
          onClick={() => setConfirmed(true)}
        >
          Confirm Design →
        </button>
      )}
    </div>
  );
};

export default StudioPage;
