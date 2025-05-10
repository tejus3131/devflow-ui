import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    href?: string;
    className?: string;
    icon?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    href,
    className = '',
    icon,
    onClick,
    ...props
}) => {
    const baseClasses = "rounded-md transition-colors flex items-center justify-center font-medium text-sm  w-full sm:w-auto";
    
    const variantClasses = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white gap-2 hover:from-blue-700 hover:to-purple-700",
        secondary: "border border-solid border-gray-700 text-gray-100"
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    const content = (
        <>
            {children}
            {icon && <span className="ml-2">{icon}</span>}
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                className={combinedClasses}
                onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
                {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}
            >
                {content}
            </a>
        );
    }

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

export default Button;
