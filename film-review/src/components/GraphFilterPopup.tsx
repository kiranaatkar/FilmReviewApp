import React from "react";
import "../styles/GraphFilterPopup.css";
import { useGraphFilterStore } from "../store/useGraphFilterStore";

const Tri: React.FC<{ color: string; filled: boolean; size?: number }> = ({
  color,
  filled,
  size = 40,
}) => (
  <svg width={size} height={Math.round(size * 0.9)} viewBox="0 0 40 35">
    <polygon
      points="20,2 2,33 38,33"
      fill={filled ? color : "transparent"}
      stroke={color}
      strokeWidth={2}
    />
  </svg>
);

const GraphFilterPopup: React.FC = () => {
  const { filmPeak, audience, you, toggleFilter } = useGraphFilterStore();

  return (
    <div className="graph-filter-popup">
      <button
        className={`filter-btn ${filmPeak ? "active" : "inactive"}`}
        onClick={() => toggleFilter("filmPeak")}
      >
        <Tri color="#FD0000" filled={filmPeak} size={36} />
        <span className="label">FilmPeak</span>
      </button>

      <button
        className={`filter-btn ${audience ? "active" : "inactive"}`}
        onClick={() => toggleFilter("audience")}
      >
        <Tri color="#0079DD" filled={audience} size={36} />
        <span className="label">Audience</span>
      </button>

      <button
        className={`filter-btn ${you ? "active" : "inactive"}`}
        onClick={() => toggleFilter("you")}
      >
        <Tri color="#0D6901" filled={you} size={36} />
        <span className="label">You</span>
      </button>
    </div>
  );
};

export default GraphFilterPopup;
