import React, {useState} from "react";
import "../styles/GraphFilterPopup.css";

interface GraphFilterPopupProps {
  onApply: (filters: { filmPeak: boolean; audience: boolean; you: boolean }) => void;
}

const Tri: React.FC<{
  color: string;
  filled: boolean;
  size?: number;
  className?: string;
}> = ({ color, filled, size = 40, className }) => {
  return (
    <svg
      className={className}
      width={size}
      height={Math.round(size * 0.9)}
      viewBox="0 0 40 35"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <polygon
        points="20,2 2,33 38,33"
        fill={filled ? color : "transparent"}
        stroke={color}
        strokeWidth={2}
      />
    </svg>
  );
};


const GraphFilterPopup: React.FC<GraphFilterPopupProps> = ({ onApply }) => {
  const [filmPeak, setFilmPeak] = useState(true);
  const [audience, setAudience] = useState(true);
  const [you, setYou] = useState(true);

  const handleToggle = (filter: "filmPeak" | "audience" | "you") => {
    if (filter === "filmPeak") setFilmPeak((prev) => !prev);
    if (filter === "audience") setAudience((prev) => !prev);
    if (filter === "you") setYou((prev) => !prev);
    onApply({ filmPeak, audience, you });
  };

  return (
    <div className="graph-filter-popup">
      <button
        className={`filter-btn ${filmPeak ? "active" : "inactive"}`}
        onClick={() => handleToggle("filmPeak")}
        aria-pressed={filmPeak}
      >
        <Tri color="#FD0000" filled={filmPeak} size={36} className="triangle-svg" />
        <span className="label">FilmPeak</span>
      </button>

      <button
        className={`filter-btn ${audience ? "active" : "inactive"}`}
        onClick={() => handleToggle("audience")}
        aria-pressed={audience}
      >
        <Tri color="#0079DD" filled={audience} size={36} className="triangle-svg" />
        <span className="label">Audience</span>
      </button>

      <button
        className={`filter-btn ${you ? "active" : "inactive"}`}
        onClick={() => handleToggle("you")}
        aria-pressed={you}
      >
        <Tri color="#0D6901" filled={you} size={36} className="triangle-svg" />
        <span className="label">You</span>
      </button>
    </div>
  );
};

export default GraphFilterPopup;
