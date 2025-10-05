import { DataCenter } from "@/data/dataCenters";
import { Card } from "./ui/card";

interface DataCenterTooltipProps {
  dataCenter: DataCenter;
  position: { x: number; y: number };
}

export const DataCenterTooltip = ({ dataCenter, position }: DataCenterTooltipProps) => {
  return (
    <Card
      className="absolute z-50 pointer-events-none bg-card/60 backdrop-blur-sm border-white/10 p-2 min-w-[140px] shadow-xl"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 100}px`,
      }}
    >
      <h3 className="font-bold text-xs text-white mb-1.5">{dataCenter.name}</h3>
      <div className="space-y-1 text-[10px] text-left">
        <div className="text-white/80">
          Year Operational: <span className="font-semibold text-white">{dataCenter.yearOperational}</span>
        </div>
        <div className="text-white/80">
          Energy Consumption: <span className="font-semibold text-white">{dataCenter.energyConsumption} MWh</span>
        </div>
        <div className="text-white/80">
          Water Consumption: <span className="font-semibold text-white">{dataCenter.waterConsumption.toLocaleString()} L</span>
        </div>
        <div className="text-white/80">
          Noise Level: <span className="font-semibold text-white">{dataCenter.noiseLevel} dB</span>
        </div>
        <div className="text-white/80">
          Building Area: <span className="font-semibold text-white">{dataCenter.buildingArea.toLocaleString()} sqft</span>
        </div>
      </div>
    </Card>
  );
};
