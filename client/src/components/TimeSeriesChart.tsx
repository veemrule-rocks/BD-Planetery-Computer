import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TimeSeriesChartProps {
  title: string;
  data: Array<Record<string, any>>;
  xKey: string;
  yKeys: Array<{ key: string; label: string; color: string }>;
}

export function TimeSeriesChart({ title, data, xKey, yKeys }: TimeSeriesChartProps) {
  return (
    <Card data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey={xKey}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.375rem",
              }}
            />
            <Legend />
            {yKeys.map((yKey) => (
              <Line
                key={yKey.key}
                type="monotone"
                dataKey={yKey.key}
                stroke={yKey.color}
                name={yKey.label}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
