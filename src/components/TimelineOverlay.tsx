import { TimeSeriesData } from "@/data/dataCenters";

interface TimelineOverlayProps {
  timeSeries: TimeSeriesData[];
  isHovered: boolean;
}

export const TimelineOverlay = ({ timeSeries, isHovered }: TimelineOverlayProps) => {
  if (!timeSeries || timeSeries.length === 0) return null;

  const width = isHovered ? 80 : 60;
  const height = isHovered ? 200 : 150;
  const padding = 10;
  const layerHeight = (height - padding * 2) / timeSeries.length;

  // Define colors for each metric
  const colors = {
    landUse: 'hsl(210, 70%, 60%)',      // Blue
    energy: 'hsl(30, 85%, 60%)',        // Orange
    water: 'hsl(280, 60%, 65%)',        // Purple
    noise: 'hsl(340, 75%, 65%)',        // Pink/Red
  };

  // Create smooth path for each metric layer
  const createLayerPath = (metricKey: keyof Omit<TimeSeriesData, 'year'>, index: number) => {
    const points: { x: number; y: number }[] = [];
    
    timeSeries.forEach((data, i) => {
      const y = padding + i * layerHeight;
      const value = data[metricKey];
      const maxWidth = width - padding * 2;
      const xOffset = (value / 100) * maxWidth / 2;
      
      // Left side
      points.push({ x: width / 2 - xOffset, y });
    });
    
    // Mirror for right side
    for (let i = timeSeries.length - 1; i >= 0; i--) {
      const data = timeSeries[i];
      const y = padding + i * layerHeight;
      const value = data[metricKey];
      const maxWidth = width - padding * 2;
      const xOffset = (value / 100) * maxWidth / 2;
      
      points.push({ x: width / 2 + xOffset, y });
    }
    
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Use smooth curves
    for (let i = 1; i < points.length; i++) {
      const curr = points[i];
      const prev = points[i - 1];
      
      const cpx = (prev.x + curr.x) / 2;
      const cpy = (prev.y + curr.y) / 2;
      
      path += ` Q ${cpx} ${cpy}, ${curr.x} ${curr.y}`;
    }
    
    return path + ' Z';
  };

  return (
    <svg
      width={width}
      height={height}
      className="pointer-events-none transition-all duration-300"
      style={{
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
      }}
    >
      {/* Background */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0.2)"
        rx="4"
      />
      
      {/* Layered metrics - render from back to front */}
      <path
        d={createLayerPath('landUse', 0)}
        fill={colors.landUse}
        opacity={isHovered ? 0.7 : 0.5}
        className="transition-all duration-300"
      />
      
      <path
        d={createLayerPath('waterConsumption', 1)}
        fill={colors.water}
        opacity={isHovered ? 0.7 : 0.5}
        className="transition-all duration-300"
      />
      
      <path
        d={createLayerPath('energyConsumption', 2)}
        fill={colors.energy}
        opacity={isHovered ? 0.75 : 0.55}
        className="transition-all duration-300"
      />
      
      <path
        d={createLayerPath('noiseLevel', 3)}
        fill={colors.noise}
        opacity={isHovered ? 0.8 : 0.6}
        className="transition-all duration-300"
      />
      
      {/* Year labels on hover */}
      {isHovered && timeSeries.map((data, i) => {
        const y = padding + i * layerHeight;
        return (
          <text
            key={`year-${i}`}
            x="5"
            y={y + 2}
            className="text-[6px] fill-white/70 font-medium"
          >
            {data.year}
          </text>
        );
      })}
      
      {/* Center line */}
      <line
        x1={width / 2}
        y1={padding}
        x2={width / 2}
        y2={height - padding}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="0.5"
        strokeDasharray="2,2"
      />
    </svg>
  );
};
