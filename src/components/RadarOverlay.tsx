import { DataCenter, dataCenters } from "@/data/dataCenters";

interface RadarOverlayProps {
  dataCenter: DataCenter;
  isHovered: boolean;
  color?: string;
}

// Calculate actual max values from the dataset
const maxValues = {
  energyConsumption: Math.max(...dataCenters.map(dc => dc.energyConsumption)),
  waterConsumption: Math.max(...dataCenters.map(dc => dc.waterConsumption)),
  buildingArea: Math.max(...dataCenters.map(dc => dc.buildingArea)),
};

export const RadarOverlay = ({ dataCenter, isHovered, color = 'hsl(45 85% 75%)' }: RadarOverlayProps) => {
  // Normalize values to 0-1 range for visualization

  const normalized = {
    energy: dataCenter.energyConsumption / maxValues.energyConsumption,
    water: dataCenter.waterConsumption / maxValues.waterConsumption,
    area: dataCenter.buildingArea / maxValues.buildingArea,
  };

  const centerX = 50;
  const centerY = 50;
  const maxRadius = 40;
  const size = isHovered ? 140 : 100;

  // Calculate points for the 3 axes (triangle shape, evenly distributed)
  const axes = [
    { label: 'Energy', angle: -Math.PI / 2, value: normalized.energy },
    { label: 'Water', angle: Math.PI / 6, value: normalized.water },
    { label: 'Area', angle: (5 * Math.PI) / 6, value: normalized.area },
  ];

  // Calculate data points
  const dataPoints = axes.map((axis) => ({
    x: centerX + Math.cos(axis.angle) * maxRadius * axis.value,
    y: centerY + Math.sin(axis.angle) * maxRadius * axis.value,
  }));

  // Create sharp 3-point star shape with concave curves between points
  const createStarPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Create sharp star by adding intermediate control points between main points
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      // Calculate midpoint between current and next point
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      
      // Pull the midpoint toward center to create concave curve (star effect)
      const pullFactor = 0.4; // How much to pull toward center (higher = more concave)
      const controlX = midX + (centerX - midX) * pullFactor;
      const controlY = midY + (centerY - midY) * pullFactor;
      
      // Create quadratic curve from current point through control to next point
      path += ` Q ${controlX} ${controlY}, ${next.x} ${next.y}`;
    }
    
    return path + ' Z';
  };

  const pathData = createStarPath(dataPoints);

  const gridColor = 'rgba(200, 200, 200, 0.5)';
  const axisColor = 'rgba(200, 200, 200, 0.3)';

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
          strokeWidth="1"
          strokeDasharray="3,2"
          opacity={isHovered ? 0.9 : 0.7}
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

      {/* Data shape - smooth blob */}
      <path
        d={pathData}
        fill={color}
        opacity={isHovered ? 0.8 : 0.6}
        stroke="hsl(30 70% 55%)"
        strokeWidth="1"
        className="transition-all duration-300"
      />

      {/* Axis labels (only show on hover) */}
      {isHovered && axes.map((axis, i) => {
        const labelDistance = maxRadius + 12;
        const labelX = centerX + Math.cos(axis.angle) * labelDistance;
        const labelY = centerY + Math.sin(axis.angle) * labelDistance;
        
        return (
          <text
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[6px] fill-white/80 font-medium"
          >
            {axis.label}
          </text>
        );
      })}

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
