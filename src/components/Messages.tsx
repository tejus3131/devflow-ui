'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
    Send, 
    FileText, 
    Image as ImageIcon, 
    Paperclip, 
    Smile, 
    MoreVertical,
    X,
    Check,  
    Phone,
    Video,
    Search,
    Clock,
    ArrowLeft
} from 'lucide-react';
import Image from 'next/image';

// Message type definition
type Message = {
    id: string;
    content: string;
    sender: 'me' | 'other';
    timestamp: Date;
    status?: 'sent' | 'delivered' | 'read';
    attachments?: {
        type: 'image' | 'document' | 'file';
        url: string;
        name: string;
    }[];
};

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hey there! How are you doing?',
            sender: 'other',
            timestamp: new Date(Date.now() - 3600000),
            status: 'read'
        },
        {
            id: '2',
            content: 'I\'m great! Just working on this new project.',
            sender: 'me',
            timestamp: new Date(Date.now() - 3500000),
            status: 'read'
        },
        {
            id: '3',
            content: 'Can you send me the documents we talked about?',
            sender: 'other',
            timestamp: new Date(Date.now() - 3400000),
            status: 'read'
        },
        {
            id: '4',
            content: 'Sure, here they are!',
            sender: 'me',
            timestamp: new Date(Date.now() - 3300000),
            status: 'read',
            attachments: [
                {
                    type: 'document',
                    url: '#',
                    name: 'project_outline.pdf'
                },
                {
                    type: 'image',
                    url: '/api/placeholder/400/300',
                    name: 'concept.jpg'
                }
            ]
        }
    ]);
    
    const [newMessage, setNewMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Auto scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // Auto resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);
    
   
    
    const handleSendMessage = () => {
        if (newMessage.trim() === '' && attachments.length === 0) return;
        
        // Create attachment objects
        const messageAttachments = attachments.map(file => {
            const isImage = file.type.startsWith('image/');
            return {
                type: isImage ? 'image' as const : 'document' as const,
                url: URL.createObjectURL(file),
                name: file.name
            };
        });
        
        const newMsg: Message = {
            id: Date.now().toString(),
            content: newMessage,
            sender: 'me',
            timestamp: new Date(),
            status: 'sent',
            attachments: messageAttachments.length > 0 ? messageAttachments : undefined
        };
        
        setMessages([...messages, newMsg]);
        setNewMessage('');
        setAttachments([]);
        
        // Simulate message being delivered and read
        setTimeout(() => {
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === newMsg.id ? {...msg, status: 'delivered' as const} : msg
                )
            );
        }, 1000);
        
        setTimeout(() => {
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === newMsg.id ? {...msg, status: 'read' as const} : msg
                )
            );
        }, 2000);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments([...attachments, ...Array.from(e.target.files)]);
        }
    };
    
    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };
    
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    const formatDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
        }
    };
    
    const renderMessageStatus = (status?: string) => {
        if (!status) return null;
        
        switch(status) {
            case 'sent':
                return <Check size={14} className="text-muted-foreground" />;
            case 'delivered':
                return (
                    <div className="flex">
                        <Check size={14} className="text-muted-foreground" />
                        <Check size={14} className="text-muted-foreground -ml-1" />
                    </div>
                );
            case 'read':
                return (
                    <div className="flex">
                        <Check size={14} className="text-blue-500" />
                        <Check size={14} className="text-blue-500 -ml-1" />
                    </div>
                );
            default:
                return null;
        }
    };
    
    // Group messages by date
    const groupedMessages: {date: string; messages: Message[]}[] = [];
    messages.forEach(message => {
        const dateString = formatDate(message.timestamp);
        const lastGroup = groupedMessages[groupedMessages.length - 1];
        
        if (lastGroup && lastGroup.date === dateString) {
            lastGroup.messages.push(message);
        } else {
            groupedMessages.push({
                date: dateString,
                messages: [message]
            });
        }
    });
    
    return (
        <div className={`flex flex-col  h-screen `}>
            <div className="flex flex-col h-full bg-gray-50 dark:bg-[var(--color-background-dark)] text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] flex justify-between items-center shadow-sm bg-[var(--color-background-light)] dark:bg-[var(--color-surface-dark)]">
                <div className="flex items-center space-x-3">
                <button className="md:hidden text-gray-600 dark:text-[var(--color-on-surface-dark)]">
                    <ArrowLeft size={20} />
                </button>
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-secondary-light)] dark:from-[var(--color-primary-dark)] dark:to-[var(--color-secondary-dark)] flex items-center justify-center text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)] font-medium">
                    JS
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--color-success)] rounded-full border-2 border-[var(--color-background-light)] dark:border-[var(--color-surface-dark)]"></div>
                </div>
                <div>
                    <h3 className="font-medium text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]">John Smith</h3>
                    <p className="text-xs text-[var(--color-success)]">Online</p>
                </div>
                </div>
                <div className="flex items-center space-x-4">
                <button className="text-gray-600 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] transition">
                    <Phone size={18} />
                </button>
                <button className="text-gray-600 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] transition">
                    <Video size={18} />
                </button>
                <button className="text-gray-600 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] transition">
                    <Search size={18} />
                </button>
               
                <button className="text-gray-600 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] transition">
                    <MoreVertical size={18} />
                </button>
                </div>
            </div>
            
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-[var(--color-muted-dark)]">
                {groupedMessages.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                    <div className="flex justify-center">
                    <div className="px-3 py-1 rounded-full bg-[var(--color-muted-light)] dark:bg-[var(--color-muted-dark)] text-[var(--color-on-muted-light)] dark:text-[var(--color-on-muted-dark)] text-xs font-medium">
                        {group.date}
                    </div>
                    </div>
                    
                    {group.messages.map((message, messageIndex) => {
                    // Check if this message is part of a sequence from the same sender
                    const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null;
                    const isSequence = prevMessage && prevMessage.sender === message.sender;
                    
                    return (
                        <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                        {message.sender === 'other' && !isSequence && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-secondary-light)] dark:from-[var(--color-primary-dark)] dark:to-[var(--color-secondary-dark)] flex items-center justify-center text-white text-xs mr-2 mt-1">
                            JS
                            </div>
                        )}
                        {message.sender === 'other' && isSequence && (
                            <div className="w-8 mr-2"></div>
                        )}
                        
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
                                        <>
                                    <div className="relative">
                                        {/* <Image
                                        width={0}
                                        height={0} 
                                        src={attachment.url} 
                                        alt={attachment.name}
                                        className="max-w-full rounded-lg w-full"
                                        /> */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                                        <button className="p-2 bg-black bg-opacity-50 rounded-full text-white">
                                            <ImageIcon size={18} />
                                        </button>
                                        </div>
                                    </div>
                                    </>
                                    ) : (
                                    <div className={`flex items-center p-3 rounded-lg ${
                                        message.sender === 'me' 
                                        ? 'bg-[var(--color-primary-dark)] text-[var(--color-on-primary-dark)]' 
                                        : 'bg-[var(--color-neutral-light)] dark:bg-[var(--color-neutral-dark)] text-[var(--color-on-neutral-light)] dark:text-[var(--color-on-neutral-dark)]'
                                    }`}>
                                        <FileText className="mr-2 flex-shrink-0" size={18} />
                                        <span className="truncate text-sm">{attachment.name}</span>
                                        <button className="ml-auto p-1 rounded-full hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors">
                                        <ArrowLeft size={14} className="transform rotate-180" />
                                        </button>
                                    </div>
                                    )}
                                </div>
                                ))}
                            </div>
                            )}
                            
                            <div className={`text-xs flex items-center ${
                            message.sender === 'me' 
                                ? 'text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)] justify-end' 
                                : 'text-[var(--color-on-muted-light)] dark:text-[var(--color-on-muted-dark)]'
                            }`}>
                            <Clock size={10} className="mr-1" />
                            {formatTime(message.timestamp)}
                            {message.sender === 'me' && (
                                <div className="ml-1">
                                {renderMessageStatus(message.status)}
                                </div>
                            )}
                            </div>
                        </div>
                        </div>
                    );
                    })}
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Attachment preview */}
            {attachments.length > 0 && (
                <div className="p-3 flex gap-2 flex-wrap bg-[var(--color-background-light)] dark:bg-[var(--color-surface-dark)] border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                {attachments.map((file, index) => (
                    <div key={index} className="relative group">
                    <div className="h-16 w-16 rounded-lg bg-[var(--color-muted-light)] dark:bg-[var(--color-neutral-dark)] flex items-center justify-center overflow-hidden border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                        {file.type.startsWith('image/') ? (
                            <>
                        <Image
                        width={10}
                        height={10}
                        
                        src={URL.createObjectURL(file)} alt={file.name} className="object-cover h-full w-full" />
                      </>
                        ) : (
                        <FileText size={24} className="text-[var(--color-on-muted-light)] dark:text-[var(--color-on-neutral-dark)]" />
                        )}
                    </div>
                    <button 
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-[var(--color-error)] text-[var(--color-on-error)] rounded-full p-1 shadow-md hover:bg-red-600 transition"
                    >
                        <X size={12} />
                    </button>
                    </div>
                ))}
                </div>
            )}
            
            {/* Input area */}
            <div className="py-2 px-3 border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] bg-[var(--color-background-light)] dark:bg-[var(--color-surface-dark)]">
                <div className="flex items-end gap-2">
                <button className="text-gray-500 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] p-2">
                    <Smile size={20} />
                </button>
                
                <div className="flex-1 bg-[var(--color-neutral-light)] dark:bg-[var(--color-neutral-dark)] rounded-full px-4 py-2 flex items-center">
                    <textarea 
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
                    onChange={handleFileSelect} 
                    className="hidden" 
                    multiple 
                    />
                    <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-500 dark:text-[var(--color-on-surface-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)] transition"
                    >
                    <Paperclip size={20} />
                    </button>
                    <button 
                    onClick={handleSendMessage}
                    disabled={newMessage.trim() === '' && attachments.length === 0}
                    className={`rounded-full p-3 transition shadow-md ${
                        newMessage.trim() === '' && attachments.length === 0
                        ? 'bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)] text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)] opacity-60 cursor-not-allowed'
                        : 'bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-dark)] text-[var(--color-on-primary-light)] dark:text-[var(--color-on-primary-dark)] hover:opacity-90'
                    }`}
                    >
                    <Send size={18} />
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Messages;