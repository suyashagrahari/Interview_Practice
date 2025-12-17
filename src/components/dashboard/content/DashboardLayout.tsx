import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Dashboard layout wrapper component
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      <div className="flex h-screen">{children}</div>
    </div>
  );
};
