import React from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    lang?: string;
    staff?: any; // Add staff prop for editing
}

export default function AddStaffModal({ isOpen, onClose, lang = 'ar', staff = null }: Props) {
    const isEdit = !!staff;
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name_ar: staff?.name_ar || '',
        name_en: staff?.name_en || '',
        staff_no: staff?.staff_no || '',
        password: '',
    });

    React.useEffect(() => {
        if (isOpen) {
            setData({
                name_ar: staff?.name_ar || '',
                name_en: staff?.name_en || '',
                staff_no: staff?.staff_no || '',
                password: '',
            });
        }
    }, [isOpen, staff]);

    const dict = {
        ar: {
            title: isEdit ? 'تعديل بيانات معلم' : 'إضافة معلم جديد',
            nameAr: 'الاسم بالعربية *',
            nameEn: 'الاسم بالإنجليزية (اختياري)',
            staffNo: 'الرقم الوظيفي / اسم المستخدم *',
            staffNoHint: 'سيستخدم هذا الرقم لتسجيل الدخول',
            password: isEdit ? 'كلمة السر الجديدة (اتركه فارغاً للتخطي)' : 'كلمة السر *',
            save: isEdit ? 'حفظ التعديلات' : 'حفظ المعلم',
            adding: isEdit ? 'جاري الحفظ...' : 'جاري الإضافة...',
            cancel: 'إلغاء',
            placeholders: {
                nameAr: 'أدخل اسم المعلم بالعربية...',
                nameEn: 'Enter teacher name in English...',
                staffNo: 'مثلاً: 2025100',
            }
        },
        en: {
            title: isEdit ? 'Edit Teacher Details' : 'Add New Teacher',
            nameAr: 'Name (Arabic) *',
            nameEn: 'Name (English) (Optional)',
            staffNo: 'Staff ID / Username *',
            staffNoHint: 'This ID will be used for login',
            password: isEdit ? 'New Password (Leave blank to keep current)' : 'Password *',
            save: isEdit ? 'Save Changes' : 'Save Teacher',
            adding: isEdit ? 'Saving...' : 'Adding...',
            cancel: 'Cancel',
            placeholders: {
                nameAr: 'Enter teacher name in Arabic...',
                nameEn: 'Enter teacher name in English...',
                staffNo: 'e.g., 2025100',
            }
        }
    };

    const t = dict[lang as keyof typeof dict] || dict.ar;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.staff.update', staff.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('admin.staff.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="modal-container premium-modal w-[450px]">
                <div className="modal-header-blue" style={{ background: '#27374D' }}>
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h3 className="modal-title">{t.title}</h3>
                </div>

                <form onSubmit={handleSubmit} className="modal-body p-8">
                    <div className="f-field mb-4">
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

                    <div className="f-field mb-6">
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

                    <div className="f-field mb-6">
                        <label className="f-label">{t.staffNo}</label>
                        <input 
                            type="text" 
                            className="f-input"
                            value={data.staff_no}
                            onChange={e => setData('staff_no', e.target.value)}
                            placeholder={t.placeholders.staffNo}
                            required
                        />
                        <div className="text-[10px] text-slate-400 mt-1">{t.staffNoHint}</div>
                        {errors.staff_no && <span className="f-error">{errors.staff_no}</span>}
                    </div>

                    <div className="f-field mb-8">
                        <label className="f-label">{t.password}</label>
                        <input 
                            type="password" 
                            className="f-input"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && <span className="f-error">{errors.password}</span>}
                    </div>

                    <div className="modal-footer flex gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 bg-[#10b981] text-white font-black py-4 rounded-xl shadow-lg hover:bg-[#059669] transition-all"
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

