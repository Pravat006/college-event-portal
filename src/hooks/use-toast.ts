'use client';

import * as React from 'react';
import { toast, Toaster as SonnerToaster } from "sonner";

type ToastProps = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'success';
};

// Define a more specific type for extra options
type ExtraOptions = {
    [key: string]: unknown;
};

// Type for the toast options
type ToastOptions = {
    description?: React.ReactNode;
    action?: React.ReactNode;
    [key: string]: unknown;
};

export function useToast() {
    // Wrapping Sonner's toast function with our custom interface
    function showToast({
        title,
        description,
        action,
        variant = 'default',
        ...props
    }: ToastProps & ExtraOptions) {
        // Use specific methods based on variant
        if (variant === 'destructive') {
            return toast.error(title as string, {
                description,
                action,
                ...props,
            });
        } else if (variant === 'success') {
            return toast.success(title as string, {
                description,
                action,
                ...props,
            });
        } else {
            return toast(title as string, {
                description,
                action,
                ...props,
            });
        }
    }

    return {
        toast: showToast,
        dismiss: toast.dismiss,
        // Additional Sonner methods with proper typing
        success: (message: string, options?: ToastOptions) => toast.success(message, options),
        error: (message: string, options?: ToastOptions) => toast.error(message, options),
        info: (message: string, options?: ToastOptions) => toast.info(message, options),
        warning: (message: string, options?: ToastOptions) => toast.warning(message, options),
        loading: (message: string, options?: ToastOptions) => toast.loading(message, options),
    };
}

// For compatibility with existing code
export { toast };

// Re-export Toaster component - using a simple pass-through
export const Toaster = SonnerToaster;
