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
  rightComponent
}) => {
  return (
    <div className="flex items-center justify-between w-full h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        {/* Breadcrumbs */}
        <h1 className="text-lg font-semibold text-gray-900 flex items-center">{title}</h1>
        <span className="mx-2 text-gray-400 text-xl flex items-center"><ChevronsRight className="inline" /></span>
        <nav className="flex items-center">
          <Breadcrumb items={breadcrumbs.items} />
        </nav>
      </div>

      <div className="flex items-center">
        {rightComponent}
      </div>
    </div>
  );
};

export default PageHeader;
