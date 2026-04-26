import React from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    lang?: string;
}

export default function AddSubjectModal({ isOpen, onClose, lang = 'ar' }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name_ar: '',
        name_en: '',
    });

    const dict = {
        ar: {
            title: 'إضافة مادة جديدة',
            nameAr: 'اسم المادة بالعربية *',
            nameEn: 'اسم المادة بالإنجليزية (اختياري)',
            save: 'حفظ المادة',
            adding: 'جاري الإضافة...',
            cancel: 'إلغاء',
            placeholders: {
                nameAr: 'مثلاً: الرياضيات',
                nameEn: 'e.g. Mathematics',
            }
        },
        en: {
            title: 'Add New Subject',
            nameAr: 'Subject Name (Arabic) *',
            nameEn: 'Subject Name (English) (Optional)',
            save: 'Save Subject',
            adding: 'Adding...',
            cancel: 'Cancel',
            placeholders: {
                nameAr: 'e.g. Mathematics',
                nameEn: 'e.g. Mathematics',
            }
        }
    };

    const t = dict[lang as keyof typeof dict] || dict.ar;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.subjects.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="modal-container premium-modal w-[400px]">
                <div className="modal-header-blue" style={{ background: '#3b82f6' }}>
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h3 className="modal-title">{t.title}</h3>
                </div>

                <form onSubmit={handleSubmit} className="modal-body p-8">
                    <div className="f-field mb-6">
                        <label className="f-label">{t.nameAr}</label>
                        <input 
                            type="text" 
                            className="f-input"
                            value={data.name_ar}
                            onChange={e => setData('name_ar', e.target.value)}
                            placeholder={t.placeholders.nameAr}
                            required
                        />
                        {errors.name_ar && <span className="f-error">{errors.name_ar}</span>}
                    </div>

                    <div className="f-field mb-8">
                        <label className="f-label">{t.nameEn}</label>
                        <input 
                            type="text" 
                            className="f-input"
                            value={data.name_en}
                            onChange={e => setData('name_en', e.target.value)}
                            placeholder={t.placeholders.nameEn}
                        />
                        {errors.name_en && <span className="f-error">{errors.name_en}</span>}
                    </div>

                    <div className="modal-footer flex gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 bg-[#3b82f6] text-white font-black py-4 rounded-xl shadow-lg hover:bg-[#2563eb] transition-all"
                        >
                            {processing ? t.adding : t.save}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all"
                        >
                            {t.cancel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

