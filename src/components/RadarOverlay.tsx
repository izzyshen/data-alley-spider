import { DataCenter, dataCenters } from "@/data/dataCenters";

interface RadarOverlayProps {
  dataCenter: DataCenter;
  isHovered: boolean;
}

// Calculate actual max values from the dataset
const maxValues = {
  energyConsumption: Math.max(...dataCenters.map(dc => dc.energyConsumption)),
  waterConsumption: Math.max(...dataCenters.map(dc => dc.waterConsumption)),
  noiseLevel: Math.max(...dataCenters.map(dc => dc.noiseLevel)),
  buildingArea: Math.max(...dataCenters.map(dc => dc.buildingArea)),
};

export const RadarOverlay = ({ dataCenter, isHovered }: RadarOverlayProps) => {
  // Normalize values to 0-1 range for visualization

  const normalized = {
    energy: dataCenter.energyConsumption / maxValues.energyConsumption,
    water: dataCenter.waterConsumption / maxValues.waterConsumption,
    noise: dataCenter.noiseLevel / maxValues.noiseLevel,
    area: dataCenter.buildingArea / maxValues.buildingArea,
  };

  const centerX = 50;
  const centerY = 50;
  const maxRadius = 40;
  const size = isHovered ? 140 : 100;

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

  // Create smooth blob-like path using cardinal splines
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    const tension = 0.3;
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length];
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];
      
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    
    return path + ' Z';
  };

  const pathData = createSmoothPath(dataPoints);

  const color = 'hsl(45 85% 75%)'; // Orange/tan color like reference
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
