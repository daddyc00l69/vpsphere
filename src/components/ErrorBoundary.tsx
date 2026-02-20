'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-vpsBackground dark:bg-background-dark p-4">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-red-200 dark:border-red-900/50 p-8 text-center">
                        <div className="size-16 mx-auto bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">
                            {this.state.error?.message || 'An unexpected application error occurred.'}
                        </p>
                        <Button
                            onClick={() => globalThis.location.reload()}
                            className="w-full bg-vpsPurple hover:bg-vpsPurple/90 text-white font-bold"
                        >
                            Reload Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
