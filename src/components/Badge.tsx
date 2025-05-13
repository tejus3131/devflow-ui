import { BadgeDetail } from '@/lib/types';
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

    useEffect(() => {
        // Fetch badge data from the server
        const fetchBadge = async () => {
            try {
                const response = await fetch(`/api/users/badges/${badge_id}`);
                const data = await response.json();
                setBadge(data.data);
                console.log('Badge data:', data);
            } catch (error) {
                console.error('Error fetching badge:', error);
            }
        };

        fetchBadge();
    }, [badge_id]);

    if (!badge) {
        return <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>;
    }

    const { name, description, image_url } = badge;
    const size = 32; // Size of the badge in pixels
    const className = "cursor-pointer transition-transform duration-200 transform hover:scale-105";

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ width: size, height: size }}
        >
            {/* Circular Badge */}
            <Image 
                width={size}
                height={size}
                src={image_url}
                alt={name}
                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
            
            {/* Hover Information */}
            {isHovering && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap z-10">
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-gray-300">{description}</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                </div>
            )}
        </div>
    );
};

const BadgeTray: React.FC<{ user_id: string }> = ({ user_id }) => {

    const [badges, setBadges] = useState<string[] | null>(null);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await fetch('/api/users/badges', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id }),
                });
                const data = await response.json();
                setBadges(data.data);
            } catch (error) {
                console.error('Error fetching badges:', error);
            }
        };

        fetchBadges();
    }, [user_id]);

    if (badges === null) {
        return <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>;
    }

    return (
        <div className="flex space-x-3 space-y-6 flex-wrap">
            {badges.map((badge_id) => (
                <Badge key={badge_id} badge_id={badge_id} />
            ))}
        </div>
    );
}

export default BadgeTray;