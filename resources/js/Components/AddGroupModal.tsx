import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import axios from 'axios';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    grades: any[];
    subjects: any[];
    teachers: any[];
    lang?: string;
    editGroup?: any; // if provided, modal is in edit mode
}

export default function AddGroupModal({ isOpen, onClose, grades, subjects, teachers, lang = 'ar', editGroup }: Props) {
    const isEditMode = !!editGroup;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name_ar: editGroup?.name_ar ?? '',
        name_en: editGroup?.name_en ?? '',
        description: editGroup?.description ?? '',
        staff_id: editGroup?.staff_id ?? '',
        subject_id: editGroup?.subject_id ?? '',
        grade_id: editGroup?.grade_id ?? '',
        student_ids: (editGroup?.students ?? []).map((s: any) => s.id) as string[],
    });

    const [students, setStudents] = useState<any[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const dict = {
        ar: {
            title: isEditMode ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة',
            nameAr: 'اسم المجموعة (عربي) *',
            nameEn: 'اسم المجموعة (إنجليزي)',
            desc: 'الوصف (اختياري)',
            teacher: 'المعلم المسئول *',
            subject: 'المادة *',
            grade: 'الصف (المرحلة) *',
            students: 'تحديد الطلاب',
            selectTeacher: '— اختر المعلم —',
            selectSubject: '— اختر المادة —',
            selectGrade: '— اختر الصف —',
            searchPlaceholder: 'ابحث عن طالب...',
            add: isEditMode ? 'حفظ التعديلات' : 'إنشاء المجموعة',
            cancel: 'إلغاء',
            selected: 'طالباً مختاراً'
        },
        en: {
            title: isEditMode ? 'Edit Group' : 'Add New Group',
            nameAr: 'Group Name (Arabic) *',
            nameEn: 'Group Name (English)',
            desc: 'Description (optional)',
            teacher: 'Assigned Teacher *',
            subject: 'Subject *',
            grade: 'Grade Level *',
            students: 'Select Students',
            selectTeacher: '— Select Teacher —',
            selectSubject: '— Select Subject —',
            selectGrade: '— Select Grade —',
            searchPlaceholder: 'Search student...',
            add: isEditMode ? 'Save Changes' : 'Create Group',
            cancel: 'Cancel',
            selected: 'students selected'
        }
    };

    const t = dict[lang as keyof typeof dict] || dict.ar;

    // Sync form when editGroup changes (e.g. open different group to edit)
    useEffect(() => {
        if (editGroup) {
            setData({
                name_ar: editGroup.name_ar ?? '',
                name_en: editGroup.name_en ?? '',
                description: editGroup.description ?? '',
                staff_id: editGroup.staff_id ?? '',
                subject_id: editGroup.subject_id ?? '',
                grade_id: editGroup.grade_id ?? '',
                student_ids: (editGroup.students ?? []).map((s: any) => s.id),
            });
        } else {
            reset();
        }
    }, [editGroup, isOpen]);

    useEffect(() => {
        if (data.grade_id && isOpen) {
            fetchStudents();
        }
    }, [data.grade_id, isOpen]);

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const resp = await axios.get(route('api.admin.students'), {
                params: { grade_id: data.grade_id, is_active: 'true', per_page: 500 }
            });
            setStudents(resp.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            put(route('admin.groups.update', editGroup.id), {
                onSuccess: () => { onClose(); },
            });
        } else {
            post(route('admin.groups.store'), {
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    const toggleStudent = (id: string) => {
        if (data.student_ids.includes(id)) {
            setData('student_ids', data.student_ids.filter(sid => sid !== id));
        } else {
            setData('student_ids', [...data.student_ids, id]);
        }
    };

    const filteredStudents = students.filter(s => 
        s.name_ar.includes(searchTerm) || 
        (s.name_en && s.name_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.student_no.includes(searchTerm)
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="modal-container premium-modal max-w-[700px] w-[95%]">
                {/* Header */}
                <div className="modal-header-blue" style={{ background: '#27374D' }}>
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h3 className="modal-title">
                        {isEditMode ? '✏️' : '➕'} {t.title}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="modal-body p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Name AR */}
                        <div className="f-field">
                            <label className="f-label">{t.nameAr}</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.name_ar}
                                onChange={e => setData('name_ar', e.target.value)}
                                required
                            />
                            {errors.name_ar && <div className="text-rose-500 text-xs mt-1">{errors.name_ar}</div>}
                        </div>
                        {/* Name EN */}
                        <div className="f-field">
                            <label className="f-label">{t.nameEn}</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.name_en}
                                onChange={e => setData('name_en', e.target.value)}
                            />
                        </div>
                        {/* Teacher */}
                        <div className="f-field">
                            <label className="f-label">{t.teacher}</label>
                            <select 
                                className="f-select"
                                value={data.staff_id}
                                onChange={e => setData('staff_id', e.target.value)}
                                required
                            >
                                <option value="">{t.selectTeacher}</option>
                                {teachers.map(staff => (
                                    <option key={staff.id} value={staff.id}>{lang === 'ar' ? staff.name_ar : staff.name_en || staff.name_ar}</option>
                                ))}
                            </select>
                        </div>
                        {/* Subject */}
                        <div className="f-field">
                            <label className="f-label">{t.subject}</label>
                            <select 
                                className="f-select"
                                value={data.subject_id}
                                onChange={e => setData('subject_id', e.target.value)}
                                required
                            >
                                <option value="">{t.selectSubject}</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{lang === 'ar' ? s.name_ar : s.name_en || s.name_ar}</option>
                                ))}
                            </select>
                        </div>
                        {/* Grade */}
                        <div className="f-field col-span-2">
                            <label className="f-label">{t.grade}</label>
                            <select 
                                className="f-select"
                                value={data.grade_id}
                                onChange={e => setData('grade_id', e.target.value)}
                                required
                            >
                                <option value="">{t.selectGrade}</option>
                                {grades.map(g => (
                                    <option key={g.id} value={g.id}>{lang === 'ar' ? 'صف' : 'Grade'} {g.number}</option>
                                ))}
                            </select>
                        </div>
                        {/* Description */}
                        <div className="f-field col-span-2">
                            <label className="f-label">{t.desc}</label>
                            <textarea
                                className="f-input min-h-[60px] resize-none"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Students selection */}
                    {data.grade_id && (
                        <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700">{t.students} ({data.student_ids.length} {t.selected})</h4>
                                <input 
                                    type="text" 
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-400"
                                    placeholder={t.searchPlaceholder}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="max-h-[250px] overflow-y-auto grid grid-cols-2 gap-2 p-1">
                                {loadingStudents ? (
                                    <div className="col-span-2 text-center py-10 text-slate-400">جاري التحميل...</div>
                                ) : filteredStudents.length > 0 ? filteredStudents.map(s => (
                                    <label 
                                        key={s.id} 
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${data.student_ids.includes(s.id) ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                                    >
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded accent-indigo-600"
                                            checked={data.student_ids.includes(s.id)}
                                            onChange={() => toggleStudent(s.id)}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">{lang === 'ar' ? s.name_ar : s.name_en || s.name_ar}</span>
                                            <span className="text-[10px] text-slate-400">{s.student_no} — {s.section?.letter}</span>
                                        </div>
                                    </label>
                                )) : (
                                    <div className="col-span-2 text-center py-10 text-slate-400">لا يوجد طلاب</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="modal-footer mt-6 flex gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
                            style={{ background: '#27374D' }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#394867'}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#27374D'}
                        >
                            {processing ? '...' : t.add}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 bg-white hover:bg-slate-50 text-slate-500 font-bold py-3 rounded-xl border border-slate-200 transition-all"
                        >
                            {t.cancel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
