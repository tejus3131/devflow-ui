import React from 'react';
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
            {items.map((item, index) => (
                <React.Fragment key={item.href}>
                    <Link
                        href={item.href}
                        className="hover:text-blue-500"
                    >
                        {item.label}
                    </Link>
                    {index < items.length - 1 && (
                        <span className="text-gray-400"> <ChevronRight className="inline" /></span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

