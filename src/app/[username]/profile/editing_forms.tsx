'use client';
import Modal from '@/components/Modal';
import { useModal } from '@/hooks/useModal';
import { useUser } from '@/hooks/useUser';
import React, { useEffect, useState } from 'react';

interface FullNameFormsProps {
    initialValue: string;
    setNewFullName: (newFullName: string) => void;
    userId: string;
}

export const FullNameForm: React.FC<FullNameFormsProps> = ({
    initialValue,
    setNewFullName,
    userId
}) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { closeModal } = useModal();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') {
            setError('Full name cannot be empty');
            return;
        }
        setProcessing(true);
        setError(null);
        setSuccess(false);

        fetch('/api/users/fullname', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, full_name: inputValue }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update full name');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        setNewFullName(inputValue);
                        closeModal('full_name_edit');
                        setSuccess(false);
                        setError(null);
                    }, 1000);
                } else {
                    setError(data.message || 'Failed to update full name');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.message || 'Failed to update full name');
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <Modal
            tag="full_name_edit"
            heading="Update Your Full Name"
            closable={!processing}
            closeButton={false}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">

                    <div className="relative">
                        <input
                            id="fullName"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter your full name"
                            disabled={processing || success}
                            className={`
                                w-full rounded-lg px-4 py-3 
                                bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                                border ${error
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

                        {processing && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="h-5 w-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {success && !processing && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
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

                    {success && (
                        <div className="text-sm text-green-500 dark:text-green-400 flex items-center space-x-1 animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Full name updated successfully!</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => closeModal('full_name_edit')}
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
                        disabled={processing || success}
                        className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center
                            transition-all duration-200
                            ${processing || success
                                ? 'bg-blue-400 dark:bg-blue-500 opacity-70 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }
                            text-white
                            shadow-sm
                        `}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Saving...</span>
                            </div>
                        ) : success ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Saved</span>
                            </div>
                        ) : (
                            <span>Save</span>
                        )}
                    </button>
                </div>
            </form >
        </Modal >
    );
};

interface EmailFormsProps {
    initialValue: string;
    fullName: string;
    setNewEmail: (newEmail: string) => void;
    userId: string;
}

export const EmailForm: React.FC<EmailFormsProps> = ({
    initialValue,
    setNewEmail,
    userId,
    fullName
}) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const [otpValue, setOtpValue] = useState('');
    const [processing, setProcessing] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState(false);
    const { closeModal } = useModal();
    const [otpId, setOtpId] = useState<string | null>(null);
    const [otpResent, setOtpResent] = useState(false);


    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') {
            setError('Email cannot be empty');
            return;
        }
        if (inputValue === initialValue) {
            setError('New email cannot be the same as the current email');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
            setError('Please enter a valid email address');
            return;
        }
        setProcessing(true);
        setError(null);

        fetch('/api/users/email/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: inputValue, full_name: fullName }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to send OTP');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setOtpSent(true);
                    setError(null);
                    setOtpId(data.data);
                    console.log('OTP sent successfully:', data.data);
                } else {
                    setError(data.message || 'Failed to send OTP');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.message || 'Failed to send OTP');
            })
            .finally(() => {
                setProcessing(false);
            });
    };
    
    const handleResendOtp = () => {
        if (!otpId) {
            setError('Cannot resend OTP. Please try again.');
            return;
        }
        
        setResending(true);
        setError(null);

        fetch('/api/users/email/resend-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp_id: otpId }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to resend OTP');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setError(null);
                    setOtpId(data.data);
                    setOtpResent(true);
                    setTimeout(() => {
                        setOtpResent(false);
                    }, 3000); // Reset after 3 seconds
                    console.log('OTP resent successfully:', data.data);
                } else {
                    setError(data.message || 'Failed to resend OTP');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.message || 'Failed to resend OTP');
            })
            .finally(() => {
                setResending(false);
            });
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        setSuccess(false);

        fetch('/api/users/email/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, email: inputValue, otp: otpValue }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((res) => {
                        throw new Error(res.message || 'Failed to verify email');
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        setNewEmail(inputValue);
                        closeModal('email_edit');
                        setOtpValue('');
                        setSuccess(false);
                        setError(null);
                        setOtpSent(false);
                    }, 1000);
                } else {
                    setError(data.message || 'Failed to verify email');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.message || 'Failed to verify email');
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleOtpChange = (value: string) => {
        if (!/^\d*$/.test(value)) {
            setError('OTP must contain only digits');
            return;
        }
        if (value.length > 6) {
            setError('OTP cannot be more than 6 digits');
            return;
        }
        setError(null);
        setOtpValue(value);
    };
    
    useEffect(() => {
        if (otpValue.length === 6) {
            const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
            handleVerifyOtp(syntheticEvent);
        }
    }, [otpValue]);

    return (
        <Modal
            tag="email_edit"
            heading="Update Your Email"
            closable={!processing}
            closeButton={false}
        >
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
                <div className="space-y-2">

                    <div className="relative">
                        <input
                            id="email"
                            type="email"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter your email"
                            disabled={processing || otpSent}
                            className={`
                                w-full rounded-lg px-4 py-3 
                                bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                                border ${error
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

                        {processing && !otpSent && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="h-5 w-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {otpSent && (
                        <div className="mt-4 space-y-2">
                            <div className="relative">
                                <input
                                    id="otp"
                                    type="text"
                                    value={otpValue}
                                    onChange={(e) => handleOtpChange(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    disabled={processing || success}
                                    className={`
                                        w-full rounded-lg px-4 py-3 
                                        bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                                        border ${error
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

                                {processing && otpSent && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="h-5 w-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}

                                {success && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            
                            {/* Resend OTP button */}
                            <div className="flex justify-end">
                                <button 
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resending || processing || success}
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    {resending ? (
                                        <span className="flex items-center space-x-1">
                                            <div className="h-3 w-3 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Resending...</span>
                                        </span>
                                    ) : otpResent ? (
                                        <span>Resent successfully!</span>
                                    ) : (
                                        <span>Resend code</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error message with animation */}
                    {error && (
                        <div className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1 animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success message with animation */}
                    {success && (
                        <div className="text-sm text-green-500 dark:text-green-400 flex items-center space-x-1 animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Email updated successfully!</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => closeModal('email_edit')}
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
                        disabled={processing || success || (otpSent && otpValue.length === 0)}
                        className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center
                            transition-all duration-200
                            ${processing || success
                                ? 'bg-blue-400 dark:bg-blue-500 opacity-70 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }
                            text-white
                            shadow-sm
                        `}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>{otpSent ? 'Verifying...' : 'Sending...'}</span>
                            </div>
                        ) : success ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Saved</span>
                            </div>
                        ) : (
                            <span>{otpSent ? 'Verify' : 'Send Code'}</span>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

interface UserNameFormProps {
    initialValue: string;
    setNewUserName: (newUserName: string) => void;
    userId: string;
}

export const UserNameForm: React.FC<UserNameFormProps> = ({
    initialValue,
    setNewUserName,
    userId
}) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { closeModal } = useModal();
    const { reloadUser } = useUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') {
            setError('Username cannot be empty');
            return;
        }
        if (inputValue === initialValue) {
            setError('New username cannot be the same as the current username');
            return;
        }
        if (inputValue.length < 3 || inputValue.length > 20) {
            setError('Username must be between 3 and 20 characters');
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(inputValue)) {
            setError('Username can only contain letters, numbers, and underscores');
            return;
        }
        setProcessing(true);
        setError(null);
        setSuccess(false);

        fetch('/api/users/username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, username: inputValue }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update username');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        setNewUserName(inputValue);
                        closeModal('user_name_edit');
                        setSuccess(false);
                        setError(null);
                        reloadUser();
                    }, 1000);
                } else {
                    setError(data.message || 'Failed to update username');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.message || 'Failed to update username');
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <Modal
            tag="user_name_edit"
            heading="Update Your Username"
            closable={!processing}
            closeButton={false}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">

                    <div className="relative">
                        <input
                            id="userName"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter your username"
                            disabled={processing || success}
                            className={`
                w-full rounded-lg px-4 py-3 
                bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                border ${error
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

                        {/* Status indicators */}
                        {processing && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="h-5 w-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {success && !processing && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Error message with animation */}
                    {error && (
                        <div className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-1 animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success message with animation */}
                    {success && (
                        <div className="text-sm text-green-500 dark:text-green-400 flex items-center space-x-1 animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Username updated successfully!</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => closeModal('user_name_edit')}
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
                        disabled={processing || success}
                        className={`
              flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center
              transition-all duration-200
              ${processing || success
                                ? 'bg-blue-400 dark:bg-blue-500 opacity-70 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }
              text-white
              shadow-sm
            `}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Saving...</span>
                            </div>
                        ) : success ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Saved</span>
                            </div>
                        ) : (
                            <span>Save</span>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

interface AvatarFormProps {
    userId: string;
    onAvatarUpdate: (newUrl: string) => void;
    initialUrl?: string;
}

export const AvatarForm: React.FC<AvatarFormProps> = ({
    userId,
    onAvatarUpdate,
    initialUrl
}) => {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { closeModal } = useModal();
    const { reloadUser } = useUser();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, or WEBP only)');
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setError('Image size should be less than 2MB');
            return;
        }

        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileInputRef.current?.files?.[0];

        if (!file) {
            setError('Please select an image to upload');
            return;
        }

        setProcessing(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('file', file);

        try {
            const response = await fetch('/api/users/avatar', {
                method: 'PUT',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update avatar');
            }

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    reloadUser();
                    onAvatarUpdate(data.data);
                    closeModal('avatar_edit');
                    setSuccess(false);
                    setError(null);
                    setPreviewUrl(null);
                }, 1000);
            } else {
                setError(data.message || 'Failed to update avatar');
            }
        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || 'Failed to update avatar');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal
            tag="avatar_edit"
            heading="Update Your Profile Picture"
            closable={!processing}
            closeButton={false}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Avatar preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            {processing && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="h-8 w-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        id="avatar"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        disabled={processing || success}
                        className="hidden"
                    />

                    <div className="flex justify-center">
                        <label
                            htmlFor="avatar"
                            className={`
                                inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                                ${processing || success
                                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer'
                                }
                                text-gray-700 dark:text-gray-200
                                transition-colors duration-200
                            `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            {previewUrl ? 'Change Image' : 'Choose Image'}
                        </label>
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
                            <span>Avatar updated successfully!</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => closeModal('avatar_edit')}
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
                        disabled={processing || success || !previewUrl}
                        className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center
                            transition-all duration-200
                            ${processing || success || !previewUrl
                                ? 'bg-blue-400 dark:bg-blue-500 opacity-70 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }
                            text-white
                            shadow-sm
                        `}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Uploading...</span>
                            </div>
                        ) : success ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Saved</span>
                            </div>
                        ) : (
                            <span>Upload</span>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};


interface BioFormsProps {
    initialValue: string;
    setNewBio: (newBio: string) => void;
    userId: string;
}

export const BioForm: React.FC<BioFormsProps> = ({
    initialValue,
    setNewBio,
    userId
}) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { closeModal } = useModal();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') {
            setError('Full name cannot be empty');
            return;
        }
        setProcessing(true);
        setError(null);
        setSuccess(false);

        fetch('/api/users/bio', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, bio: inputValue }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update bio');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setSuccess(true);
                    setTimeout(() => {
                        setNewBio(inputValue);
                        closeModal('bio_edit');
                        setSuccess(false);
                        setError(null);
                    }, 1000);
                } else {
                    setError(data.message || 'Failed to update bio');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError(error.message || 'Failed to update bio');
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <Modal
            tag="bio_edit"
            heading="Update Your Bio"
            closable={!processing}
            closeButton={false}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">

                    <div className="relative">
                        <textarea
                            id="bio"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter your bio"
                            disabled={processing || success}
                            rows={4}
                            className={`
                                w-full rounded-lg px-4 py-3 
                                bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                                border ${error
                                    ? 'border-red-500 dark:border-red-400'
                                    : success
                                        ? 'border-green-500 dark:border-green-400'
                                        : 'border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]'
                                }
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
                                outline-none transition duration-200
                                ${processing ? 'opacity-70' : ''}
                                resize-none
                            `}
                        />

                        {processing && (
                            <div className="absolute right-3 top-3 transform">
                                <div className="h-5 w-5 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {success && !processing && (
                            <div className="absolute right-3 top-3 transform text-green-500 dark:text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
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

                    {success && (
                        <div className="text-sm text-green-500 dark:text-green-400 flex items-center space-x-1 animate-fadeIn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Bio updated successfully!</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => closeModal('full_name_edit')}
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
                        disabled={processing || success}
                        className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center
                            transition-all duration-200
                            ${processing || success
                                ? 'bg-blue-400 dark:bg-blue-500 opacity-70 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }
                            text-white
                            shadow-sm
                        `}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Saving...</span>
                            </div>
                        ) : success ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Saved</span>
                            </div>
                        ) : (
                            <span>Save</span>
                        )}
                    </button>
                </div>
            </form >
        </Modal >
    );
};