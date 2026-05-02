import React, { useState } from 'react';
import { router } from '@inertiajs/react';
// @ts-ignore
import SearchableSelect from './SearchableSelect';

interface Staff {
    id: string;
    name_ar: string;
    name_en?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    assignment: any;
    teachers: Staff[];
    lang?: string;
    onSuccess: () => void;
}

export default function TransferAssignmentModal({
    isOpen,
    onClose,
    assignment,
    teachers,
    lang = 'ar',
    onSuccess
}: Props) {
    const [targetStaffId, setTargetStaffId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !assignment) return null;

    const t = {
        ar: {
            title: "نقل التكليف",
            msg: `أنت بصدد نقل مادة (${assignment.subject?.name_ar}) لشعبة (${assignment.section?.grade?.number}${assignment.section?.letter}) إلى معلم آخر.`,
            select: "اختر المعلم الجديد",
            confirm: "تأكيد النقل",
            cancel: "إلغاء",
            processing: "جاري المعالجة...",
            note: "سيتم الحفاظ على الدرجات السابقة كأرشيف للقراءة فقط عند المعلم القديم."
        },
        en: {
            title: "Transfer Assignment",
            msg: `You are about to transfer (${assignment.subject?.name_en || assignment.subject?.name_ar}) for section (${assignment.section?.grade?.number}${assignment.section?.letter}) to another teacher.`,
            select: "Select New Teacher",
            confirm: "Confirm Transfer",
            cancel: "Cancel",
            processing: "Processing...",
            note: "Previous grades will be kept as read-only archive for the old teacher."
        }
    }[lang === 'ar' ? 'ar' : 'en'];

    const handleTransfer = () => {
        if (!targetStaffId) return;
        setIsProcessing(true);
        router.post(route('admin.assignments.transfer'), {
            assignment_id: assignment.id,
            new_staff_id: targetStaffId
        }, {
            onSuccess: () => {
                setIsProcessing(false);
                setTargetStaffId('');
                onSuccess();
                onClose();
            },
            onError: () => {
                setIsProcessing(false);
            }
        });
    };

    return (
        <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="modal-container premium-modal w-[500px]">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800">{t.title}</h3>
                            <p className="text-slate-500 font-medium mt-1">{t.msg}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
                        <span className="text-xl">ℹ️</span>
                        <p className="text-amber-800 text-sm font-bold leading-relaxed">{t.note}</p>
                    </div>

                    <div className="f-field mb-8">
                        <label className="f-label text-slate-600 mb-2">{t.select}</label>
                        <SearchableSelect
                            options={teachers.filter(t => t.id !== assignment.staff_id).map(teacher => ({
                                id: teacher.id,
                                label: lang === 'ar' ? teacher.name_ar : (teacher.name_en || teacher.name_ar)
                            }))}
                            value={targetStaffId}
                            onChange={setTargetStaffId}
                            placeholder={t.select}
                            lang={lang}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button 
                            disabled={!targetStaffId || isProcessing}
                            onClick={handleTransfer}
                            className={`flex-1 py-4 rounded-xl font-black text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 ${!targetStaffId || isProcessing ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isProcessing ? t.processing : t.confirm}
                        </button>
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl font-bold text-slate-400 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all"
                        >
                            {t.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
