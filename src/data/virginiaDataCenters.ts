export interface ConsumptionData {
  year: number;
  mwhDC: number;
  mwhPeople: number;
  gallonsDC: number;
  gallonsPeople: number;
}

export const parseEnergyData = (csvText: string): ConsumptionData[] => {
  const lines = csvText.trim().split('\n');
  const result: ConsumptionData[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',').map(p => p.replace(/"/g, ''));
    if (parts.length >= 7) {
      const year = parseInt(parts[0]);
      // Column 4 is MWh/yr (people), column 6 is MWh/yr (DC)
      const mwhPeople = parseFloat(parts[4].replace(/,/g, ''));
      const mwhDC = parseFloat(parts[6].replace(/,/g, ''));
      
      if (!isNaN(year) && !isNaN(mwhPeople) && !isNaN(mwhDC)) {
        result.push({
          year,
          mwhDC,
          mwhPeople,
          gallonsDC: 0,
          gallonsPeople: 0,
        });
      }
    }
  }
  
  return result;
};

export const parseWaterData = (csvText: string): ConsumptionData[] => {
  const lines = csvText.trim().split('\n');
  const result: ConsumptionData[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',').map(p => p.replace(/"/g, ''));
    if (parts.length >= 3) {
      const year = parseInt(parts[0]);
      const gallonsPeople = parseFloat(parts[2].replace(/,/g, ''));
      const gallonsDC = parseFloat(parts[3].replace(/,/g, ''));
      
      if (!isNaN(year) && !isNaN(gallonsPeople) && !isNaN(gallonsDC)) {
        result.push({
          year,
          mwhDC: 0,
          mwhPeople: 0,
          gallonsDC,
          gallonsPeople,
        });
      }
    }
  }
  
  return result;
};
