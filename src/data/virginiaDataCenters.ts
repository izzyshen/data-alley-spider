// Parse CSV data for Virginia Data Centers
export interface ConsumptionData {
  year: number;
  mwhDC: number;
  mwhPeople: number;
  gallonsDC: number;
  gallonsPeople: number;
}

// Hard-coded consumption data (MWh per day and Gallons per day need to be converted to yearly)
// Note: MWh per day * 365 = MWh/yr, Gallons per day * 365 = Gallons/yr
export const consumptionData: ConsumptionData[] = [
  { year: 2001, mwhDC: 0, mwhPeople: 0, gallonsDC: 0, gallonsPeople: 0 },
  { year: 2005, mwhDC: 0, mwhPeople: 0, gallonsDC: 0, gallonsPeople: 0 },
  { year: 2010, mwhDC: 0, mwhPeople: 0, gallonsDC: 0, gallonsPeople: 0 },
  { year: 2015, mwhDC: 0, mwhPeople: 0, gallonsDC: 0, gallonsPeople: 0 },
  { year: 2020, mwhDC: 0, mwhPeople: 0, gallonsDC: 0, gallonsPeople: 0 },
  { year: 2025, mwhDC: 0, mwhPeople: 0, gallonsDC: 0, gallonsPeople: 0 },
];

// This will be populated from CSV data dynamically
export const parseConsumptionData = (csvText: string): ConsumptionData[] => {
  const lines = csvText.trim().split('\n');
  const yearlyData = new Map<number, { mwhPerDay: number; gallonsPerDay: number; count: number }>();

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^([^,]*),([^,]*),([^,]*),([^,]*),(\d+),([^,]*),([^,]*),([^,]*),([^,]*),([0-9.]+),([0-9.]+),/);
    
    if (match) {
      const year = parseInt(match[5]);
      const mwhPerDay = parseFloat(match[10]);
      const gallonsPerDay = parseFloat(match[11]);
      
      if (!isNaN(year) && !isNaN(mwhPerDay) && !isNaN(gallonsPerDay)) {
        if (!yearlyData.has(year)) {
          yearlyData.set(year, { mwhPerDay: 0, gallonsPerDay: 0, count: 0 });
        }
        const data = yearlyData.get(year)!;
        data.mwhPerDay += mwhPerDay;
        data.gallonsPerDay += gallonsPerDay;
        data.count += 1;
      }
    }
  }

  // Create cumulative data by year
  const years = Array.from({ length: 25 }, (_, i) => 2001 + i);
  const result: ConsumptionData[] = [];
  
  let cumulativeMwh = 0;
  let cumulativeGallons = 0;
  
  // Assumed population data for Loudoun County (rough estimates)
  const populationData: Record<number, number> = {
    2001: 200000,
    2005: 250000,
    2010: 312000,
    2015: 370000,
    2020: 420000,
    2025: 450000,
  };
  
  // Average household consumption estimates
  const mwhPerPersonPerYear = 10; // rough estimate
  const gallonsPerPersonPerYear = 100000; // rough estimate
  
  years.forEach(year => {
    if (yearlyData.has(year)) {
      const data = yearlyData.get(year)!;
      cumulativeMwh += data.mwhPerDay * 365;
      cumulativeGallons += data.gallonsPerDay * 365;
    }
    
    // Interpolate population for years between known data points
    let population = 0;
    const knownYears = Object.keys(populationData).map(Number).sort((a, b) => a - b);
    for (let i = 0; i < knownYears.length - 1; i++) {
      if (year >= knownYears[i] && year <= knownYears[i + 1]) {
        const t = (year - knownYears[i]) / (knownYears[i + 1] - knownYears[i]);
        population = populationData[knownYears[i]] + t * (populationData[knownYears[i + 1]] - populationData[knownYears[i]]);
        break;
      }
    }
    if (population === 0) {
      population = populationData[2025] || 450000;
    }
    
    result.push({
      year,
      mwhDC: cumulativeMwh,
      mwhPeople: population * mwhPerPersonPerYear,
      gallonsDC: cumulativeGallons,
      gallonsPeople: population * gallonsPerPersonPerYear,
    });
  });
  
  return result;
};
