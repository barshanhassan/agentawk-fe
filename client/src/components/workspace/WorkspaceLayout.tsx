import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type WorkspaceLayoutProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
};

export default function WorkspaceLayout({
  title,
  description,
  children,
}: WorkspaceLayoutProps) {
  return (
    <div className="w-full min-h-screen p-6 bg-gray-50 dark:bg-slate-950">
      <Card className="border-0 shadow-sm w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
        <CardContent className="p-6 w-full overflow-visible">
          {/* Title can now be string OR JSX */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            )}
          </div>

          {/* Separator below title/description */}
          <div className="border-b border-gray-300 dark:border-slate-800 my-4" />

          <div className="w-full">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
