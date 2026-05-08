"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useTranslation } from '@/providers/TranslationProvider';

interface ConfirmDialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
}

interface ConfirmDialogContextType {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
    alert: (title: string, message: string, type?: 'danger' | 'warning' | 'info' | 'success') => Promise<void>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const useConfirmDialog = () => {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
    }
    return context;
};

interface DialogState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: 'danger' | 'warning' | 'info' | 'success';
    isAlert: boolean;
    resolve?: (value: boolean) => void;
}

export const ConfirmDialogProvider = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();
    const [dialog, setDialog] = useState<DialogState>({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'OK',
        cancelText: '',
        type: 'info',
        isAlert: false,
    });

    const confirm = (options: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setDialog({
                isOpen: true,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText || t('common.confirm'),
                cancelText: options.cancelText || t('common.cancel'),
                type: options.type || 'info',
                isAlert: false,
                resolve,
            });
        });
    };

    const alert = (title: string, message: string, type: 'danger' | 'warning' | 'info' | 'success' = 'info'): Promise<void> => {
        return new Promise((resolve) => {
            setDialog({
                isOpen: true,
                title,
                message,
                confirmText: 'OK',
                cancelText: '',
                type,
                isAlert: true,
                resolve: () => resolve(),
            });
        });
    };

    const handleConfirm = () => {
        if (dialog.resolve) {
            dialog.resolve(true);
        }
        setDialog({ ...dialog, isOpen: false });
    };

    const handleCancel = () => {
        if (dialog.resolve && !dialog.isAlert) {
            dialog.resolve(false);
        }
        setDialog({ ...dialog, isOpen: false });
    };

    const getTypeStyles = () => {
        switch (dialog.type) {
            case 'danger':
                return {
                    icon: <AlertCircle className="w-6 h-6" />,
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-600',
                    confirmBg: 'bg-rose-600 hover:bg-rose-700',
                };
            case 'warning':
                return {
                    icon: <AlertCircle className="w-6 h-6" />,
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    confirmBg: 'bg-amber-600 hover:bg-amber-700',
                };
            case 'success':
                return {
                    icon: <CheckCircle className="w-6 h-6" />,
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    confirmBg: 'bg-emerald-600 hover:bg-emerald-700',
                };
            default:
                return {
                    icon: <Info className="w-6 h-6" />,
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    confirmBg: 'bg-blue-600 hover:bg-blue-700',
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <ConfirmDialogContext.Provider value={{ confirm, alert }}>
            {children}

            {dialog.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Dialog */}
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button
                            onClick={handleCancel}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-50"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon */}
                        <div className={`w-16 h-16 ${styles.iconBg} rounded-2xl flex items-center justify-center ${styles.iconColor} mb-6`}>
                            {styles.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
                            {dialog.title}
                        </h3>

                        {/* Message */}
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            {dialog.message}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            {!dialog.isAlert && (
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                                >
                                    {dialog.cancelText}
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 px-6 py-3.5 text-white rounded-xl font-bold text-sm transition-all ${styles.confirmBg}`}
                            >
                                {dialog.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmDialogContext.Provider>
    );
};
