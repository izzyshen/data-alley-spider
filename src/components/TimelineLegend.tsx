import { dataCenters } from "@/data/dataCenters";

export const TimelineLegend = () => {
  // Calculate cumulative metrics by year
  const minYear = 2001;
  const maxYear = 2025;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const highlightYears = [2001, 2005, 2010, 2015, 2020, 2025];
  
  // Calculate cumulative totals for each year
  const cumulativeData = years.map(year => {
    const centersUpToYear = dataCenters.filter(dc => dc.yearOperational <= year);
    return {
      year,
      buildingArea: centersUpToYear.reduce((sum, dc) => sum + dc.buildingArea, 0),
      energyConsumption: centersUpToYear.reduce((sum, dc) => sum + dc.energyConsumption, 0),
      waterConsumption: centersUpToYear.reduce((sum, dc) => sum + dc.waterConsumption, 0),
      noiseLevel: centersUpToYear.length > 0 
        ? centersUpToYear.reduce((sum, dc) => sum + dc.noiseLevel, 0) / centersUpToYear.length 
        : 0,
    };
  });
  
  // Get max values for normalization
  const maxValues = {
    buildingArea: Math.max(...cumulativeData.map(d => d.buildingArea)),
    energyConsumption: Math.max(...cumulativeData.map(d => d.energyConsumption)),
    waterConsumption: Math.max(...cumulativeData.map(d => d.waterConsumption)),
    noiseLevel: Math.max(...cumulativeData.map(d => d.noiseLevel)),
  };
  
  // Current totals (2025)
  const currentTotals = cumulativeData[cumulativeData.length - 1];
  
  // Define 4 metrics with their colors
  const metrics = [
    { 
      name: 'Building Area', 
      color: 'hsl(190, 50%, 60%)', 
      value: Math.round(currentTotals.buildingArea / 1000000).toString() + 'M sqft',
      key: 'buildingArea' as const
    },
    { 
      name: 'Energy', 
      color: 'hsl(240, 55%, 65%)', 
      value: Math.round(currentTotals.energyConsumption).toLocaleString() + ' MWh',
      key: 'energyConsumption' as const
    },
    { 
      name: 'Water', 
      color: 'hsl(280, 50%, 60%)', 
      value: Math.round(currentTotals.waterConsumption / 1000000).toString() + 'M L',
      key: 'waterConsumption' as const
    },
    { 
      name: 'Noise', 
      color: 'hsl(350, 60%, 65%)', 
      value: Math.round(currentTotals.noiseLevel) + ' dB',
      key: 'noiseLevel' as const
    },
  ];

  // Generate organic shape path data for each metric layer based on actual data
  const generateLayerPath = (metricKey: string, yearIndex: number, totalYears: number) => {
    const centerX = 110;
    const yPosition = 10 + (yearIndex / totalYears) * 520;
    
    // Get actual normalized value for this year and metric
    const yearData = cumulativeData[yearIndex];
    const normalizedValue = yearData[metricKey as keyof typeof yearData] / maxValues[metricKey as keyof typeof maxValues];
    
    // Width based on actual cumulative data
    const dataWidth = 5 + normalizedValue * 45; // 5 to 50 range
    
    // Add subtle organic variation
    const variation = Math.sin(yearIndex * 0.2) * 3 + Math.cos(yearIndex * 0.1) * 2;
    const width = dataWidth + variation;
    
    return { x: centerX, y: yPosition, width };
  };

  // Create smooth blob shapes for the central visualization
  const createCentralVisualization = () => {
    const paths: JSX.Element[] = [];
    
    metrics.forEach((metric, metricIndex) => {
      const points = years.map((_, yearIndex) => 
        generateLayerPath(metric.key, yearIndex, years.length)
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
            <div key={index} className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1.5">
                <svg width="20" height="12" className="flex-shrink-0">
                  <path
                    d={`M 0 12 Q 0 ${12 - index * 1}, 10 ${4 - index * 1} Q 20 ${12 - index * 1}, 20 12 Z`}
                    fill={metric.color}
                    opacity={0.85}
                  />
                </svg>
                <span className="text-[9px] text-foreground/80 leading-none">
                  {metric.name}
                </span>
              </div>
              <span className="text-[11px] font-bold text-foreground/90 tabular-nums pl-0.5">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
