import { ChevronRight } from "react-feather";

interface BreadcrumbProps {
  items: string[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4" data-testid="breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight size={14} />}
          <span className={index === items.length - 1 ? "text-foreground font-medium" : ""}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}
