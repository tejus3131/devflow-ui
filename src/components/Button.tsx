import React from 'react';

// ButtonProps interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
    width?: string;
    icon?: React.ReactNode;
    onClick?: (event: React.MouseEvent) => void;
}

// ButtonGroupProps interface
interface ButtonGroupProps {
    buttons: ButtonProps[];
    variant?: 'primary' | 'secondary';
    className?: string;
}

// Individual Button component
export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    className = '',
    width = 'w-full',
    icon,
    onClick,
    ...props
}) => {
    const baseClasses = `rounded-md transition-colors flex items-center justify-center font-medium text-sm py-2 px-4 ${width}`;

    const variantClasses = {
        primary: "bg-gradient-to-r from-primary-dark to-secondary-dark text-on-primary-dark hover:opacity-90 dark:from-primary-light dark:to-secondary-light dark:text-on-primary-light",
        secondary: "border border-solid border-border-dark text-on-surface-dark dark:border-border-light dark:text-on-surface-light"
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    const content = (
        <>
            <span className="flex-grow text-center">{children}</span>
            {icon && <span className="ml-2 flex-shrink-0">{icon}</span>}
        </>
    );

    return (
        <button
            className={combinedClasses}
            onClick={onClick}
            {...props}
        >
            {content}
        </button>
    );
};

// ButtonGroup component that creates a unified button with partitions
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
    buttons,
    className = '',
    variant = 'primary',
}) => {
    if (!buttons || buttons.length === 0) {
        return null;
    }

    // Define variant classes based on the variant prop
    const variantClasses = {
        primary: "bg-gradient-to-r from-primary-dark to-secondary-dark text-on-primary-dark dark:from-primary-light dark:to-secondary-light dark:text-on-primary-light",
        secondary: "bg-transparent border border-solid border-border-dark text-on-surface-dark dark:border-border-light dark:text-on-surface-light"
    };

    return (
        <div
            className={`rounded-md ${variantClasses[variant]} flex overflow-hidden w-full ${className}`}
        >
            {buttons.map((buttonProps, index) => {
                // Extract needed props from buttonProps
                const { children, onClick, disabled, className: btnClassName, icon, ...restProps } = buttonProps;
                
                return (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <div className="w-px bg-on-primary-dark bg-opacity-20 dark:bg-on-primary-light dark:bg-opacity-20"></div>
                        )}
                        <button
                            onClick={onClick}
                            disabled={disabled}
                            className={`flex items-center justify-center font-medium text-sm rounded-none flex-1 py-2 px-4 min-w-[80px] transition-colors ${
                                disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-10 hover:bg-[var(--color-on-primary-dark)] dark:hover:bg-[var(--color-on-primary-light)] hover:text-[var(--color-primary-light)] dark:hover:text-[var(--color-primary-dark)]'
                            } ${btnClassName || ''}`}
                            {...restProps}
                        >
                            <span className="flex-grow text-center">{children}</span>
                            {icon && <span className="ml-2 flex-shrink-0">{icon}</span>}
                        </button>
                    </React.Fragment>
                );
            })}
        </div>
    );
};
