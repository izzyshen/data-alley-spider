import { Card } from "./ui/card";

export const TimelineLegend = () => {
  // Years from 1950 to 2025 with 5-year intervals highlighted
  const years = Array.from({ length: 76 }, (_, i) => 1950 + i);
  const highlightYears = [1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];
  
  // Define 4 metrics with their colors
  const metrics = [
    { name: 'Land Use', color: 'hsl(190, 50%, 60%)', value: 131 },
    { name: 'Energy', color: 'hsl(240, 55%, 65%)', value: 82 },
    { name: 'Water', color: 'hsl(280, 50%, 60%)', value: 76 },
    { name: 'Noise', color: 'hsl(350, 60%, 65%)', value: 74 },
  ];

  // Generate organic shape path data for each metric layer
  const generateLayerPath = (metricIndex: number, yearIndex: number, totalYears: number) => {
    const centerX = 110;
    const yPosition = 10 + (yearIndex / totalYears) * 520;
    const baseWidth = 45;
    
    // Create variation based on metric and year for organic look
    const variation = Math.sin(yearIndex * 0.3 + metricIndex) * 10 + Math.cos(yearIndex * 0.15) * 7;
    const width = baseWidth + variation + (metricIndex * 5);
    
    return { x: centerX, y: yPosition, width };
  };

  // Create smooth blob shapes for the central visualization
  const createCentralVisualization = () => {
    const paths: JSX.Element[] = [];
    
    metrics.forEach((metric, metricIndex) => {
      const points = years.map((_, yearIndex) => 
        generateLayerPath(metricIndex, yearIndex, years.length)
      );
      
      // Create left side path
      let leftPath = `M ${points[0].x - points[0].width / 2} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const curr = points[i];
        const prev = points[i - 1];
        const cpx = prev.x - prev.width / 2;
        const cpy = (prev.y + curr.y) / 2;
        leftPath += ` Q ${cpx} ${cpy}, ${curr.x - curr.width / 2} ${curr.y}`;
      }
      
      // Create right side path (reverse)
      for (let i = points.length - 1; i >= 0; i--) {
        const curr = points[i];
        const next = i < points.length - 1 ? points[i + 1] : points[i];
        const cpx = curr.x + curr.width / 2;
        const cpy = i < points.length - 1 ? (curr.y + next.y) / 2 : curr.y;
        leftPath += ` Q ${cpx} ${cpy}, ${curr.x + curr.width / 2} ${curr.y}`;
      }
      
      leftPath += ' Z';
      
      paths.push(
        <path
          key={`metric-${metricIndex}`}
          d={leftPath}
          fill={metric.color}
          opacity={0.7}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
      );
    });
    
    return paths;
  };

  return (
    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-3 shadow-2xl z-10 w-[320px] h-[580px]">
      <div className="flex gap-2 h-full">
        {/* Timeline with years */}
        <div className="flex flex-col items-end gap-0 text-[9px] text-muted-foreground/70">
          {years.map((year) => {
            const isHighlight = highlightYears.includes(year);
            return (
              <div
                key={year}
                className={`flex items-center gap-1 ${isHighlight ? 'font-semibold text-foreground/80' : ''}`}
                style={{ height: `${540 / years.length}px` }}
              >
                <span className={isHighlight ? 'text-[10px]' : ''}>{year}</span>
                <div 
                  className={`w-1 h-px ${isHighlight ? 'bg-foreground/40' : 'bg-muted-foreground/20'}`}
                />
              </div>
            );
          })}
        </div>

        {/* Central organic visualization */}
        <div className="relative flex-1">
          <svg width="220" height="550" className="overflow-visible">
            {/* Dotted connecting line */}
            <line
              x1="110"
              y1="10"
              x2="110"
              y2="540"
              stroke="rgba(150, 150, 150, 0.2)"
              strokeWidth="0.5"
              strokeDasharray="1,2"
            />
            
            {/* Organic layered shapes */}
            {createCentralVisualization()}
          </svg>
        </div>

        {/* Legend with semi-circular indicators */}
        <div className="flex flex-col justify-center gap-2.5 pr-1">
          <h3 className="text-[8px] font-bold text-foreground/70 mb-1 uppercase tracking-wider">
            Total
          </h3>
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-start gap-0.5">
              <svg width="32" height="16" className="flex-shrink-0">
                <path
                  d={`M 0 16 Q 0 ${16 - index * 1.5}, 16 ${6 - index * 1.5} Q 32 ${16 - index * 1.5}, 32 16 Z`}
                  fill={metric.color}
                  opacity={0.85}
                />
              </svg>
              <span className="text-[11px] font-bold text-foreground/90 tabular-nums">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
