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
import { TimelineLegend } from './TimelineLegend';

export const DataCenterMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hoveredDataCenter, setHoveredDataCenter] = useState<DataCenter | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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

      // Add markers for each data center
      dataCenters.forEach((dc) => {
        const el = document.createElement('div');
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';

        const root = createRoot(el);
        root.render(<RadarOverlay dataCenter={dc} isHovered={false} />);

        el.addEventListener('mouseenter', (e) => {
          setHoveredDataCenter(dc);
          setMousePosition({ x: e.clientX, y: e.clientY });
          root.render(<RadarOverlay dataCenter={dc} isHovered={true} />);
        });

        el.addEventListener('mouseleave', () => {
          setHoveredDataCenter(null);
          root.render(<RadarOverlay dataCenter={dc} isHovered={false} />);
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
  }, [isMapReady]);

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
    <div className="relative w-full h-screen bg-background">
      <div ref={mapContainer} className="absolute inset-0" />
      <TimelineLegend />
      {hoveredDataCenter && (
        <DataCenterTooltip
          dataCenter={hoveredDataCenter}
          position={mousePosition}
        />
      )}
    </div>
  );
};
