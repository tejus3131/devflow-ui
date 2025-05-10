'use client';
import React, { useState, useEffect, useRef } from 'react';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Mock suggestions - replace with actual data source
    const mockSuggestions = [
        'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js'
    ];

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filteredSuggestions = mockSuggestions.filter(
            suggestion => suggestion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-md" ref={searchContainerRef}>
            <div className="flex items-center relative">
            <input
                type="text"
                className="w-full py-2 px-4 border rounded-lg
                 text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]
                 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                 border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] dark:focus:ring-[var(--color-primary-dark)]"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2 p-2 text-[var(--color-on-neutral-light)] dark:text-[var(--color-on-neutral-dark)] hover:text-[var(--color-primary-light)] dark:hover:text-[var(--color-primary-dark)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
            <div className="absolute w-full mt-1 rounded-lg shadow-lg z-10
                 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]
                 border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
                <ul className="py-1 divide-y divide-[var(--color-border-light)] dark:divide-[var(--color-border-dark)]">
                {suggestions.map((suggestion, index) => (
                    <li 
                    key={index} 
                    className="px-4 py-2 cursor-pointer
                         text-[var(--color-on-surface-light)] dark:text-[var(--color-on-surface-dark)]
                         hover:bg-[var(--color-muted-light)] dark:hover:bg-[var(--color-muted-dark)]"
                    onClick={() => {
                        setSearchTerm(suggestion);
                        setShowSuggestions(false);
                    }}
                    >
                    {suggestion}
                    </li>
                ))}
                </ul>
            </div>
            )}
        </div>
    );
}

export default SearchBar;
