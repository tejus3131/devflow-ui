import React, { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
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