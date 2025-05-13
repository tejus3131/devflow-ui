import { Connection, Connections, UserConnection } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import {
    ExternalLink,
    Settings,
    Users
} from "lucide-react";
import { Button, ButtonGroup } from '@/components/Button';
import StatsCard from '@/components/StatsCard';
import Modal from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { Tab, Tabs } from '@/components/Tabs';
import Link from 'next/link';

export const ConnectionButton: React.FC<{ user_id: string, profile_user_id: string }> = ({ user_id, profile_user_id }) => {
    // Common wrapper style for consistent width
    const wrapperClass = "w-[150px] sm:w-[180px]";
    const { openModal } = useModal();

    if (user_id === profile_user_id) {
        return (
            <div className={wrapperClass}>
                <Button
                    variant="primary"
                    className="py-2 px-4 w-full text-sm"
                    onClick={() => { openModal('connection_edit') }}
                    disabled={user_id !== profile_user_id}
                >
                    Manage Connections
                </Button>
            </div>
        );
    }

    const [connection, setConnection] = useState<Connection | null | undefined>(undefined);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const fetchConnection = async () => {
            try {
                const response = await fetch(`/api/users/connections/${user_id}/${profile_user_id}`);
                if (!response.ok) {
                    throw new Error('Error fetching connection data');
                }
                const data = await response.json();
                setConnection(data.data);
            } catch (error) {
                console.error('Error fetching connection data:', error);
            }
        };
        fetchConnection();
    }, [user_id, profile_user_id]);

    if (connection === undefined) {
        return <div className={`${wrapperClass} h-10 bg-gray-200 animate-pulse rounded-md`} />;
    }

    const initiateConnection = async (initiator_id: string, target_id: string) => {
        try {
            const response = await fetch('/api/users/connections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initiator_id,
                    target_id,
                }),
            });
            if (!response.ok) {
                throw new Error('Error initiating connection');
            }
            const data = await response.json();
            setConnection(data.data);
        } catch (error) {
            console.error('Error initiating connection:', error);
        }
    };

    if (connection === null) {
        return (
            <div className={wrapperClass}>
                <Button
                    className="py-2 px-4 w-full text-sm"
                    onClick={() => {
                        initiateConnection(user_id, profile_user_id);
                    }}
                    disabled={connection !== null}
                >
                    Connect
                </Button>
            </div>
        );
    }

    const editConnection = async (connection_id: string, action: string) => {
        try {
            const response = await fetch(`/api/users/connections/${connection_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                }),
            });
            if (!response.ok) {
                throw new Error('Error editing connection');
            }
            const data = await response.json();
            if (data.success) {
                if (action === 'accept') {
                    setConnection((prev) => ({
                        ...prev,
                        status: 'accepted',
                        id: prev!.id,
                        initiator: prev!.initiator,
                        target: prev!.target
                    }));
                }
                if (action === 'decline') {
                    setConnection((prev) => ({
                        ...prev,
                        status: 'declined',
                        id: prev!.id,
                        initiator: prev!.initiator,
                        target: prev!.target,
                    }));
                }
                if (action === 'delete') {
                    setConnection(null);
                }
                if (action === 'block') {
                    setConnection((prev) => ({
                        ...prev,
                        status: 'blocked',
                        id: prev!.id,
                        initiator: prev!.initiator,
                        target: prev!.target,
                    }));
                }
            }
        } catch (error) {
            console.error('Error editing connection:', error);
        }
    };

    if (connection.status === 'accepted') {
        return (
            <div className={wrapperClass}>
                <div
                    className="relative w-full"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {isHovering ? (
                        <ButtonGroup
                            className="w-full"
                            buttons={[
                                {
                                    children: 'Disconnect',
                                    onClick: () => editConnection(connection.id, 'delete'),
                                    disabled: connection.status !== 'accepted',
                                    className: "py-2 px-4 text-sm"
                                },
                                {
                                    children: 'Block',
                                    onClick: () => editConnection(connection.id, 'block'),
                                    disabled: connection.status !== 'accepted',
                                    className: "py-2 px-4 text-sm"
                                }
                            ]}
                        />
                    ) : (
                        <Button
                            className="py-2 px-4 w-full text-sm"
                            disabled={true}
                        >
                            Connected
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    if (user_id === connection.initiator) {
        if (connection.status === 'pending') {
            return (
                <div className={wrapperClass}>
                    <Button
                        className="py-2 px-4 w-full text-sm"
                        onClick={() => {
                            editConnection(connection.id, 'delete');
                        }}
                        disabled={connection.status !== 'pending'}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {isHovering ? 'Cancel Request' : 'Request Sent'}
                    </Button>
                </div>
            );
        }
        if (connection.status === 'declined') {
            return (
                <div className={wrapperClass}>
                    <Button
                        className="py-2 px-4 w-full text-sm"
                        onClick={() => {
                            editConnection(connection.id, 'block');
                        }}
                        disabled={connection.status === 'declined'}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {isHovering ? 'Block' : 'Declined'}
                    </Button>
                </div>
            );
        }
        if (connection.status === 'blocked') {
            return (
                <div className={wrapperClass}>
                    <Button
                        className="py-2 px-4 w-full text-sm"
                        disabled={true}
                    >
                        Blocked
                    </Button>
                </div>
            );
        }
    }

    if (user_id === connection.target) {
        if (connection.status === 'pending') {
            return (
                <div className={wrapperClass}>
                    <div
                        className="relative w-full"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {isHovering ? (
                            <ButtonGroup
                                className="w-full"
                                buttons={[
                                    {
                                        children: 'Accept',
                                        onClick: () => editConnection(connection.id, 'accept'),
                                        disabled: connection.status !== 'pending',
                                        className: "py-2 px-4 text-sm"
                                    },
                                    {
                                        children: 'Decline',
                                        onClick: () => editConnection(connection.id, 'decline'),
                                        disabled: connection.status !== 'pending',
                                        className: "py-2 px-4 text-sm"
                                    }
                                ]}
                            />
                        ) : (
                            <Button
                                className="py-2 px-4 w-full text-sm"
                                disabled={true}
                            >
                                Request Received
                            </Button>
                        )}
                    </div>
                </div>
            );
        }
        if (connection.status === 'declined') {
            return (
                <div className={wrapperClass}>
                    <div
                        className="relative w-full"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {isHovering ? (
                            <ButtonGroup
                                className="w-full"
                                buttons={[
                                    {
                                        children: 'Accept',
                                        onClick: () => editConnection(connection.id, 'accept'),
                                        disabled: connection.status !== 'declined',
                                        className: "py-2 px-4 text-sm"
                                    },
                                    {
                                        children: 'Block',
                                        onClick: () => editConnection(connection.id, 'block'),
                                        disabled: connection.status !== 'declined',
                                        className: "py-2 px-4 text-sm"
                                    }
                                ]}
                            />
                        ) : (
                            <Button
                                className="py-2 px-4 w-full text-sm"
                                disabled={true}
                            >
                                Request Declined
                            </Button>
                        )}
                    </div>
                </div>
            );
        }
        if (connection.status === 'blocked') {
            return (
                <div className={wrapperClass}>
                    <Button
                        className="py-2 px-4 w-full text-sm"
                        disabled={connection.status !== 'blocked'}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={() => {
                            editConnection(connection.id, 'accept');
                        }}
                    >
                        {isHovering ? 'Unblock' : 'Blocked'}
                    </Button>
                </div>
            );
        }
    }

    return null;
}

interface ConnectionCardProps {
    user_id: string;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ user_id }) => {

    const [connections, setConnections] = useState<number | null>(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await fetch(`/api/users/connections?user_id=${user_id}&count=true`);
                if (!response.ok) {
                    throw new Error('Error fetching connections');
                }
                const data = await response.json();
                setConnections(data.data);
            } catch (error) {
                console.error('Error fetching connections:', error);
            }
        };
        fetchConnections();
    }, [user_id]);

    return (
        <StatsCard
            title="Connections"
            value={connections !== null ? connections : 'Loading...'}
            icon={<Users size={20} />}
        />
    );
};

interface ConnectionsTrayProps {
    connections: UserConnection[];
    emptyMessage: string;
}

const ConnectionsTray: React.FC<ConnectionsTrayProps> = ({
    connections,
    emptyMessage
}) => {
    const { closeModal } = useModal();
    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg border border-neutral-300 dark:border-neutral-600 w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {connections.length > 0 ? (
                    <div className="space-y-4">
                        {connections.map((connection, index) => (
                            <Link key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200" href={`/${connection.user_name}/profile`} onClick={() => closeModal('connection_edit')}>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={connection.avatar_url}
                                            alt={`${connection.full_name}'s avatar`}
                                            className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-blue-600 dark:border-purple-600"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800"></div>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-black dark:text-white text-lg tracking-tight">{connection.full_name}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-300">@{connection.user_name}</p>
                                    </div>
                                </div>

                                <Button icon={<ExternalLink size={16} />} width="w-40">
                                    View Profile
                                </Button>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">{emptyMessage}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


interface ConnectionManagerProps {
    user_id: string;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
    user_id
}) => {

    const [connections, setConnections] = useState<Connections | null>(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await fetch(`/api/users/connections?user_id=${user_id}&count=false`);
                if (!response.ok) {
                    throw new Error('Error fetching connections');
                }
                const data = await response.json();
                console.log(`Data fetched: ${JSON.stringify(data)}`);
                setConnections(data.data);
            } catch (error) {
                console.error('Error fetching connections:', error);
            }
        };
        fetchConnections();
    }, [user_id]);

    return (
        <Modal
            tag="connection_edit"
            heading="Manage Connection"
            closable={true}
            closeButton={true}
            variant='large'
            fixedHeight={true}
        >
            {connections === null ? (
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md" />
            ) : (

                <Tabs>
                    <Tab label='Active Connections'>
                        <ConnectionsTray
                            connections={connections.active_connections}
                            emptyMessage="No active connections"
                        />
                    </Tab>
                    <Tab label='Incoming Requests'>
                        <ConnectionsTray
                            connections={connections.incoming_requests}
                            emptyMessage="No incoming requests"
                        />
                    </Tab>
                    <Tab label='Outgoing Requests'>
                        <ConnectionsTray
                            connections={connections.outgoing_requests}
                            emptyMessage="No outgoing requests"
                        />
                    </Tab>
                    <Tab label='Blocked Users'>
                        <ConnectionsTray
                            connections={connections.blocked_users}
                            emptyMessage="No blocked users"
                        />
                    </Tab>
                </Tabs>
            )}
        </Modal>
    );
};