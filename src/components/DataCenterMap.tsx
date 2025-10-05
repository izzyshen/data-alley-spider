import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { dataCenters, DataCenter } from '@/data/dataCenters';
import { DataCenterTooltip } from './DataCenterTooltip';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { createRoot } from 'react-dom/client';
import { RadarOverlay } from './RadarOverlay';
import { HorizontalTimeline } from './HorizontalTimeline';
import { AreaChart } from './AreaChart';
import { parseEnergyData, parseWaterData, ConsumptionData } from '@/data/virginiaDataCenters';
import energyDataCSV from '@/data/energyConsumption.csv?raw';
import waterDataCSV from '@/data/waterConsumption.csv?raw';

export const DataCenterMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hoveredDataCenter, setHoveredDataCenter] = useState<DataCenter | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedYear, setSelectedYear] = useState(2025);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [energyData, setEnergyData] = useState<ConsumptionData[]>([]);
  const [waterData, setWaterData] = useState<ConsumptionData[]>([]);

  // Parse CSV data on mount
  useEffect(() => {
    const energy = parseEnergyData(energyDataCSV);
    const water = parseWaterData(waterDataCSV);
    setEnergyData(energy);
    setWaterData(water);
  }, []);

  // Filter data centers based on selected year
  const filteredDataCenters = dataCenters.filter(dc => dc.yearOperational <= selectedYear);

  // Get color based on 5-year intervals
  const getColorForYear = (year: number): string => {
    const baseYear = Math.floor((year - 2001) / 5) * 5 + 2001;
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

  // Initialize map when token is provided and user clicks load
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !shouldLoadMap) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-77.43, 39.01],
        zoom: 10.5,
        pitch: 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: false,
        }),
        'top-left'
      );

      map.current.on('load', () => {
        setIsMapReady(true);
        toast.success('Map loaded successfully!');
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      toast.error('Failed to initialize map. Please check your Mapbox token.');
      console.error(error);
    }
  }, [mapboxToken, shouldLoadMap]);

  useEffect(() => {
    if (isMapReady && map.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add markers for each data center (filtered by year)
      filteredDataCenters.forEach((dc) => {
        const el = document.createElement('div');
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.pointerEvents = 'auto';

        const dcColor = getColorForYear(dc.yearOperational);
        const root = createRoot(el);
        root.render(<RadarOverlay dataCenter={dc} isHovered={false} color={dcColor} />);

        el.addEventListener('mouseenter', (e) => {
          setHoveredDataCenter(dc);
          setMousePosition({ x: e.clientX, y: e.clientY });
          root.render(<RadarOverlay dataCenter={dc} isHovered={true} color={dcColor} />);
        });

        el.addEventListener('mouseleave', () => {
          setHoveredDataCenter(null);
          root.render(<RadarOverlay dataCenter={dc} isHovered={false} color={dcColor} />);
        });

        el.addEventListener('mousemove', (e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([dc.lng, dc.lat])
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    }
  }, [isMapReady, selectedYear, filteredDataCenters]);

  if (!shouldLoadMap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Data Center Alley Map</h1>
            <p className="text-muted-foreground">
              Enter your Mapbox public token to view the interactive map
            </p>
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-card border-border"
            />
            <Button 
              onClick={() => {
                if (mapboxToken) {
                  setShouldLoadMap(true);
                } else {
                  toast.error('Please enter a valid Mapbox token');
                }
              }} 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Load Map
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Get your token at{' '}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen bg-background"
      onMouseLeave={() => setHoveredDataCenter(null)}
    >
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Horizontal timeline at top */}
      <HorizontalTimeline selectedYear={selectedYear} onYearChange={setSelectedYear} />
      
      {/* Area charts at bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 bg-background/90 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-2xl">
        <AreaChart data={energyData} selectedYear={selectedYear} type="energy" />
        <div className="w-px bg-border/50" />
        <AreaChart data={waterData} selectedYear={selectedYear} type="water" />
      </div>
      
      {hoveredDataCenter && (
        <DataCenterTooltip
          dataCenter={hoveredDataCenter}
          position={mousePosition}
        />
      )}
    </div>
  );
};
