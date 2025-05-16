'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    ArrowLeft,
    Trash2,
} from 'lucide-react';
import { Check, Clock, FileText, ImageIcon, Paperclip, Send, Smile, X } from 'lucide-react';
import Image from 'next/image';
import { Message, MessageGroupType, UserConnection } from '@/lib/types';
import Link from 'next/link';
import { addNewMessage, deleteChat, listenToChatEvent, loadChats, unsubscribeFromChatEvent } from '@/lib/data/messages';


type ChatHeaderProps = {
    avatar_url: string;
    full_name: string;
    user_name: string;
    onQuit: () => void;
    onlineUsers: string[];
};

const ChatHeader: React.FC<ChatHeaderProps> = ({
    avatar_url,
    full_name,
    user_name,
    onQuit,
    onlineUsers
}) => {

    const isOnline = onlineUsers.includes(user_name);

    return (
        <div className="px-4 py-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] flex justify-between items-center shadow-sm bg-[var(--color-background-light)] dark:bg-[var(--color-surface-dark)]">
            <Link className="flex items-center space-x-3" href={`/${user_name}`}>
                <button className="md:hidden text-gray-600 dark:text-[var(--color-on-surface-dark)]">
                    <ArrowLeft size={20} />
                </button>
                <Image
                    src={avatar_url}
                    alt={`${full_name}'s avatar`}
                    className={`w-10 h-10 rounded-full border-2 ${isOnline ? 'border-green-500' : 'border-gray-500'}`}
                    width={40}
                    height={40}
                />
                <div>
                    <p className="text-sm font-semibold text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]">
                        {full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[var(--color-on-surface-dark)]">
                        {user_name}
                    </p>
                </div>
            </Link>
            <div className="flex items-center">
                <button className="text-gray-600 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] transition" onClick={onQuit}>
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

type DateDividerProps = {
    date: string;
};

const DateDivider: React.FC<DateDividerProps> = ({ date }) => {
    return (
        <div className="flex justify-center">
            <div className="px-3 py-1 rounded-full bg-[var(--color-muted-light)] dark:bg-[var(--color-muted-dark)] text-[var(--color-on-muted-light)] dark:text-[var(--color-on-muted-dark)] text-xs font-medium">
                {date}
            </div>
        </div>
    );
};

type MessageStatusProps = {
    seen: boolean;
};

const MessageStatus: React.FC<MessageStatusProps> = ({ seen }) => {
    switch (seen) {
        case false:
            return <Check size={14} className="text-muted-foreground" />;
        case true:
            return (
                <div className="flex">
                    <Check size={14} className="text-blue-500" />
                </div>
            );
    }
};

type MessageTimeProps = {
    created_at: string;
    sender: 'me' | 'other';
    seen: boolean;
};

const MessageTime: React.FC<MessageTimeProps> = ({ created_at, sender, seen }) => {
    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`text-xs flex items-center ${sender === 'me'
            ? 'text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)] justify-end'
            : 'text-[var(--color-on-muted-light)] dark:text-[var(--color-on-muted-dark)]'
            }`}>
            <Clock size={10} className="mr-1" />
            {formatTime(created_at)}
            {sender === 'me' && (
                <div className="ml-1">
                    <MessageStatus seen={seen} />
                </div>
            )}
        </div>
    );
};

type ImageAttachmentProps = {
    url: string;
    name: string;
    sender: 'me' | 'other';
};

const ImageAttachment: React.FC<ImageAttachmentProps> = ({ url, name }) => {
    return (
        <div className="relative">
            <Image
                width={64}
                height={64}
                src={url}
                alt={name}
                className="max-w-full rounded-lg w-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <button className="p-2 bg-black bg-opacity-50 rounded-full text-white">
                    <ImageIcon size={18} />
                </button>
            </div>
        </div>
    );
};

type FileAttachmentProps = {
    name: string;
    sender: 'me' | 'other';
};

const FileAttachment: React.FC<FileAttachmentProps> = ({ name, sender }) => {
    return (
        <div className={`flex items-center p-3 rounded-lg ${sender === 'me'
            ? 'bg-[var(--color-primary-dark)] text-[var(--color-on-primary-dark)]'
            : 'bg-[var(--color-neutral-light)] dark:bg-[var(--color-neutral-dark)] text-[var(--color-on-neutral-light)] dark:text-[var(--color-on-neutral-dark)]'
            }`}>
            <FileText className="mr-2 flex-shrink-0" size={18} />
            <span className="truncate text-sm">{name}</span>
            <button className="ml-auto p-1 rounded-full hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors">
                <ArrowLeft size={14} className="transform rotate-180" />
            </button>
        </div>
    );
};

type MessageBubbleProps = {
    message: Message;
    isSequence: boolean;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSequence }) => {
    return (
        <div
            className={`max-w-[75%] rounded-2xl p-3 space-y-2 shadow-sm
            ${message.sender === 'me' ? 'bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)] text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)]' : 'bg-[var(--color-background-light)] dark:bg-[var(--color-surface-dark)] text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]'}
            ${message.sender === 'me' && isSequence ? 'rounded-tr-md' : message.sender === 'me' ? 'rounded-tr-none' : ''}
            ${message.sender === 'other' && isSequence ? 'rounded-tl-md' : message.sender === 'other' ? 'rounded-tl-none' : ''}
            `}
        >
            {message.content && (
                <p className="leading-relaxed">{message.content}</p>
            )}

            {message.attachments && message.attachments.length > 0 && (
                <div className="space-y-2">
                    {message.attachments.map((attachment, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                            {attachment.type === 'image' ? (
                                <ImageAttachment
                                    url={attachment.url}
                                    name={attachment.name}
                                    sender={message.sender}
                                />
                            ) : (
                                <FileAttachment
                                    name={attachment.name}
                                    sender={message.sender}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <MessageTime
                created_at={message.created_at}
                sender={message.sender}
                seen={message.seen}
            />
        </div>
    );
};

type MessageItemProps = {
    message: Message;
    isSequence: boolean;
    onDelete: (messageId: string) => void;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, isSequence, onDelete }) => {

    const handleDelete = async () => {
        const response = await deleteChat(message.id);
        if (!response.success) {
            console.error('Error deleting message:', response.message);
            return;
        }
        onDelete(message.id);
    };

    return (
        <div
            className={`flex items-center ${message.sender === 'me' ? 'justify-end' : 'justify-start'}  group`}
        >
            {message.sender === 'me' && (
                <button
                    onClick={handleDelete}
                    className="right-full mr-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 flex items-center justify-center"
                >
                    <Trash2 size={14} />
                </button>
            )}
            <MessageBubble message={message} isSequence={isSequence} />

        </div>
    );
};

type MessageGroupProps = {
    group: MessageGroupType;
    onDelete: (messageId: string) => void;
};

const MessageGroup: React.FC<MessageGroupProps> = ({ group, onDelete }) => {
    return (
        <div className="space-y-4">
            <DateDivider date={group.date} />

            {group.messages.map((message, messageIndex) => {
                // Check if this message is part of a sequence from the same sender
                const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null;
                const isSequence = prevMessage !== null && prevMessage.sender === message.sender;

                return (
                    <MessageItem
                        key={message.id}
                        message={message}
                        isSequence={isSequence}
                        onDelete={onDelete}
                    />
                );
            })}
        </div>
    );
};

type AttachmentPreviewProps = {
    attachments: File[];
    onRemove: (index: number) => void;
};

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachments, onRemove }) => {
    if (attachments.length === 0) return null;

    return (
        <div className="p-3 flex gap-2 flex-wrap bg-[var(--color-background-light)] dark:bg-[var(--color-surface-dark)] border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
            {attachments.map((file, index) => (
                <div key={index} className="relative group">
                    <div className="h-16 w-16 rounded-lg bg-[var(--color-muted-light)] dark:bg-[var(--color-neutral-dark)] flex items-center justify-center overflow-hidden border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                        {file.type.startsWith('image/') ? (
                            <Image
                                width={10}
                                height={10}
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="object-cover h-full w-full"
                            />
                        ) : (
                            <FileText size={24} className="text-[var(--color-on-muted-light)] dark:text-[var(--color-on-neutral-dark)]" />
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(index)}
                        className="absolute -top-2 -right-2 bg-[var(--color-error)] text-[var(--color-on-error)] rounded-full p-1 shadow-md hover:bg-red-600 transition"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
};

type MessageInputProps = {
    message: string;
    setMessage: (message: string) => void;
    onSend: () => void;
    onAttach: () => void;
    disabled?: boolean;
};

const MessageInput: React.FC<MessageInputProps> = ({
    message,
    setMessage,
    onSend,
    onAttach,
    disabled = false
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="py-2 px-3 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-[var(--color-background-light)] dark:bg-[var(--color-surface-dark)]">
            <div className="flex items-end gap-2">
                <button className="text-gray-500 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] p-2">
                    <Smile size={20} />
                </button>

                <div className="flex-1 bg-[var(--color-neutral-light)] dark:bg-[var(--color-neutral-dark)] rounded-full px-4 py-2 flex items-center">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full bg-transparent outline-none resize-none text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] text-sm max-h-32 py-1"
                        rows={1}
                    />
                </div>

                <div className="flex gap-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                onAttach();
                            }
                        }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-gray-500 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] transition"
                    >
                        <Paperclip size={20} />
                    </button>
                    <button
                        onClick={onSend}
                        disabled={disabled}
                        className={`rounded-full p-3 transition shadow-md ${disabled
                            ? 'bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)] text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)] opacity-60 cursor-not-allowed'
                            : 'bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)] text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)] hover:opacity-90'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const formatDate = (date: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return messageDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    }
};

const groupMessagesByDate = (messages: Message[]): MessageGroupType[] => {
    const groups: MessageGroupType[] = [];

    messages.forEach(message => {
        const dateString = formatDate(message.created_at);
        const lastGroup = groups[groups.length - 1];

        if (lastGroup && lastGroup.date === dateString) {
            lastGroup.messages.push(message);
        } else {
            groups.push({
                date: dateString,
                messages: [message]
            });
        }
    });

    return groups;
};


// Pagination constants
const PAGE_SIZE = 10; // Number of messages to load at once
const SCROLL_THRESHOLD = 200; // Pixels from top to trigger loading more messages

interface ChatViewProps {
    selectedConnection: UserConnection | null,
    setSelectedConnection: (connection: UserConnection | null) => void,
    onlineUsers: string[]
}

export const ChatView: React.FC<ChatViewProps> = ({ selectedConnection, setSelectedConnection, onlineUsers }) => {

    if (!selectedConnection) {
        return <div className="flex items-center justify-center h-full">No connection selected</div>;
    }

    // State for all messages and display messages (paginated subset)
    const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [page, setPage] = useState(1);

    const [newMessage, setNewMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleNewIncomingMessage = (message: Message) => {
        console.log('New incoming message:', message);
        if (message.sender !== 'me') {
            setDisplayMessages(prev => [...prev, message]);
        }
    }

    const handleMessageDelete = (messageId: string) => {
        setDisplayMessages(prev => prev.filter(msg => msg.id !== messageId));
    }

    useEffect(() => {
        const listener = listenToChatEvent(selectedConnection.connection_id, handleNewIncomingMessage, handleMessageDelete, selectedConnection.user_name);

        return () => {
            unsubscribeFromChatEvent(listener);
        };
    }, [selectedConnection]);

    const loadMessagesByPage = async (page_number: number) => {
        if (isLoading || !hasMoreMessages) return;

        console.log('Loading messages for page:', page_number);

        setIsLoading(true);
        try {
            const response = await loadChats(selectedConnection.connection_id, page_number, PAGE_SIZE, selectedConnection.user_name);

            if (response.status !== 200) {
                console.error('Failed to load messages:', response.message);
                setIsLoading(false);
                return;
            }

            console.log('Loaded messages:', response.data);

            const newMessages = response.data!;
            setDisplayMessages(prev => [...prev, ...newMessages]);
            setHasMoreMessages(newMessages.length > PAGE_SIZE);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load of messages
    useEffect(() => {
        setPage(1); // Reset page when connection changes
        setDisplayMessages([]); // Clear previous messages
        setHasMoreMessages(true); // Reset pagination state
        loadMessagesByPage(1); // Always start with page 1 for a new connection
    }, [selectedConnection]);

    // Scroll to bottom on initial load
    // useEffect(() => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    //     }
    // }, [displayMessages]);

    // Function to load more messages when scrolling up
    const loadMoreMessages = useCallback(() => {
        if (isLoading || !hasMoreMessages) return;
        console.log('Page:', page);
        setPage(page + 1);
        loadMessagesByPage(page + 1);
    }, [isLoading, hasMoreMessages, page]);


    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current || isLoading || !hasMoreMessages) return;

        const { scrollTop } = messagesContainerRef.current;

        if (scrollTop <= SCROLL_THRESHOLD) {
            if (isLoading || !hasMoreMessages) return;
            loadMoreMessages();
        }


        console.log('Scroll position:', scrollTop);
    }, [isLoading, hasMoreMessages, loadMoreMessages]);

    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;

        // Create a single function reference that we can both add and remove
        const scrollHandler = () => handleScroll();

        if (messagesContainer) {
            console.log("Registering scroll listener");
            messagesContainer.addEventListener('scroll', (e) => scrollHandler());
        }

        return () => {
            if (messagesContainer) {
                console.log("Unregistering scroll listener");
                messagesContainer.removeEventListener('scroll', (e) => scrollHandler());
            }
        };
    }, [handleScroll]);


    // Auto scroll to bottom when sending a new message
    // useEffect(() => {
    //     if (messagesEndRef.current && !isLoading) {
    //         // Only auto-scroll to bottom for new messages, not when loading older messages
    //         if (displayMessages.length > 0 && displayMessages.includes(displayMessages[displayMessages.length - 1])) {
    //             messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    //         }
    //     }
    // }, [displayMessages, isLoading]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '' && attachments.length === 0) return;

        const response = await addNewMessage(
            selectedConnection.connection_id,
            newMessage,
            selectedConnection.user_name,
            attachments
        );

        if (response.status !== 200) {
            console.error('Error sending message:', response.message);
            return;
        }

        // Add to all messages and display messages (optimistic update)
        setDisplayMessages(prev => [...prev, response.data!]);
        setNewMessage('');
        setAttachments([]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments([...attachments, ...Array.from(e.target.files)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    // Group messages by date
    const groupedMessages = groupMessagesByDate(displayMessages);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-col h-full bg-gray-50 dark:bg-[var(--color-background-dark)] text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]">
                {/* Header */}
                <ChatHeader
                    avatar_url={selectedConnection.avatar_url}
                    full_name={selectedConnection.full_name}
                    user_name={selectedConnection.user_name}
                    onQuit={() => setSelectedConnection(null)}
                    onlineUsers={onlineUsers}
                />

                {/* Messages area */}
                <div
                    className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-[var(--color-muted-dark)]"
                    ref={messagesContainerRef}
                >
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-center py-2">
                            <div className="px-3 py-1 rounded-full bg-[var(--color-muted-light)] dark:bg-[var(--color-muted-dark)] text-[var(--color-on-muted-light)] dark:text-[var(--color-on-muted-dark)] text-xs font-medium animate-pulse">
                                Loading older messages...
                            </div>
                        </div>
                    )}

                    {/* Show a "load more" button if we're at the top and there are more messages */}
                    {!isLoading && hasMoreMessages && (
                        <div className="flex justify-center py-2">
                            <button
                                onClick={loadMoreMessages}
                                className="px-3 py-1 rounded-full bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)] text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)] text-xs font-medium hover:opacity-90 transition"
                            >
                                Load older messages
                            </button>
                        </div>
                    )}

                    {/* Display message groups */}
                    {groupedMessages.map((group, groupIndex) => (
                        <MessageGroup
                            key={groupIndex}
                            group={group}
                            onDelete={handleMessageDelete}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Attachment preview */}
                <AttachmentPreview
                    attachments={attachments}
                    onRemove={removeAttachment}
                />

                {/* Input area */}
                <MessageInput
                    message={newMessage}
                    setMessage={setNewMessage}
                    onSend={handleSendMessage}
                    onAttach={() => fileInputRef.current?.click()}
                    disabled={newMessage.trim() === '' && attachments.length === 0}
                />

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileSelect}
                />
            </div>
        </div>
    )
}