import React, { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    state: "loading" | "error" | "success";
    error: string | null;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, state, error }) => {
    if (state === "loading") {
        return (
            <div className="bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/20 dark:border-border-dark p-5 rounded-xl transition-colors shadow-sm flex items-center justify-center">
                <p className="text-on-neutral-light dark:text-on-neutral-dark">Loading...</p>
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="bg-neutral-light dark:bg-neutral-dark border border-red-500 p-5 rounded-xl transition-colors shadow-sm">
                <p className="text-red-500 font-medium">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/20 dark:border-border-dark p-5 rounded-xl transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-primary-light/20 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark`}>
                    {icon}
                </div>
                <p className="text-on-neutral-light dark:text-on-neutral-dark font-medium">
                    {title}
                </p>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
};

export default StatsCard;