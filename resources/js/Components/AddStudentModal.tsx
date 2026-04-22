import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    grades: any[];
    sections: any[];
}

export default function AddStudentModal({ isOpen, onClose, grades, sections }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name_ar: '',
        name_en: '',
        student_no: '',
        student_id_no: '',
        grade_id: '',
        section_id: '',
        parent_mobile: '',
    });

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
        <div className="modal-overlay" dir="rtl">
            <div className="modal-container premium-modal">
                <div className="modal-header-blue">
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h3 className="modal-title">إضافة طالب جديد</h3>
                </div>

                <form onSubmit={handleSubmit} className="modal-body p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="f-field">
                            <label className="f-label">الاسم بالعربية *</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.name_ar}
                                onChange={e => setData('name_ar', e.target.value)}
                                placeholder="محمد أحمد"
                                required
                            />
                            {errors.name_ar && <span className="f-error">{errors.name_ar}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">الاسم بالإنجليزية *</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.name_en}
                                onChange={e => setData('name_en', e.target.value)}
                                placeholder="Mohammed Ahmed"
                                required
                            />
                            {errors.name_en && <span className="f-error">{errors.name_en}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">رقم الطالب *</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.student_no}
                                onChange={e => setData('student_no', e.target.value)}
                                placeholder="2025001"
                                required
                            />
                            {errors.student_no && <span className="f-error">{errors.student_no}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">رقم الهوية *</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.student_id_no}
                                onChange={e => setData('student_id_no', e.target.value)}
                                placeholder="784-..."
                                required
                            />
                            {errors.student_id_no && <span className="f-error">{errors.student_id_no}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">الصف *</label>
                            <select 
                                className="f-select"
                                value={data.grade_id}
                                onChange={e => setData('grade_id', e.target.value)}
                                required
                            >
                                <option value="">— اختر الصف —</option>
                                {grades.map(g => (
                                    <option key={g.id} value={g.id}>{g.number}</option>
                                ))}
                            </select>
                            {errors.grade_id && <span className="f-error">{errors.grade_id}</span>}
                        </div>
                        <div className="f-field">
                            <label className="f-label">الشعبة *</label>
                            <select 
                                className="f-select"
                                value={data.section_id}
                                onChange={e => setData('section_id', e.target.value)}
                                required
                                disabled={!data.grade_id}
                            >
                                <option value="">— اختر الشعبة أولاً —</option>
                                {filteredSections.map(s => (
                                    <option key={s.id} value={s.id}>{s.letter} - {s.label_ar}</option>
                                ))}
                            </select>
                            {errors.section_id && <span className="f-error">{errors.section_id}</span>}
                        </div>
                        <div className="f-field col-span-2">
                            <label className="f-label">جوال ولي الأمر *</label>
                            <input 
                                type="text" 
                                className="f-input"
                                value={data.parent_mobile}
                                onChange={e => setData('parent_mobile', e.target.value)}
                                placeholder="0501234567"
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
                            إضافة
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn-cancel flex-1 font-bold py-3 rounded-lg border"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
