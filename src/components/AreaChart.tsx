import { ConsumptionData } from "@/data/virginiaDataCenters";

interface AreaChartProps {
  data: ConsumptionData[];
  selectedYear: number;
  type: 'energy' | 'water';
}

export const AreaChart = ({ data, selectedYear, type }: AreaChartProps) => {
  const width = 400;
  const height = 140;
  const padding = { top: 10, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Filter data up to selected year
  const filteredData = data.filter(d => d.year <= selectedYear);
  
  if (filteredData.length === 0) return null;

  const dcKey = type === 'energy' ? 'mwhDC' : 'gallonsDC';
  const peopleKey = type === 'energy' ? 'mwhPeople' : 'gallonsPeople';
  
  // Use max value from filtered data for dynamic y-axis scaling
  const maxValue = Math.max(
    ...filteredData.map(d => d[dcKey] + d[peopleKey])
  );

  const xScale = (year: number) => {
    const minYear = 2001;
    const maxYear = 2025;
    return ((year - minYear) / (maxYear - minYear)) * chartWidth;
  };

  const yScale = (value: number) => {
    return chartHeight - (value / maxValue) * chartHeight;
  };

  // Create path for DC area (blue)
  const dcPath = filteredData.map((d, i) => {
    const x = xScale(d.year);
    const y = yScale(d[dcKey]);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ` L ${xScale(filteredData[filteredData.length - 1].year)} ${chartHeight} L ${xScale(filteredData[0].year)} ${chartHeight} Z`;

  // Create path for people area (red) - stacked on top of DC
  const peoplePath = filteredData.map((d, i) => {
    const x = xScale(d.year);
    const y = yScale(d[dcKey] + d[peopleKey]);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + 
  ' L ' + filteredData.slice().reverse().map(d => {
    const x = xScale(d.year);
    const y = yScale(d[dcKey]);
    return `${x} ${y}`;
  }).join(' L ') + ' Z';

  // Calculate percentages for current year
  const currentData = filteredData[filteredData.length - 1];
  const dcValue = currentData[dcKey];
  const peopleValue = currentData[peopleKey];
  const total = dcValue + peopleValue;
  const dcPercent = total > 0 ? (dcValue / total) * 100 : 50;
  const peoplePercent = total > 0 ? (peopleValue / total) * 100 : 50;

  const formatValue = (value: number) => {
    if (type === 'energy') {
      return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`;
    } else {
      return value >= 1000000000 ? `${(value / 1000000000).toFixed(1)}B` : `${(value / 1000000).toFixed(0)}M`;
    }
  };

  const yAxisTicks = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];

  return (
    <div className="flex flex-col gap-2">
      <svg width={width} height={height} className="overflow-visible">
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid lines */}
          {yAxisTicks.map((tick, i) => (
            <line
              key={i}
              x1={0}
              y1={yScale(tick)}
              x2={chartWidth}
              y2={yScale(tick)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {yAxisTicks.map((tick, i) => (
            <text
              key={i}
              x={-10}
              y={yScale(tick)}
              fill="rgba(255,255,255,0.6)"
              fontSize="10"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {formatValue(tick)}
            </text>
          ))}

          {/* DC area (grey-blue) */}
          <path
            d={dcPath}
            fill="hsl(230 20% 61%)"
            opacity={0.7}
          />

          {/* People area (pink) */}
          <path
            d={peoplePath}
            fill="hsl(347 100% 93%)"
            opacity={0.7}
          />

          {/* X-axis */}
          <line
            x1={0}
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          
          {/* X-axis labels */}
          {[2001, 2005, 2010, 2015, 2020, 2025].map(year => (
            <text
              key={year}
              x={xScale(year)}
              y={chartHeight + 15}
              fill="rgba(255,255,255,0.6)"
              fontSize="10"
              textAnchor="middle"
            >
              {year}
            </text>
          ))}
          
          {/* Y-axis label */}
          <text
            x={-padding.left + 15}
            y={chartHeight / 2}
            fill="rgba(255,255,255,0.8)"
            fontSize="11"
            textAnchor="middle"
            transform={`rotate(-90, ${-padding.left + 15}, ${chartHeight / 2})`}
          >
            {type === 'energy' ? 'MWh/yr' : 'Gallons/yr'}
          </text>
        </g>
      </svg>
      
      {/* Percentage bar */}
      <div className="flex h-4 rounded overflow-hidden">
        <div 
          className="flex items-center justify-center text-xs font-semibold text-white"
          style={{ 
            width: `${peoplePercent}%`,
            backgroundColor: 'hsl(347 100% 93%)'
          }}
        >
          {peoplePercent > 15 && `${peoplePercent.toFixed(0)}%`}
        </div>
        <div 
          className="flex items-center justify-center text-xs font-semibold text-white"
          style={{ 
            width: `${dcPercent}%`,
            backgroundColor: 'hsl(230 20% 61%)'
          }}
        >
          {dcPercent > 15 && `${dcPercent.toFixed(0)}%`}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 justify-center text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(230 20% 61%)' }} />
          <span className="text-foreground/70">{type === 'energy' ? 'MWh/yr (DC)' : 'Gallons/yr (DC)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(347 100% 93%)' }} />
          <span className="text-foreground/70">{type === 'energy' ? 'MWh/yr (people)' : 'Gallons/yr (people)'}</span>
        </div>
      </div>
    </div>
  );
};
