import { Card } from "./ui/card";

export const MapLegend = () => {
  return (
    <Card className="absolute top-4 right-4 z-10 bg-card/95 backdrop-blur-sm border-primary/20 p-4 min-w-[240px]">
      <h3 className="font-bold text-sm text-foreground mb-3">Legend</h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[hsl(217,91%,60%)]"></div>
          <span className="text-muted-foreground">Operational Data Center</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[hsl(6,78%,68%)]"></div>
          <span className="text-muted-foreground">High Consumption Center</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Hover over data centers to view consumption details. The radar shape indicates relative consumption across four metrics.
        </p>
      </div>
    </Card>
  );
};
