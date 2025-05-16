import { Connection, Connections, ConnectionStatus, UserConnection } from '@/lib/types';
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
import { acceptConnection, blockConnection, declineConnection, deleteConnection, getConnectionByInitiatorAndTarget, getUserConnectionCount, getUserConnections, initiateConnection } from '@/lib/data/users';

export const ConnectionButton: React.FC<{ user_id: string, profile_user_id: string }> = ({ user_id, profile_user_id }) => {
    // Common wrapper style for consistent width
    const { openModal } = useModal();

    const [connection, setConnection] = useState<Connection | null>(null);
    const [hasConnection, setHasConnection] = useState(false);
    const [connectionState, setConnectionState] = useState<"loading" | "error" | "success">("loading");
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
    const [userRole, setUserRole] = useState<"initiator" | "target" | null>(null);

    if (user_id === profile_user_id) {
        return (<></>); // Don't show connection button for self
    }

    useEffect(() => {
        const fetchConnection = async () => {
            try {
                const response = await getConnectionByInitiatorAndTarget(user_id, profile_user_id);
                if (!response.success) {
                    setConnection(null);
                    setConnectionState("error");
                    setConnectionError(response.message);
                    return;
                }
                if (response.data === null) {
                    setConnection(null);
                    setConnectionState("success");
                    setConnectionError(null);
                    return;
                }
                setConnection(response.data);
                setConnectionStatus(response.data!.status);
                setUserRole(user_id === response.data!.initiator ? "initiator" : "target");
                setHasConnection(true);
                setConnectionState("success");
                setConnectionError(null);
            } catch (error) {
                console.error('Error fetching connection data:', error);
                setConnection(null);
                setConnectionState("error");
                setConnectionError('An error occurred while fetching connection data.');
            }
        };
        fetchConnection();
    }, [user_id, profile_user_id]);

    if (connectionState === "loading") {
        return <div className="w-[150px] sm:w-[180px] h-10 bg-gray-200 animate-pulse rounded-md" />;
    }

    if (connectionState === "error") {
        return (
            <div className="w-[150px] sm:w-[180px]">
                <Button
                    className="py-2 px-4 w-full text-sm"
                    disabled={true}
                >
                    {connectionError}
                </Button>
            </div>
        );
    }

    const initiateNewConnection = async (initiator_id: string, target_id: string) => {
        try {
            setConnectionState("loading");
            const response = await initiateConnection(initiator_id, target_id);
            if (!response.success) return;
            setConnection(response.data);
            setConnectionStatus('pending');
            setUserRole('initiator');
            setHasConnection(true);
            setConnectionState("success");
        } catch (error) {
            console.error('Error initiating connection:', error);
        }
    };

    if (!hasConnection) {
        return (
            <div className="w-[150px] sm:w-[180px]">
                <Button
                    className="py-2 px-4 w-full text-sm"
                    onClick={() => {
                        initiateNewConnection(user_id, profile_user_id);
                    }}
                    disabled={hasConnection}
                >
                    Connect
                </Button>
            </div>
        );
    }

    const updateConnectionState = (newState: ConnectionStatus) => {
        setConnection((prev) => ({
            ...prev,
            status: newState,
            id: prev!.id,
            initiator: prev!.initiator,
            target: prev!.target
        }));
    }

    const editConnection = async (connection_id: string, action: string) => {
        try {
            setConnectionState("loading");
            if (action === 'accept') {
                const response = await acceptConnection(connection_id);
                if (!response.success) return;
                updateConnectionState('accepted');
            } else if (action === 'decline') {
                const response = await declineConnection(connection_id);
                if (!response.success) return;
                updateConnectionState('declined');
            } else if (action === 'delete') {
                const response = await deleteConnection(connection_id);
                if (!response.success) return;
                setConnection(null);
                setConnectionStatus(null);
                setUserRole(null);
                setHasConnection(false);
            } else if (action === 'block') {
                const response = await blockConnection(connection_id);
                if (!response.success) return;
                updateConnectionState('blocked');
            }
            setConnectionState("success");
        } catch (error) {
            console.error('Error editing connection:', error);
        }
    };

    if (connectionStatus === 'accepted') {
        return (
            <div className="w-[150px] sm:w-[180px]">
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
                                    onClick: () => editConnection(connection!.id, 'delete'),
                                    disabled: connectionStatus !== 'accepted',
                                    className: "py-2 px-4 text-sm"
                                },
                                {
                                    children: 'Block',
                                    onClick: () => editConnection(connection!.id, 'block'),
                                    disabled: connectionStatus !== 'accepted',
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

    if (userRole === 'initiator') {
        if (connectionStatus === 'pending') {
            return (
                <div className="w-[150px] sm:w-[180px]">
                    <Button
                        className="py-2 px-4 w-full text-sm"
                        onClick={() => {
                            editConnection(connection!.id, 'delete');
                        }}
                        disabled={connectionStatus !== 'pending'}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {isHovering ? 'Cancel Request' : 'Request Sent'}
                    </Button>
                </div>
            );
        }
        if (connectionStatus === 'declined') {
            return (
                <div className="w-[150px] sm:w-[180px]">
                    <Button
                        className="py-2 px-4 w-full text-sm"
                        onClick={() => {
                            editConnection(connection!.id, 'block');
                        }}
                        disabled={connectionStatus === 'declined'}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {isHovering ? 'Block' : 'Declined'}
                    </Button>
                </div>
            );
        }
        if (connectionStatus === 'blocked') {
            return (
                <div className="w-[150px] sm:w-[180px]">
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

    if (userRole === 'target') {
        if (connectionStatus === 'pending') {
            return (
                <div className="w-[150px] sm:w-[180px]">
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
                                        onClick: () => editConnection(connection!.id, 'accept'),
                                        disabled: connectionStatus !== 'pending',
                                        className: "py-2 px-4 text-sm"
                                    },
                                    {
                                        children: 'Decline',
                                        onClick: () => editConnection(connection!.id, 'decline'),
                                        disabled: connectionStatus !== 'pending',
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
        if (connectionStatus === 'declined') {
            return (
                <div className="w-[150px] sm:w-[180px]">
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
                                        onClick: () => editConnection(connection!.id, 'accept'),
                                        disabled: connectionStatus !== 'declined',
                                        className: "py-2 px-4 text-sm"
                                    },
                                    {
                                        children: 'Block',
                                        onClick: () => editConnection(connection!.id, 'block'),
                                        disabled: connectionStatus !== 'declined',
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
        if (connectionStatus === 'blocked') {
            return (
                <div className="w-[150px] sm:w-[180px]">
                    <Button
                        className="py-2 px-4 w-full text-sm"
                        disabled={connectionStatus !== 'blocked'}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={() => {
                            editConnection(connection!.id, 'accept');
                        }}
                    >
                        {isHovering ? 'Unblock' : 'Blocked'}
                    </Button>
                </div>
            );
        }
    }
}

interface ConnectionCardProps {
    user_id: string;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ user_id }) => {

    const [connectionsCount, setConnectionsCount] = useState<number>(0);
    const [connectionsCountStatus, setConnectionsCountStatus] = useState<"loading" | "error" | "success">("loading");
    const [connectionCountError, setConnectionCountError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConnectionsCount = async () => {
            try {
                const response = await getUserConnectionCount(user_id);
                if (!response.success) {
                    setConnectionsCountStatus("error");
                    setConnectionCountError(response.message);
                    return;
                }
                setConnectionsCount(response.data!);
                setConnectionsCountStatus("success");
            } catch (error) {
                console.error('Error fetching connection:', error);
                setConnectionsCountStatus("error");
                setConnectionCountError('An error occurred while fetching connection data.');
            }
        };
        fetchConnectionsCount();
    }, [user_id]);

    return (
        <StatsCard
            title="Connections"
            value={connectionsCount}
            icon={<Users size={20} />}
            state={connectionsCountStatus}
            error={connectionCountError}
        />
    );
};

interface ConnectionTileProps {
    connection: UserConnection;
    onClose: () => void;
}

const ConnectionTile: React.FC<ConnectionTileProps> = ({ connection, onClose }) => {
    const { closeModal } = useModal();
    return (
        <Link
            key={connection.user_name}
            className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200"
            href={`/${connection.user_name}`}
            onClick={() => closeModal('connection_edit')}
        >
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
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{connection.user_name}</p>
                </div>
            </div>

            <Button icon={<ExternalLink size={16} />} width="w-40">
                View Profile
            </Button>
        </Link>
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
    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg border border-neutral-300 dark:border-neutral-600 w-full h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {connections.length > 0 ? (
                    <div className="space-y-4">
                        {connections.map((connection, index) => (
                            <ConnectionTile
                                key={index}
                                connection={connection}
                                onClose={() => { }}
                            />
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

    const { isOpen } = useModal();

    const [connections, setConnections] = useState<Connections | null>(null);
    const [connectionsState, setConnectionsState] = useState<"loading" | "error" | "success">("loading");
    const [connectionsError, setConnectionsError] = useState<string | null>(null);

    const modalOpen = isOpen('connection_edit');

    useEffect(() => {
        if (!modalOpen) {
            setConnectionsState("loading");
            setConnections(null);
            return;
        }
        const fetchConnections = async () => {
            try {
                const response = await getUserConnections(user_id);
                if (!response.success) {
                    setConnectionsState("error");
                    setConnectionsError(response.message);
                    return;
                }
                setConnections(response.data);
                setConnectionsState("success");
                setConnectionsError(null);
            } catch (error) {
                console.error('Error fetching connection:', error);
                setConnectionsState("error");
                setConnectionsError('An error occurred while fetching connection data.');
                setConnections(null);
            }
        };
        fetchConnections();
    }, [user_id, modalOpen]);

    return (
        <Modal
            tag="connection_edit"
            heading="Manage Connection"
            closable={true}
            closeButton={true}
            variant='large'
            fixedHeight={true}
        >
            {connectionsState === "loading" ? (
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md" />
            ) : connectionsState === "error" ? (
                <div className="w-full h-10 bg-red-200 rounded-md">
                    <p className="text-red-500">{connectionsError}</p>
                </div>
            ) : (
                <Tabs>
                    <Tab label='Active Connections'>
                        <ConnectionsTray
                            connections={connections!.active_connections}
                            emptyMessage="No active connection"
                        />
                    </Tab>
                    <Tab label='Incoming Requests'>
                        <ConnectionsTray
                            connections={connections!.incoming_requests}
                            emptyMessage="No incoming requests"
                        />
                    </Tab>
                    <Tab label='Outgoing Requests'>
                        <ConnectionsTray
                            connections={connections!.outgoing_requests}
                            emptyMessage="No outgoing requests"
                        />
                    </Tab>
                    <Tab label='Blocked Users'>
                        <ConnectionsTray
                            connections={connections!.blocked_users}
                            emptyMessage="No blocked users"
                        />
                    </Tab>
                </Tabs>
            )}
        </Modal>
    );
};