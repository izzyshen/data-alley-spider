import { useState, useRef, useEffect } from "react";

interface HorizontalTimelineProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const HorizontalTimeline = ({ selectedYear, onYearChange }: HorizontalTimelineProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const minYear = 2001;
  const maxYear = 2025;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const highlightYears = [2001, 2005, 2010, 2015, 2020, 2025];

  // Get color based on 5-year intervals
  const getColorForYear = (year: number): string => {
    const colors = [
      'hsl(210 80% 60%)',  // 2001-2005: Blue
      'hsl(30 85% 65%)',   // 2006-2010: Orange
      'hsl(280 70% 65%)',  // 2011-2015: Purple
      'hsl(160 75% 55%)',  // 2016-2020: Teal
      'hsl(350 75% 65%)',  // 2021-2025: Red
    ];
    const index = Math.floor((year - 2001) / 5) % colors.length;
    return colors[index];
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
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-10">
      <div 
        ref={timelineRef}
        className="relative h-16 cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* Timeline line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-foreground/30" />
        
        {/* Year markers */}
        {highlightYears.map((year) => {
          const position = ((year - minYear) / (maxYear - minYear)) * 100;
          const color = getColorForYear(year);
          
          return (
            <div
              key={year}
              className="absolute"
              style={{ left: `${position}%`, top: '0' }}
            >
              <div 
                className="flex flex-col items-center -translate-x-1/2"
              >
                <div 
                  className="w-4 h-4 rounded-full border-2 border-background mb-2"
                  style={{ backgroundColor: color }}
                />
                <span 
                  className="text-sm font-semibold"
                  style={{ color }}
                >
                  {year}
                </span>
              </div>
            </div>
          );
        })}
        
        {/* Current year indicator */}
        <div
          className="absolute top-6 -translate-x-1/2 transition-all duration-150"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg cursor-grab active:cursor-grabbing" />
            <div className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg">
              {selectedYear}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
