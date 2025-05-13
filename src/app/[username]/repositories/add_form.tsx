'use client';
import Modal from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { useUser } from '@/hooks/useUser';
import { RepositoryDetail } from '@/lib/types';
import React, { useState } from 'react';

interface RepositoryFormProps {
    initialValues?: {
        name: string;
        description: string;
        tags: string[];
    };
    onSuccess?: (repository: RepositoryDetail) => void;
    usedNames: string[];
}

export const RepositoryForm: React.FC<RepositoryFormProps> = ({
    initialValues = { name: '', description: '', tags: [] },
    onSuccess,
    usedNames
}) => {
    const [formData, setFormData] = useState(initialValues);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [tagInput, setTagInput] = useState('');
    const { closeModal } = useModal();
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="text-red-500 dark:text-red-400">
                <p>Loading user data...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-red-500 dark:text-red-400">
                <p>User not found. Please log in.</p>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when typing in the name field
        if (name === 'name' && error) {
            setError(null);
        }
    };

    const validateName = (name: string): string | null => {
        if (name.trim() === '') {
            return 'Repository name cannot be empty';
        }

        if (usedNames.includes(name)) {
            return 'Repository name is already in use';
        }

        const validNamePattern = /^[a-z0-9-]+$/;
        if (!validNamePattern.test(name)) {
            return 'Repository name can only contain lowercase letters, numbers, and hyphens';
        }

        return null;
    };

    const handleAddTag = () => {
        if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const nameError = validateName(formData.name);
        if (nameError) {
            setError(nameError);
            return;
        }

        setProcessing(true);
        setError(null);
        setSuccess(false);

        fetch('/api/repositories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                name: formData.name,
                description: formData.description,
                tags: formData.tags
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        closeModal('repository_form');
                        setSuccess(false);
                        setError(null);
                        if (onSuccess) {
                            onSuccess(data.data);
                        }
                    }, 1000);
                } else {
                    setError(data.message || 'Failed to create repository');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.message || 'Failed to create repository');
            })
            .finally(() => {
                setProcessing(false);
            });
    };


    return (
        <Modal
            tag="repository_form"
            heading="Create New Repository"
            closable={!processing}
            closeButton={false}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                        Repository Name
                    </label>
                    <div className="relative">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter repository name (lowercase, numbers, hyphens only)"
                            disabled={processing || success}
                            className={`
                                w-full rounded-lg px-4 py-3 
                                bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                                border ${error && error.includes('Repository name')
                                    ? 'border-red-500 dark:border-red-400'
                                    : success
                                        ? 'border-green-500 dark:border-green-400'
                                        : 'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'
                                }
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
                                outline-none transition duration-200
                                ${processing ? 'opacity-70' : ''}
                            `}
                        />
                    </div>
                    {formData.name && !error && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {usedNames.includes(formData.name)
                                ? <span className="text-red-500 dark:text-red-400">Name already in use</span>
                                : !/^[a-z0-9-]+$/.test(formData.name)
                                    ? <span className="text-yellow-500 dark:text-yellow-400">Only lowercase letters, numbers, and hyphens allowed</span>
                                    : <span className="text-green-500 dark:text-green-400">Name available ✓</span>
                            }
                        </p>
                    )}
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter repository description"
                        disabled={processing || success}
                        rows={3}
                        className={`
                            w-full rounded-lg px-4 py-3 
                            bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                            border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
                            outline-none transition duration-200
                            ${processing ? 'opacity-70' : ''}
                        `}
                    />
                </div>

                {/* Tags Input */}
                <div className="space-y-2">
                    <label htmlFor="tags" className="block text-sm font-medium">
                        Tags
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            id="tags"
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add tags"
                            disabled={processing || success}
                            className={`
                                flex-grow rounded-lg px-4 py-3 
                                bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                                border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
                                outline-none transition duration-200
                                ${processing ? 'opacity-70' : ''}
                            `}
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            disabled={processing || success || tagInput.trim() === ''}
                            className="px-4 py-3 rounded-lg text-sm font-medium
                                bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                                text-white transition-colors duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add
                        </button>
                    </div>

                    {/* Display Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm"
                            >
                                <span>{tag}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    disabled={processing || success}
                                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1 animate-fadeIn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="text-sm text-green-500 dark:text-green-400 flex items-center space-x-1 animate-fadeIn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Repository created successfully!</span>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => closeModal('repository_form')}
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
                        disabled={processing || success || !!validateName(formData.name)}
                        className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center
                            transition-all duration-200
                            ${processing || success || !!validateName(formData.name)
                                ? 'bg-blue-400 dark:bg-blue-500 opacity-70 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }
                            text-white shadow-sm
                        `}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Creating...</span>
                            </div>
                        ) : success ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Created</span>
                            </div>
                        ) : (
                            <span>Create Repository</span>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};