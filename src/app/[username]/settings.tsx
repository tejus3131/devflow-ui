'use client';
import Modal from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import React, { useEffect, useState } from 'react';
import { getAuthJWT } from '@/lib/utils';
import { getRepositoriesCountByUserId } from '@/lib/data/repositories';
import StatsCard from '@/components/StatsCard';
import { Folder, LogOut, Settings, UserRoundX, Users } from 'lucide-react';

interface DeleteAccountProps {
    username: string;
    onAccountDeleted: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountProps> = ({
    username,
    onAccountDeleted
}) => {
    const [inputValue, setInputValue] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { closeModal } = useModal();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue !== username) {
            setError(`You must type ${username} to confirm.`);
            return;
        }
        setProcessing(true);
        setError(null);

        try {
            const auth_token = getAuthJWT();
            if (!auth_token) {
                setError('You must be logged in to delete your account.');
                return;
            }
            const response = await fetch(`/api/users/${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth_token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to delete account. Please try again.');
                return;
            }
            const data = await response.json();
            if (!data.success) {
                setError(data.message || 'Failed to delete account. Please try again.');
                return;
            }
            onAccountDeleted();
            closeModal('delete_account');
        } catch (error) {
            console.error('Error deleting account:', error);
            setError('Failed to delete account. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal
            tag="delete_account"
            heading="Delete Your Account"
            closable={!processing}
            closeButton={false}
        >
            <form onSubmit={handleDelete} className="space-y-6">
                <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        To confirm account deletion, type <strong>{username}</strong> in the field below. This action cannot be undone.
                    </p>
                    <div className="relative">
                        <input
                            id="confirmDelete"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={`Type ${username} to confirm`}
                            disabled={processing}
                            className={`
                                w-full rounded-lg px-4 py-3 
                                bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                                border ${error
                                    ? 'border-red-500 dark:border-red-400'
                                    : 'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'
                                }
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
                                outline-none transition duration-200
                                ${processing ? 'opacity-70' : ''}
                            `}
                        />
                        {processing && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="h-5 w-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    {error && (
                        <div className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1 animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => closeModal('delete_account')}
                        disabled={processing}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center
                            bg-transparent border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]
                            text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]
                            hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)] 
                            transition-colors duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing || inputValue !== username}
                        className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center
                            transition-all duration-200
                            ${processing || inputValue !== username
                                ? 'bg-red-400 dark:bg-red-500 opacity-70 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
                            }
                            text-white
                            shadow-sm
                        `}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Deleting...</span>
                            </div>
                        ) : (
                            <span>Delete</span>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};




interface RepositoriesCardProps {
    user_id: string;
}

export const RepositoriesCard: React.FC<RepositoriesCardProps> = ({ user_id }) => {

    const [repositoriesCount, setRepositoriesCount] = useState<number>(0);
    const [repositoriesCountStatus, setRepositoriesCountStatus] = useState<"loading" | "error" | "success">("loading");
    const [repositoriesCountError, setRepositoriesCountError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepositoriesCount = async () => {
            try {
                const response = await getRepositoriesCountByUserId(user_id);
                if (!response.success) {
                    setRepositoriesCountStatus("error");
                    setRepositoriesCountError(response.message);
                    return;
                }
                setRepositoriesCount(response.data!);
                setRepositoriesCountStatus("success");
            } catch (error) {
                console.error('Error fetching repositories:', error);
                setRepositoriesCountStatus("error");
                setRepositoriesCountError('An error occurred while fetching repositories data.');
            }
        };
        fetchRepositoriesCount();
    }, [user_id]);

    return (
        <StatsCard
            title="Repositories"
            value={repositoriesCount}
            icon={<Folder size={20} />}
            state={repositoriesCountStatus}
            error={repositoriesCountError}
        />
    );
};

interface SettingsMenuProps {
    onSignOut: () => void;
    onAccountDelete: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ onSignOut, onAccountDelete }) => {
    const { openModal } = useModal();

    return (
        <div className="w-full md:w-1/3 space-y-6">
            {/* Settings Panel */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-300 dark:border-border-dark p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings size={18} className="text-primary-light dark:text-primary-dark" />
                    Settings
                </h2>
                <ul className="space-y-1">
                    <li>
                        <div
                            className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            onClick={() => openModal('connection_edit')}
                        >
                            <Users
                                className="text-on-muted-light dark:text-on-muted-dark"
                                size={18}
                            />
                            <span>Manage Connections</span>
                        </div>
                    </li>
                    <li>
                        <button
                            onClick={onSignOut}
                            className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                        >
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={onAccountDelete}
                            className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                        >
                            <UserRoundX size={18} />
                            <span>Delete Account</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}