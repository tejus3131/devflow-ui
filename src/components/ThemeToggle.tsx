'use client';

import { useTheme } from '../hooks/useTheme';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeSwitch() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center space-x-2 rounded-lg">
            <button
                onClick={() => setTheme('light')}
                className={`rounded-md p-1.5 ${theme === 'light'
                        ? 'border border-primary-light text-primary-light'
                        : 'text-foreground-light dark:text-foreground-dark'
                    }`}
                aria-label="Light mode"
            >
                <Sun size={16} />
            </button>

            <button
                onClick={() => setTheme('dark')}
                className={`rounded-md p-1.5 ${theme === 'dark'
                        ? 'border border-primary-dark text-primary-dark'
                        : 'text-foreground-light dark:text-foreground-dark'
                    }`}
                aria-label="Dark mode"
            >
                <Moon size={16} />
            </button>

            <button
                onClick={() => setTheme('system')}
                className={`rounded-md p-1.5 ${theme === 'system'
                        ? 'border border-primary-dark text-primary-dark  dark:text-primary-dark'
                        : 'text-foreground-light dark:text-foreground-dark'
                    }`}
                aria-label="System preference"
            >
                <Monitor size={16} />
            </button>
        </div>
    );
}

export function ThemeToggle() {
    const { resolvedTheme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md p-1.5 border border-primary-light dark:border-primary-dark"
            aria-label="Toggle theme"
        >
            {resolvedTheme === 'dark' ? (
                <Sun size={18} className="text-foreground-dark" />
            ) : (
                <Moon size={18} className="text-foreground-light" />
            )}
        </button>
    );
}
