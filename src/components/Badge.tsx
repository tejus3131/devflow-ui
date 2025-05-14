import { getBadgeById, getUserBadges } from '@/lib/data/users';
import { BadgeDetail } from '@/lib/types';
import { CircleX } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface BadgeProps {
    badge_id: string;
}

const Badge: React.FC<BadgeProps> = ({
    badge_id
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [badge, setBadge] = useState<BadgeDetail | null>(null);
    const [badgeState, setBadgeState] = useState<"loading" | "error" | "success">("loading");
    const [badgeError, setBadgeError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBadge = async () => {
            try {
                const response = await getBadgeById(badge_id);
                if (!response.success) {
                    setBadgeState("error");
                    setBadgeError(response.message);
                    setBadge(null);
                    return;
                }
                setBadge(response.data);
                setBadgeState("success");
                setBadgeError(null);
            } catch (error: any) {
                console.error('Error fetching badge:', error);
                setBadgeState("error");
                setBadgeError(error.message);
            }
        };
        fetchBadge();
    }, [badge_id]);

    if (badgeState === "loading") {
        return <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>;
    }
    if (badgeState === "error") {
        return (
            <div
                className="relative inline-block cursor-pointer transition-transform duration-200 transform hover:scale-105"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{ width: 32, height: 32 }}
            >
                {/* Circular Badge */}
                <CircleX
                    className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    size={24}
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Hover Information */}
                {isHovering && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap z-10">
                        <div className="font-medium">Error</div>
                        <div className="text-xs text-gray-300">{badgeError}</div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                    </div>
                )}
            </div>);
    }
    return (
        <div
            className="relative inline-block cursor-pointer transition-transform duration-200 transform hover:scale-105"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ width: 32, height: 32 }}
        >
            {/* Circular Badge */}
            <Image
                width={32}
                height={32}
                src={badge!.image_url}
                alt={badge!.name}
                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />

            {/* Hover Information */}
            {isHovering && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap z-10">
                    <div className="font-medium">{badge!.name}</div>
                    <div className="text-xs text-gray-300">{badge!.description}</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                </div>
            )}
        </div>
    );
};

const BadgeTray: React.FC<{ user_id: string }> = ({ user_id }) => {

    const [badges, setBadges] = useState<string[] | null>(null);
    const [badgeTrayState, setBadgeTrayState] = useState<"loading" | "error" | "success">("loading");
    const [badgeTrayError, setBadgeTrayError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await getUserBadges(user_id);
                if (!response.success) {
                    setBadgeTrayState("error");
                    setBadgeTrayError(response.message);
                    setBadges(null);
                    return;
                }
                setBadges(response.data);
                setBadgeTrayState("success");
                setBadgeTrayError(null);
            } catch (error: any) {
                console.error('Error fetching badges:', error);
                setBadgeTrayState("error");
                setBadgeTrayError(error.message);
            }
        };
        fetchBadges();
    }, [user_id]);

    if (badgeTrayState === "loading") {
        return <div className="flex space-x-3 space-y-6 flex-wrap">
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
        </div>;
    }
    if (badgeTrayState === "error") {
        return (
            <>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-200 rounded-full">
                        <CircleX
                            className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            size={24}
                            strokeWidth={2}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </div>
                    <span className="text-sm sm:text-base text-on-surface-light dark:text-on-accent-dark">
                        {badgeTrayError}
                    </span>
                </div>
            </>
        );
    }
    return (
        <div className="flex space-x-3 space-y-6 flex-wrap">
            {badges!.map((badge_id) => (
                <Badge key={badge_id} badge_id={badge_id} />
            ))}
        </div>
    );
}

export default BadgeTray;