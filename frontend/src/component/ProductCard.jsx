import React from "react";
import styles from "../styles/StudioPage.module.css";
import coinIcon from "../assets/download.jpg";

const METALS = {
  emerald:   { label: "Emerald"   },
  malachite: { label: "Malachite" },
  verdigris: { label: "Verdigris" },
  jade:      { label: "Jade"      },
};

/* ── 2D Image Viewer (replaces Three.js RingViewer) ── */
const DesignViewer = ({ imageUrl }) => {
  if (imageUrl) {
    return (
      <div className={styles.designViewerWrapper}>
        <img
          src={imageUrl}
          alt="AI Generated Design"
          className={styles.designImage}
        />
        <div className={styles.aiGeneratedBadge}>✦ AI Generated</div>
      </div>
    );
  }

  return (
    <div className={styles.designViewerWrapper}>
      <div className={styles.designPlaceholder}>
        <span className={styles.placeholderIcon}>💍</span>
        <span className={styles.placeholderText}>
          Describe your design to generate a preview
        </span>
      </div>
    </div>
  );
};

/* ── Main ProductCard Component ── */
const ProductCard = ({ activeMetal, setActiveMetal, specs, imageUrl }) => {
  return (
    <>
      <div className={styles.productCard}>

        <DesignViewer imageUrl={imageUrl} />

        <div className={styles.metalRow}>
          {Object.entries(METALS).map(([key, m]) => (
            <button
              key={key}
              className={`${styles.metalBtn}${
                activeMetal === key ? " " + styles.metalBtnActive : ""
              }`}
              onClick={() => setActiveMetal(key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.measurementDiv}>Measurement Breakdown</div>

      <ul className={styles.measurementsList}>
        <li><span>Ring Size :</span>    <span>{specs?.size   || "—"}</span></li>
        <li><span>Metal :</span>        <span>{specs?.metal  || "—"}</span></li>
        <li><span>Stone :</span>        <span>{specs?.stone  || "—"}</span></li>
        <li><span>Total Weight :</span> <span>{specs?.weight || "—"}</span></li>
      </ul>

      <div className={styles.costBox}>
        <div className={styles.costIconWrapper}>
          <img src={coinIcon} alt="Cost icon" />
        </div>
        <div className={styles.costText}>
          <span className={styles.costLabel}>Estimated Cost:</span>
          <span className={styles.costValue}>{specs?.cost || "Calculating..."}</span>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
