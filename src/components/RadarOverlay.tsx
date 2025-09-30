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

  const centerX = 50;
  const centerY = 50;
  const maxRadius = 35;
  const size = isHovered ? 120 : 80;

  // Calculate points for the 4 axes (starting from top, going clockwise)
  const axes = [
    { label: 'Energy', angle: -Math.PI / 2, value: normalized.energy },
    { label: 'Area', angle: 0, value: normalized.area },
    { label: 'Noise', angle: Math.PI / 2, value: normalized.noise },
    { label: 'Water', angle: Math.PI, value: normalized.water },
  ];

  // Calculate data points
  const dataPoints = axes.map((axis) => ({
    x: centerX + Math.cos(axis.angle) * maxRadius * axis.value,
    y: centerY + Math.sin(axis.angle) * maxRadius * axis.value,
  }));

  const pathData = `M ${dataPoints[0].x} ${dataPoints[0].y} ${dataPoints
    .slice(1)
    .map((p) => `L ${p.x} ${p.y}`)
    .join(" ")} Z`;

  const color = dataCenter.type === 'high-consumption' ? 'hsl(6 78% 68%)' : 'hsl(217 91% 60%)';
  const gridColor = 'rgba(255, 255, 255, 0.15)';
  const axisColor = 'rgba(255, 255, 255, 0.1)';

  return (
    <svg
      width={size}
      height={size}
      className="pointer-events-none transition-all duration-300"
      viewBox="0 0 100 100"
    >
      {/* Background grid circles (dashed) */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <circle
          key={`grid-${i}`}
          cx={centerX}
          cy={centerY}
          r={maxRadius * scale}
          fill="none"
          stroke={gridColor}
          strokeWidth="0.5"
          strokeDasharray="2,2"
          opacity={isHovered ? 0.8 : 0.5}
        />
      ))}

      {/* Axis lines */}
      {axes.map((axis, i) => (
        <line
          key={`axis-${i}`}
          x1={centerX}
          y1={centerY}
          x2={centerX + Math.cos(axis.angle) * maxRadius}
          y2={centerY + Math.sin(axis.angle) * maxRadius}
          stroke={axisColor}
          strokeWidth="0.5"
          strokeDasharray="1,1"
          opacity={isHovered ? 0.8 : 0.5}
        />
      ))}

      {/* Data shape */}
      <path
        d={pathData}
        fill={color}
        opacity={isHovered ? 0.7 : 0.5}
        stroke={color}
        strokeWidth="1.5"
        className="transition-all duration-300"
      />

      {/* Base center circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={isHovered ? 3 : 2}
        fill={color}
        opacity="0.8"
        className="transition-all duration-300"
      />
      
      {/* Center dot */}
      <circle
        cx={centerX}
        cy={centerY}
        r="1"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
};
