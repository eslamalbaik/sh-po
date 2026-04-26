import React from 'react';

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    lang?: string;
}

export default function ActionConfirmModal({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText, 
    cancelText,
    type = 'warning',
    lang = 'ar'
}: Props) {
    if (!isOpen) return null;

    const defaultConfirm = lang === 'ar' ? 'تأكيد' : 'Confirm';
    const defaultCancel = lang === 'ar' ? 'إلغاء' : 'Cancel';
    
    const finalConfirm = confirmText || defaultConfirm;
    const finalCancel = cancelText || defaultCancel;

    const icon = type === 'danger' ? '⚠️' : (type === 'warning' ? '❓' : (type === 'success' ? '✅' : 'ℹ️'));
    const color = type === 'danger' ? '#ef4444' : (type === 'warning' ? '#f59e0b' : (type === 'success' ? '#10b981' : '#3b82f6'));

    return (
        <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="modal-container premium-modal w-[400px] text-center">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg animate-bounce-subtle"
                            style={{ background: `${color}15`, color: color, border: `3px solid ${color}30` }}
                        >
                            {icon}
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">{message}</p>

                    <div className="flex gap-3">
                        <button 
                            onClick={onConfirm}
                            className="flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
                            style={{ background: color }}
                        >
                            {finalConfirm}
                        </button>
                        <button 
                            onClick={onCancel}
                            className="flex-1 py-3 px-6 rounded-xl font-bold text-slate-400 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all"
                        >
                            {finalCancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

