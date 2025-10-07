import { useState } from 'react';
import { DataCenter } from '@/data/dataCenters';
import { RadarOverlay } from './RadarOverlay';

interface MapMarkerProps {
  dataCenter: DataCenter;
  color: string;
  onHover: (dc: DataCenter | null) => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

export const MapMarker = ({ dataCenter, color, onHover, onMouseMove }: MapMarkerProps) => {
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={(e) => {
        setIsHovered(true);
        onHover(dataCenter);
        onMouseMove(e);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(null);
      }}
      onMouseMove={onMouseMove}
    >
      <RadarOverlay dataCenter={dataCenter} isHovered={isHovered} color={color} />
    </div>
  );
};
