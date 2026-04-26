import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    grades: any[];
    sections: any[];
    lang?: string;
}

export default function AddStudentModal({ isOpen, onClose, grades, sections, lang = 'ar' }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name_ar: '',
        name_en: '',
        student_no: '',
        student_id_no: '',
        grade_id: '',
        section_id: '',
        parent_mobile: '',
    });

    const dict = {
        ar: {
            title: 'إضافة طالب جديد',
            nameAr: 'الاسم بالعربية *',
            nameEn: 'الاسم بالإنجليزية *',
            studentNo: 'رقم الطالب *',
            idNo: 'رقم الهوية *',
            grade: 'الصف *',
            section: 'الشعبة *',
            parentMobile: 'جوال ولي الأمر *',
            selectGrade: '— اختر الصف —',
            selectSection: '— اختر الشعبة أولاً —',
            add: 'إضافة',
            cancel: 'إلغاء',
            placeholders: {
                nameAr: 'محمد أحمد',
                nameEn: 'Mohammed Ahmed',
                studentNo: '2025001',
                idNo: '784-...',
                parentMobile: '0501234567',
            }
        },
        en: {
            title: 'Add New Student',
            nameAr: 'Name (Arabic) *',
            nameEn: 'Name (English) *',
            studentNo: 'Student No *',
            idNo: 'ID Number *',
            grade: 'Grade *',
            section: 'Section *',
            parentMobile: 'Parent Mobile *',
            selectGrade: '— Select Grade —',
            selectSection: '— Select Section First —',
            add: 'Add',
            cancel: 'Cancel',
            placeholders: {
                nameAr: 'Mohammed Ahmed',
                nameEn: 'Mohammed Ahmed',
                studentNo: '2025001',
                idNo: '784-...',
                parentMobile: '0501234567',
            }
        }
    };

    const t = dict[lang as keyof typeof dict] || dict.ar;

    const [filteredSections, setFilteredSections] = useState<any[]>([]);

    useEffect(() => {
        if (data.grade_id) {
            setFilteredSections(sections.filter(s => s.grade_id == data.grade_id));
        } else {
            setFilteredSections([]);
        }
    }, [data.grade_id, sections]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.students.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="modal-container premium-modal">
                <div className="modal-header-blue">
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h3 className="modal-title">{t.title}</h3>
                </div>

                <form onSubmit={handleSubmit} className="modal-body p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="f-field">
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
                        <div className="f-field">
                            <label className="f-label">{t.nameEn}</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.name_en}
                                onChange={e => setData('name_en', e.target.value)}
                                placeholder={t.placeholders.nameEn}
                                required
                            />
                            {errors.name_en && <span className="f-error">{errors.name_en}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">{t.studentNo}</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.student_no}
                                onChange={e => setData('student_no', e.target.value)}
                                placeholder={t.placeholders.studentNo}
                                required
                            />
                            {errors.student_no && <span className="f-error">{errors.student_no}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">{t.idNo}</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.student_id_no}
                                onChange={e => setData('student_id_no', e.target.value)}
                                placeholder={t.placeholders.idNo}
                                required
                            />
                            {errors.student_id_no && <span className="f-error">{errors.student_id_no}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">{t.grade}</label>
                            <select 
                                className="f-select"
                                value={data.grade_id}
                                onChange={e => setData('grade_id', e.target.value)}
                                required
                            >
                                <option value="">{t.selectGrade}</option>
                                {grades.map(g => (
                                    <option key={g.id} value={g.id}>{g.number}</option>
                                ))}
                            </select>
                            {errors.grade_id && <span className="f-error">{errors.grade_id}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">{t.section}</label>
                            <select 
                                className="f-select"
                                value={data.section_id}
                                onChange={e => setData('section_id', e.target.value)}
                                required
                                disabled={!data.grade_id}
                            >
                                <option value="">{t.selectSection}</option>
                                {filteredSections.map(s => (
                                    <option key={s.id} value={s.id}>{s.letter} - {lang === 'ar' ? s.label_ar : s.label_en || s.label_ar}</option>
                                ))}
                            </select>
                            {errors.section_id && <span className="f-error">{errors.section_id}</span>}
                        </div>
                        <div className="f-field col-span-2">
                            <label className="f-label">{t.parentMobile}</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.parent_mobile}
                                onChange={e => setData('parent_mobile', e.target.value)}
                                placeholder={t.placeholders.parentMobile}
                            />
                            {errors.parent_mobile && <span className="f-error">{errors.parent_mobile}</span>}
                        </div>
                    </div>

                    <div className="modal-footer mt-6 flex gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="btn-add-confirm flex-1 font-bold py-3 rounded-lg"
                        >
                            {t.add}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn-cancel flex-1 font-bold py-3 rounded-lg border"
                        >
                            {t.cancel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

