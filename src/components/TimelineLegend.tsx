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
    const centerX = 200;
    const yPosition = 20 + (yearIndex / totalYears) * 700;
    const baseWidth = 80;
    
    // Create variation based on metric and year for organic look
    const variation = Math.sin(yearIndex * 0.3 + metricIndex) * 15 + Math.cos(yearIndex * 0.15) * 10;
    const width = baseWidth + variation + (metricIndex * 8);
    
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
    <Card className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border-border p-6 shadow-xl z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex gap-8">
        {/* Timeline with years */}
        <div className="flex flex-col items-end gap-0 text-xs text-muted-foreground">
          {years.map((year) => {
            const isHighlight = highlightYears.includes(year);
            return (
              <div
                key={year}
                className={`flex items-center gap-2 ${isHighlight ? 'font-bold text-foreground' : ''}`}
                style={{ height: `${700 / years.length}px` }}
              >
                <span className={isHighlight ? 'text-sm' : ''}>{year}</span>
                <div 
                  className={`w-2 h-px ${isHighlight ? 'bg-foreground' : 'bg-muted-foreground/30'}`}
                />
              </div>
            );
          })}
        </div>

        {/* Central organic visualization */}
        <div className="relative">
          <svg width="400" height="740" className="overflow-visible">
            {/* Dotted connecting line */}
            <line
              x1="200"
              y1="20"
              x2="200"
              y2="720"
              stroke="rgba(150, 150, 150, 0.3)"
              strokeWidth="1"
              strokeDasharray="2,3"
            />
            
            {/* Organic layered shapes */}
            {createCentralVisualization()}
          </svg>
        </div>

        {/* Legend with semi-circular indicators */}
        <div className="flex flex-col justify-center gap-4">
          <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
            Total Metrics
          </h3>
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-3">
              <svg width="60" height="30" className="flex-shrink-0">
                <path
                  d={`M 0 30 Q 0 ${30 - index * 2}, 30 ${10 - index * 2} Q 60 ${30 - index * 2}, 60 30 Z`}
                  fill={metric.color}
                  opacity={0.8}
                />
              </svg>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
