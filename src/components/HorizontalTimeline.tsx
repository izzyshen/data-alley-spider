import { useState, useRef, useEffect } from "react";

interface HorizontalTimelineProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const HorizontalTimeline = ({ selectedYear, onYearChange }: HorizontalTimelineProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const minYear = 2001;
  const maxYear = 2025;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const highlightYears = [2001, 2005, 2010, 2015, 2020, 2025];

  // Get color based on 5-year intervals (pink to yellow gradient)
  const getColorForYear = (year: number): string => {
    const colors = [
      'hsl(358 95% 85%)',  // 2001-2005: Dark pink
      'hsl(0 85% 93%)',    // 2006-2010: Light pink
      'hsl(40 40% 92%)',   // 2011-2015: Very light beige
      'hsl(46 100% 82%)',  // 2016-2020: Light yellow
      'hsl(48 97% 61%)',   // 2021-2025: Bright yellow
    ];
    const index = Math.floor((year - 2001) / 5) % colors.length;
    return colors[index];
  };

  // Get segment color for the timeline line
  const getSegmentColor = (position: number): string => {
    const yearAtPosition = minYear + (position / 100) * (maxYear - minYear);
    return getColorForYear(yearAtPosition);
  };

  const handleSliderDrag = (clientX: number) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
    const yearIndex = Math.round(percentage * (years.length - 1));
    const newYear = years[yearIndex];
    
    if (newYear !== selectedYear) {
      onYearChange(newYear);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderDrag(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleSliderDrag(e.clientX);
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
  }, [isDragging]);

  const sliderPosition = ((selectedYear - minYear) / (maxYear - minYear)) * 100;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl z-10">
      <div 
        ref={timelineRef}
        className="relative h-20 cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* Colored timeline segments */}
        <svg className="absolute top-10 left-0 w-full h-1" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {years.map((year, i) => {
                const position = (i / (years.length - 1)) * 100;
                const color = getColorForYear(year);
                return <stop key={year} offset={`${position}%`} stopColor={color} />;
              })}
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="3" fill="url(#timelineGradient)" />
        </svg>
        
        {/* All year tick marks */}
        {years.map((year) => {
          const position = ((year - minYear) / (maxYear - minYear)) * 100;
          const isHighlight = highlightYears.includes(year);
          const showLabel = isHighlight || hoveredYear === year;
          
          return (
            <div
              key={year}
              className="absolute"
              style={{ left: `${position}%`, top: '40px' }}
              onMouseEnter={() => setHoveredYear(year)}
              onMouseLeave={() => setHoveredYear(null)}
            >
              <div className="flex flex-col items-center -translate-x-1/2">
                {/* Tick mark - shorter */}
                <div 
                  className={`bg-white ${isHighlight ? 'w-0.5 h-3' : 'w-px h-2'}`}
                />
                {/* Year label - smaller text, shown on hover for non-highlight years */}
                {showLabel && (
                  <span className="text-xs font-medium text-white mt-1">
                    {year}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Current year indicator */}
        <div
          className="absolute top-8 -translate-x-1/2 transition-all duration-150"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-white border-2 border-background shadow-lg cursor-grab active:cursor-grabbing" />
            <div className="mt-2 px-2 py-0.5 bg-white text-background rounded-full text-[10px] font-bold shadow-lg">
              {selectedYear}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
