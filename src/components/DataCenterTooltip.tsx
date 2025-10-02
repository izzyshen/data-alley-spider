import { DataCenter } from "@/data/dataCenters";
import { Card } from "./ui/card";

interface DataCenterTooltipProps {
  dataCenter: DataCenter;
  position: { x: number; y: number };
}

export const DataCenterTooltip = ({ dataCenter, position }: DataCenterTooltipProps) => {
  return (
    <Card
      className="absolute z-50 pointer-events-none bg-card/95 backdrop-blur-sm border-primary/20 p-4 min-w-[280px] shadow-xl"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 100}px`,
      }}
    >
      <h3 className="font-bold text-lg text-foreground mb-3">{dataCenter.name}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Year Operational:</span>
          <span className="font-semibold text-primary">{dataCenter.yearOperational}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Energy Consumption:</span>
          <span className="font-semibold text-primary">{dataCenter.energyConsumption} MWh</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Water Consumption:</span>
          <span className="font-semibold text-primary">{dataCenter.waterConsumption.toLocaleString()} L</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Noise Level:</span>
          <span className="font-semibold text-primary">{dataCenter.noiseLevel} dB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Building Area:</span>
          <span className="font-semibold text-primary">{dataCenter.buildingArea.toLocaleString()} sqft</span>
        </div>
      </div>
    </Card>
  );
};
