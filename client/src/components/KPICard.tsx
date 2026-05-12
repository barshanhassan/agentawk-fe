import { TrendingUp, TrendingDown, Info } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  comparison: string;
  tooltip?: string;
}

export default function KPICard({ title, value, change, comparison, tooltip }: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="border-t-4 border-t-primary" data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground" data-testid="info-tooltip">
                <Info size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold" data-testid="kpi-value">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-chart-2" : "text-destructive"}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span data-testid="kpi-change">{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-muted-foreground">{comparison}</span>
        </div>
      </CardContent>
    </Card>
  );
}
