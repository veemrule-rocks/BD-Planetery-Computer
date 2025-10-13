import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertCircle, MapPin } from "lucide-react";

interface AlertCardProps {
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  location: string;
  description: string;
  timestamp: string;
  onViewDetails?: () => void;
}

export function AlertCard({
  severity,
  type,
  location,
  description,
  timestamp,
  onViewDetails,
}: AlertCardProps) {
  const severityConfig = {
    critical: {
      color: "border-l-destructive bg-destructive/5",
      icon: AlertTriangle,
      iconColor: "text-destructive",
    },
    high: {
      color: "border-l-chart-5 bg-chart-5/5",
      icon: AlertCircle,
      iconColor: "text-chart-5",
    },
    medium: {
      color: "border-l-chart-3 bg-chart-3/5",
      icon: AlertCircle,
      iconColor: "text-chart-3",
    },
    low: {
      color: "border-l-primary bg-primary/5",
      icon: Info,
      iconColor: "text-primary",
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Card className={`border-l-4 ${config.color}`} data-testid={`alert-${severity}`}>
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <Icon className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold">{type}</h4>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.iconColor} bg-background`}>
                {severity.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            <p className="text-sm">{description}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">{timestamp}</span>
              {onViewDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewDetails}
                  data-testid="button-view-details"
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
