import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  severity?: "safe" | "caution" | "critical";
  icon?: LucideIcon;
  lastUpdated?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  severity = "safe",
  icon: Icon,
  lastUpdated,
}: MetricCardProps) {
  const severityColors = {
    safe: "border-l-primary",
    caution: "border-l-chart-5",
    critical: "border-l-destructive",
  };

  return (
    <Card className={`border-l-4 ${severityColors[severity]}`} data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            {trend.direction === "up" ? (
              <TrendingUp className="h-3 w-3 text-chart-5" />
            ) : (
              <TrendingDown className="h-3 w-3 text-primary" />
            )}
            <span className="font-medium">{Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
        {lastUpdated && (
          <div className="mt-1 text-xs text-muted-foreground">
            Updated: {lastUpdated}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
