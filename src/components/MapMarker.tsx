import { useState, useCallback, memo } from 'react';
import { DataCenter } from '@/data/dataCenters';
import { RadarOverlay } from './RadarOverlay';

interface MapMarkerProps {
  dataCenter: DataCenter;
  color: string;
  onHover: (dc: DataCenter | null) => void;
  onMouseMove: (x: number, y: number) => void;
}

export const MapMarker = memo(({ dataCenter, color, onHover, onMouseMove }: MapMarkerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setIsHovered(true);
    onHover(dataCenter);
    onMouseMove(e.clientX, e.clientY);
  }, [dataCenter, onHover, onMouseMove]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHover(null);
  }, [onHover]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    onMouseMove(e.clientX, e.clientY);
  }, [onMouseMove]);

  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <RadarOverlay dataCenter={dataCenter} isHovered={isHovered} color={color} />
    </div>
  );
});

MapMarker.displayName = 'MapMarker';
