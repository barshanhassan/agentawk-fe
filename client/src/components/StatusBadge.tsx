import { Badge } from "@/components/ui/badge";

type StatusType = "success" | "warning" | "danger" | "neutral";

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
}

export default function StatusBadge({ status, type = "neutral" }: StatusBadgeProps) {
  const variants = {
    success: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    warning: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    danger: "bg-destructive/10 text-destructive border-destructive/20",
    neutral: "bg-secondary text-secondary-foreground border-secondary",
  };

  return (
    <Badge variant="outline" className={`${variants[type]} font-medium`} data-testid={`status-${status.toLowerCase()}`}>
      {status}
    </Badge>
  );
}
