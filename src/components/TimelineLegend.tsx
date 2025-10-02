import { dataCenters } from "@/data/dataCenters";
import { useState, useRef, useEffect } from "react";

interface TimelineLegendProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const TimelineLegend = ({ selectedYear, onYearChange }: TimelineLegendProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

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
    };
  });
  
  // Get max values for normalization
  const maxValues = {
    buildingArea: Math.max(...cumulativeData.map(d => d.buildingArea)),
    energyConsumption: Math.max(...cumulativeData.map(d => d.energyConsumption)),
    waterConsumption: Math.max(...cumulativeData.map(d => d.waterConsumption)),
  };
  
  // Current totals for selected year
  const currentTotals = cumulativeData.find(d => d.year === selectedYear) || cumulativeData[cumulativeData.length - 1];
  
  // Define 3 metrics with their colors
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
  ];

  // Create stacked bar visualization for each year
  const createStackedVisualization = () => {
    const elements: JSX.Element[] = [];
    const centerX = 110;
    const barHeight = 540 / years.length;
    
    years.forEach((year, yearIndex) => {
      const yPosition = 10 + yearIndex * barHeight;
      const yearData = cumulativeData[yearIndex];
      
      // Calculate normalized heights for stacking (0-1 range)
      const normalizedHeights = metrics.map(metric => {
        const value = yearData[metric.key as keyof typeof yearData];
        const maxValue = maxValues[metric.key as keyof typeof maxValues];
        return value / maxValue;
      });
      
      // Scale factor to make the bars fit nicely in the available width
      const totalNormalized = normalizedHeights.reduce((sum, h) => sum + h, 0);
      const scaleFactor = totalNormalized > 0 ? 80 / totalNormalized : 0;
      
      // Create stacked rectangles from left to right
      let currentX = centerX;
      
      metrics.forEach((metric, metricIndex) => {
        const width = normalizedHeights[metricIndex] * scaleFactor;
        
        if (width > 0) {
          // Left side (going left from center)
          elements.push(
            <rect
              key={`bar-left-${yearIndex}-${metricIndex}`}
              x={currentX - width}
              y={yPosition}
              width={width}
              height={barHeight - 1}
              fill={metric.color}
              opacity={0.85}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
            />
          );
          
          // Right side (mirrored)
          elements.push(
            <rect
              key={`bar-right-${yearIndex}-${metricIndex}`}
              x={centerX}
              y={yPosition}
              width={width}
              height={barHeight - 1}
              fill={metric.color}
              opacity={0.85}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
            />
          );
        }
        
        currentX -= width;
      });
    });
    
    return elements;
  };

  // Handle slider drag
  const handleSliderDrag = (clientY: number) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
    const yearIndex = Math.round(percentage * (years.length - 1));
    const newYear = years[yearIndex];
    
    if (newYear !== selectedYear) {
      onYearChange(newYear);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderDrag(e.clientY);
  };

  // Add global event listeners for drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleSliderDrag(e.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedYear, years.length, minYear, maxYear, onYearChange]);

  // Calculate slider position based on selected year
  const sliderPosition = ((selectedYear - minYear) / (maxYear - minYear)) * 540;

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
        <div 
          ref={timelineRef}
          className="relative flex-1 cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          <svg width="220" height="550" className="overflow-visible">
            {/* Center line */}
            <line
              x1="110"
              y1="10"
              x2="110"
              y2="550"
              stroke="rgba(150, 150, 150, 0.3)"
              strokeWidth="1"
            />
            
            {/* Stacked bar visualization */}
            {createStackedVisualization()}

            {/* Draggable year slider */}
            <g>
              <line
                x1="0"
                y1={sliderPosition}
                x2="220"
                y2={sliderPosition}
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="110"
                cy={sliderPosition}
                r="8"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                className="cursor-grab active:cursor-grabbing"
              />
              <text
                x="115"
                y={sliderPosition + 4}
                fill="hsl(var(--foreground))"
                fontSize="12"
                fontWeight="bold"
              >
                {selectedYear}
              </text>
            </g>
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
