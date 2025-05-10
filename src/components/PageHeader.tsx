import React from "react";
import { Breadcrumb, BreadcrumbProps } from "./Breadcrumb";
import { ChevronsRight } from "lucide-react";

interface PageHeaderProps {
  breadcrumbs: BreadcrumbProps;
  title: string;
  rightComponent: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  rightComponent,
}) => {
  return (
    <div className="flex items-center justify-between w-full h-16 px-4 md:px-6 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
      <div className="flex items-center">
        {/* Title (Project Details) - always visible */}
        <h1 className="text-base md:text-lg font-semibold text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] flex items-center">
          {title}
        </h1>

        {/* Breadcrumbs - hidden on mobile */}
        <div className="hidden md:flex items-center">
          <span className="mx-2 text-[var(--color-on-muted-light)] dark:text-[var(--color-on-muted-dark)] text-xl flex items-center">
            <ChevronsRight className="inline" />
          </span>
          <nav className="flex items-center">
            <Breadcrumb items={breadcrumbs.items} />
          </nav>
        </div>
      </div>

      <div className="flex items-center">{rightComponent}</div>
    </div>
  );
};

export default PageHeader;
