import { DataCenter } from "@/data/dataCenters";

interface RadarOverlayProps {
  dataCenter: DataCenter;
  isHovered: boolean;
}

export const RadarOverlay = ({ dataCenter, isHovered }: RadarOverlayProps) => {
  // Normalize values to 0-1 range for visualization
  const maxValues = {
    energyConsumption: 80,
    waterConsumption: 1500000,
    noiseLevel: 90,
    buildingArea: 250000,
  };

  const normalized = {
    energy: dataCenter.energyConsumption / maxValues.energyConsumption,
    water: dataCenter.waterConsumption / maxValues.waterConsumption,
    noise: dataCenter.noiseLevel / maxValues.noiseLevel,
    area: dataCenter.buildingArea / maxValues.buildingArea,
  };

  // Create SVG path for the radar shape
  const centerX = 30;
  const centerY = 30;
  const maxRadius = 25;

  // Calculate points for the 4 axes (Energy, Water, Noise, Area)
  const angle = (Math.PI * 2) / 4;
  const points = [
    {
      x: centerX + Math.cos(-Math.PI / 2) * maxRadius * normalized.energy,
      y: centerY + Math.sin(-Math.PI / 2) * maxRadius * normalized.energy,
    },
    {
      x: centerX + Math.cos(-Math.PI / 2 + angle) * maxRadius * normalized.water,
      y: centerY + Math.sin(-Math.PI / 2 + angle) * maxRadius * normalized.water,
    },
    {
      x: centerX + Math.cos(-Math.PI / 2 + angle * 2) * maxRadius * normalized.noise,
      y: centerY + Math.sin(-Math.PI / 2 + angle * 2) * maxRadius * normalized.noise,
    },
    {
      x: centerX + Math.cos(-Math.PI / 2 + angle * 3) * maxRadius * normalized.area,
      y: centerY + Math.sin(-Math.PI / 2 + angle * 3) * maxRadius * normalized.area,
    },
  ];

  const pathData = `M ${points[0].x} ${points[0].y} ${points
    .slice(1)
    .map((p) => `L ${p.x} ${p.y}`)
    .join(" ")} Z`;

  const baseCircleRadius = isHovered ? 8 : 6;
  const color = dataCenter.type === 'high-consumption' ? 'hsl(6 78% 68%)' : 'hsl(217 91% 60%)';

  return (
    <svg
      width="60"
      height="60"
      className="pointer-events-none transition-transform duration-300"
      style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}
    >
      {/* Base circle (always visible) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={baseCircleRadius}
        fill={color}
        opacity="0.6"
        className="transition-all duration-300"
      />
      
      {/* Radar shape (consumption data) */}
      <path
        d={pathData}
        fill={color}
        opacity={isHovered ? "0.8" : "0.5"}
        stroke={color}
        strokeWidth="1.5"
        className="transition-all duration-300"
      />
      
      {/* Center dot */}
      <circle
        cx={centerX}
        cy={centerY}
        r="2"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
};
