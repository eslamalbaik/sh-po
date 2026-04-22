import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    student: any;
    isOpen: boolean;
    onClose: () => void;
    grades: any[];
    sections: any[];
}

export default function TransferStudentModal({ student, isOpen, onClose, grades, sections }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        grade_id: student?.grade_id || '',
        section_id: student?.section_id || '',
    });

    const [filteredSections, setFilteredSections] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && student) {
            setData({
                grade_id: student.grade_id,
                section_id: student.section_id,
            });
        }
    }, [isOpen, student]);

    useEffect(() => {
        if (data.grade_id) {
            setFilteredSections(sections.filter(s => s.grade_id == data.grade_id));
        } else {
            setFilteredSections([]);
        }
    }, [data.grade_id, sections]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.students.transfer', student.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    if (!isOpen || !student) return null;

    return (
        <div className="modal-overlay" dir="rtl">
            <div className="modal-container premium-modal w-[450px]">
                <div className="modal-header-blue">
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h3 className="modal-title flex items-center gap-2">
                        <span className="icon-transfer rotate-90">🔄</span> نقل طالب
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="modal-body p-6">
                    <div className="student-badge-small flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-6">
                        <div className="avatar-mini">👤</div>
                        <div className="name-wrap">
                            <div className="name-txt font-bold text-slate-800">{student.name_ar}</div>
                            <div className="sub-txt text-xs text-slate-500">رقم الطالب: {student.student_no}</div>
                        </div>
                    </div>

                    <div className="f-field mb-4">
                        <label className="f-label">الصف الجديد *</label>
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

                    <div className="f-field mb-6">
                        <label className="f-label">الشعبة الجديدة *</label>
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

                    <div className="modal-footer flex gap-3">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="btn-transfer-confirm flex-1 font-bold py-3 rounded-lg bg-[#27374D] text-white"
                        >
                            نقل
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn-cancel flex-1 font-bold py-3 rounded-lg border text-slate-500"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
