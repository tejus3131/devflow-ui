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
      <div className="flex items-center flex-grow relative w-full md:w-auto">
      {/* Title (Project Details) - centered on mobile, normal on desktop */}
      <h1 className="text-base md:text-lg font-semibold text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] flex items-center md:static absolute left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-0">
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

      <div className="flex items-center shrink-0 max-w-[30%]">{rightComponent}</div>
    </div>
  );
};

export default PageHeader;
