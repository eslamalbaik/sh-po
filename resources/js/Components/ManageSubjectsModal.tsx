import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    subjects: any[];
    lang?: string;
}

export default function ManageSubjectsModal({ isOpen, onClose, subjects, lang = 'ar' }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const { data, setData, put, processing, errors, reset } = useForm({
        name_ar: '',
        name_en: '',
    });

    const dict = {
        ar: {
            title: 'إدارة المواد الدراسية',
            nameAr: 'اسم المادة',
            nameEn: 'الاسم بالإنجليزية',
            actions: 'الإجراءات',
            save: 'حفظ',
            cancel: 'إلغاء',
            close: 'إغلاق',
            confirmDel: (name: string) => `هل أنت متأكد من حذف المادة (${name})؟ سيتم حذف كافة الدرجات المرتبطة بها.`,
        },
        en: {
            title: 'Manage Subjects',
            nameAr: 'Subject Name (AR)',
            nameEn: 'Subject Name (EN)',
            actions: 'Actions',
            save: 'Save',
            cancel: 'Cancel',
            close: 'Close',
            confirmDel: (name: string) => `Are you sure you want to delete subject (${name})? All associated grades will be lost.`,
        }
    };

    const t = dict[lang as keyof typeof dict] || dict.ar;

    const handleEdit = (subj: any) => {
        setEditingId(subj.id);
        setData({
            name_ar: subj.name_ar,
            name_en: subj.name_en || '',
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.subjects.update', editingId), {
                onSuccess: () => setEditingId(null),
            });
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(t.confirmDel(name))) {
            router.delete(route('admin.subjects.destroy', id));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="modal-container premium-modal w-[600px] max-h-[80vh] flex flex-col">
                <div className="modal-header-blue" style={{ background: '#3b82f6' }}>
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h3 className="modal-title">{t.title}</h3>
                </div>

                <div className="modal-body p-6 overflow-y-auto flex-1">
                    <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="py-4 font-black text-slate-500">{t.nameAr}</th>
                                <th className="py-4 font-black text-slate-500">{t.nameEn}</th>
                                <th className="py-4 font-black text-slate-500 text-center">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(subj => (
                                <tr key={subj.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                    <td className="py-4">
                                        {editingId === subj.id ? (
                                            <input 
                                                className="f-input py-2" 
                                                value={data.name_ar} 
                                                onChange={e => setData('name_ar', e.target.value)} 
                                            />
                                        ) : (
                                            <span className="font-bold text-slate-700">{subj.name_ar}</span>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        {editingId === subj.id ? (
                                            <input 
                                                className="f-input py-2" 
                                                value={data.name_en} 
                                                onChange={e => setData('name_en', e.target.value)} 
                                            />
                                        ) : (
                                            <span className="text-slate-400 text-sm">{subj.name_en || '—'}</span>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex justify-center gap-2">
                                            {editingId === subj.id ? (
                                                <>
                                                    <button 
                                                        onClick={handleUpdate}
                                                        disabled={processing}
                                                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
                                                    >{t.save}</button>
                                                    <button 
                                                        onClick={() => setEditingId(null)}
                                                        className="bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs"
                                                    >{t.cancel}</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => handleEdit(subj)}
                                                        className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                                                    >
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(subj.id, subj.name_ar)}
                                                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"
                                                    >
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="modal-footer p-6 border-t border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={onClose}
                        className="w-full bg-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-300 transition-all"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
}

