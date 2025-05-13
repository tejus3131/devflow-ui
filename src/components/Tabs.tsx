import React, { useState, useRef, useEffect } from 'react';

interface TabProps {
    label: string;
    children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
    return <div className='w-full rounded-md p-4'>{children}</div>;
};

interface TabsProps {
    children: React.ReactElement<TabProps>[];
    defaultTab?: number;
    variant?: 'primary' | 'secondary';
}

const Tabs: React.FC<TabsProps> = ({ children, defaultTab = 0, variant = 'primary' }) => {
    const [activeTabIndex, setActiveTabIndex] = useState(defaultTab);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    
    // Initialize the tab refs array
    useEffect(() => {
        tabRefs.current = tabRefs.current.slice(0, children.length);
    }, [children.length]);
    
    // Update the indicator position when active tab changes
    useEffect(() => {
        const activeTab = tabRefs.current[activeTabIndex];
        if (activeTab) {
            // Get the parent container's padding if any
            const parentPadding = parseInt(window.getComputedStyle(activeTab.parentElement || document.body).paddingLeft) || 0;
            
            // Calculate exact position accounting for any margins or borders
            setIndicatorStyle({
                left: activeTab.offsetLeft - parentPadding,
                width: activeTab.offsetWidth
            });
        }
    }, [activeTabIndex]);

    // Handle window resize to update indicator position
    useEffect(() => {
        const handleResize = () => {
            const activeTab = tabRefs.current[activeTabIndex];
            if (activeTab) {
                // Get the parent container's padding if any
                const parentPadding = parseInt(window.getComputedStyle(activeTab.parentElement || document.body).paddingLeft) || 0;
                
                // Calculate exact position accounting for any margins or borders
                setIndicatorStyle({
                    left: activeTab.offsetLeft - parentPadding,
                    width: activeTab.offsetWidth
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeTabIndex]);

    // Style variants
    const variantStyles = {
        primary: {
            container: "bg-gray-800 rounded-lg p-0.5",
            indicator: "bg-gradient-to-r from-blue-600 to-purple-600",
            tab: "text-gray-300 hover:text-white",
            activeTab: "text-white"
        },
        secondary: {
            container: "border-b border-gray-200",
            indicator: "bg-blue-600",
            tab: "text-gray-500 hover:text-gray-700",
            activeTab: "text-blue-600"
        }
    };
    
    const styles = variantStyles[variant];

    return (
        <div className="w-full">
            <div className={`relative w-full flex ${styles.container}`}>
                {React.Children.map(children, (child, index) => {
                    return (
                        <button
                            ref={el => {tabRefs.current[index] = el}}
                            key={index}
                            className={`flex-1 py-2 px-4 text-center text-sm font-medium transition-colors duration-200 z-10 
                                ${activeTabIndex === index ? styles.activeTab : styles.tab}`}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {child.props.label}
                        </button>
                    );
                })}
                
                {/* Animated indicator */}
                <div 
                    className={`absolute bottom-0 h-full rounded-md transition-all duration-300 ease-in-out ${styles.indicator} z-0`}
                    style={{
                        transform: `translateX(${indicatorStyle.left}px)`,
                        width: indicatorStyle.width,
                        opacity: variant === 'primary' ? 1 : 0
                    }}
                />
                
                {/* Bottom indicator for secondary variant */}
                {variant === 'secondary' && (
                    <div 
                        className={`absolute bottom-0 h-0.5 transition-all duration-300 ease-in-out ${styles.indicator}`}
                        style={{
                            transform: `translateX(${indicatorStyle.left}px)`,
                            width: indicatorStyle.width
                        }}
                    />
                )}
            </div>
            
            <div className="tab-content py-4 animate-fadeIn">
                {children[activeTabIndex]}
            </div>
        </div>
    );
};

export { Tabs, Tab };