import React from 'react';

interface CsiEmblemProps {
  className?: string;
  isGold?: boolean;
}

export const CsiEmblem: React.FC<CsiEmblemProps> = ({ className = 'w-11 h-11', isGold = false }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Computer Society of India Emblem"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.85" />
      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="1.8" />
      {/* Inner geometric CSI emblem mark */}
      <polygon points="34,50 58,35 58,65" fill="currentColor" />
      <rect x="61" y="44" width="6" height="12" fill="currentColor" />
      {/* Circular chapter seal arc text with enhanced high-contrast visibility */}
      <path
        id="csi-top-arc"
        d="M 16 50 A 34 34 0 1 1 84 50"
        fill="none"
      />
      <text
        fill={isGold ? '#FFFFFF' : '#38BDF8'}
        fontSize="7"
        fontWeight="800"
        letterSpacing="1.8"
        textAnchor="middle"
        className="transition-colors duration-700"
      >
        <textPath href="#csi-top-arc" startOffset="50%">
          COMPUTER SOCIETY OF INDIA
        </textPath>
      </text>
      <circle cx="50" cy="89" r="1.8" fill="currentColor" />
      <circle cx="42" cy="87.8" r="1.3" fill="currentColor" fillOpacity="0.7" />
      <circle cx="58" cy="87.8" r="1.3" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
};
