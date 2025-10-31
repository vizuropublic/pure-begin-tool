import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-page-header">
      <div className="space-y-1">
        <h1 className="text-heading-primary font-bold">{title}</h1>
        {description && (
          <p className="text-text-secondary text-sm sm:text-base">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {children}
        </div>
      )}
    </div>
  );
};