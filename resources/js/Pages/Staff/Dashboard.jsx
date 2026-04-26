import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import ActionConfirmModal from '@/Components/ActionConfirmModal';
import PrintGradesModal from '@/Components/PrintGradesModal';

export default function Dashboard({ staff = {}, assignments = [] }) {
    const [selectedAssignment, setSelectedAssignment] = useState(assignments && assignments.length > 0 ? assignments[0] : null);
    const [students, setStudents] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAssess, setNewAssess] = useState({ note_ar: '', full_mark: 20, type: 'quiz' });

    const [seconds, setSeconds] = useState(1800); // 30m
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: () => {} });


    
    // Password change states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passData, setPassData] = useState({ password: '', password_confirmation: '' });
    const [passLoading, setPassLoading] = useState(false);
    
    // Print Modal state
    const [showPrintModal, setShowPrintModal] = useState(false);

    // Language state
    const [lang, setLang] = useState(localStorage.getItem('staff_lang') || 'ar');
    useEffect(() => {
        localStorage.setItem('staff_lang', lang);
    }, [lang]);


    const dict = {
        ar: {
            logout: "خروج",
            session: "الجلسة:",
            highest: "أعلى درجة",
            avg: "متوسط الدرجات",
            entries: "مدخلون",
            successRate: "نسبة النجاح",
            print: "طباعة",
            confirmUpload: "تأكيد الرفع",
            newAssess: "+ تقييم جديد",
            subject: "المادة:",
            section: "الشعبة:",
            loading: "جاري التحميل...",
            emptyTitle: "لا توجد تقييمات في هذه المادة بعد",
            emptyDesc: "ابدأ بإضافة أول تقييم (اختبار، مشروع، واجب...) لتمكن من رصد درجات الطلاب في هذه الشعبة.",
            addFirst: "+ إضافة أول تقييم الآن",
            stdName: "اسم الطالب",
            total: "المجموع",
            fullMark: "الدرجة الكاملة:",
            addAssessTitle: "إضافة تقييم جديد",
            assessNameLbl: "اسم التقييم (مثلاً: الاختبار التكويني الأول)",
            fullMarkLbl: "الدرجة الكاملة",
            assessTypeLbl: "نوع التقييم",
            cancel: "إلغاء",
            add: "إضافة",
            confirm: "تأكيد",
            close: "إغلاق",
            changePassTitle: "تغيير كلمة السر",
            newPassLbl: "كلمة السر الجديدة",
            confirmPassLbl: "تأكيد كلمة السر",
            saving: "جاري الحفظ...",
            updatePass: "تحديث كلمة السر",
            errSaveTitle: "خطأ في الحفظ",
            errSaveMsg: "حدث خطأ أثناء رصد الدرجة. يرجى التأكد من اتصالك بالإنترنت.",
            successTitle: "تمت العملية بنجاح",
            successMsg: "تمت إضافة التقييم الجديد إلى القائمة بنجاح.",
            errOpTitle: "خطأ في العملية",
            errOpMsg: "حدث خطأ أثناء رصد التقييم الجديد. يرجى المحاولة مرة أخرى.",
            confirmDelTitle: "تأكيد الحذف",
            confirmDelMsg: "هل أنت متأكد من حذف هذا التقييم؟ سيتم حذف جميع الدرجات المرتبطة به ولا يمكن تراجع عن هذه الخطوة.",
            deletedTitle: "تم الحذف",
            deletedMsg: "تم حذف التقييم بنجاح من سجلات المادة.",
            errTitle: "خطأ",
            errDelMsg: "تعذر حذف التقييم. تأكد من الصلاحيات والاتصال.",
            errValTitle: "خطأ في التحقق",
            errValMsg: "كلمات المرور غير متطابقة أو فارغة.",
            passChangedTitle: "تم تغيير كلمة السر",
            passChangedMsg: "تم تحديث كلمة السر الخاصة بك بنجاح.",
            errPassMsg: "حدث خطأ أثناء تغيير كلمة السر. يرجى المحاولة لاحقاً.",
            types: {
                quiz: "اختبار قصير",
                formative: "اختبار تكويني",
                project: "مشروع",
                homework: "واجب"
            },
            schName: "مدرسة مدينة زايد — حلقة ثانية وثالثة — بنين"
        },
        en: {
            logout: "Logout",
            session: "Session:",
            highest: "Highest Grade",
            avg: "Average Grade",
            entries: "Entries",
            successRate: "Success Rate",
            print: "Print",
            confirmUpload: "Confirm Upload",
            newAssess: "+ New Assessment",
            subject: "Subject:",
            section: "Section:",
            loading: "Loading...",
            emptyTitle: "No assessments for this subject yet",
            emptyDesc: "Start by adding your first assessment (quiz, project, homework...) to record student grades.",
            addFirst: "+ Add First Assessment",
            stdName: "Student Name",
            total: "Total",
            fullMark: "Full Mark:",
            addAssessTitle: "Add New Assessment",
            assessNameLbl: "Assessment Name (e.g., Quiz 1)",
            fullMarkLbl: "Full Mark",
            assessTypeLbl: "Assessment Type",
            cancel: "Cancel",
            add: "Add",
            confirm: "Confirm",
            close: "Close",
            changePassTitle: "Change Password",
            newPassLbl: "New Password",
            confirmPassLbl: "Confirm Password",
            saving: "Saving...",
            updatePass: "Update Password",
            errSaveTitle: "Save Error",
            errSaveMsg: "An error occurred while recording the grade. Please check your internet connection.",
            successTitle: "Operation Successful",
            successMsg: "The new assessment has been added successfully.",
            errOpTitle: "Operation Error",
            errOpMsg: "An error occurred while adding the assessment. Please try again.",
            confirmDelTitle: "Confirm Delete",
            confirmDelMsg: "Are you sure you want to delete this assessment? All associated grades will be lost.",
            deletedTitle: "Deleted",
            deletedMsg: "The assessment has been successfully deleted.",
            errTitle: "Error",
            errDelMsg: "Unable to delete assessment. Check permissions.",
            errValTitle: "Validation Error",
            errValMsg: "Passwords do not match or are empty.",
            passChangedTitle: "Password Changed",
            passChangedMsg: "Your password has been updated successfully.",
            errPassMsg: "An error occurred while changing the password. Please try again later.",
            types: {
                quiz: "Quiz",
                formative: "Formative Test",
                project: "Project",
                homework: "Homework"
            },
            schName: "Madinat Zayed School — Cycles 2 & 3 — Boys"
        }
    };

    const t = dict[lang] || dict.ar;

    useEffect(() => {
        // Persistent timer logic
        const sessionKey = 'staff_session_end';
        let endTime = sessionStorage.getItem(sessionKey);
        
        // Reset if no end time OR if the stored end time is already in the past
        if (!endTime || parseInt(endTime) < Date.now()) {
            endTime = Date.now() + 30 * 60 * 1000;
            sessionStorage.setItem(sessionKey, endTime);
        }

        const tick = () => {
            const now = Date.now();
            const remain = Math.max(0, Math.floor((endTime - now) / 1000));
            setSeconds(remain);
            if (remain <= 0) {
                clearInterval(timer);
                logout();
            }
        };

        const timer = setInterval(tick, 1000);
        tick();
        return () => clearInterval(timer);
    }, []);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    };

    useEffect(() => {
        if (selectedAssignment) {
            loadData();
        }
    }, [selectedAssignment]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (!selectedAssignment) return;
            const resp = await axios.post(route('staff.get-grades'), {
                section_id: selectedAssignment.section_id,
                subject_id: selectedAssignment.subject_id
            });
            setStudents(resp.data.students);
            setAssessments(resp.data.assessments);
            
            const gradeMap = {};
            resp.data.grades.forEach(g => {
                const sId = String(g.student_id).toLowerCase();
                const aId = String(g.assessment_id).toLowerCase();
                gradeMap[`${sId}_${aId}`] = g.score;
            });
            setGrades(gradeMap);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = async (studentId, assessmentId, score) => {
        const key = `${studentId}_${assessmentId}`;
        setGrades(prev => ({ ...prev, [key]: score }));
        setSaving(prev => ({ ...prev, [key]: true }));

        try {
            await axios.post(route('staff.save-grade'), {
                student_id: studentId,
                assessment_id: assessmentId,
                score: score === '' ? null : score
            });
        } catch (err) {
            console.error(err);
            setConfirmModal({
                isOpen: true,
                type: 'danger',
                title: t.errSaveTitle,
                message: t.errSaveMsg,
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
        } finally {
            setSaving(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleAddAssessment = async () => {
        try {
            await axios.post(route('staff.store-assessment'), {
                ...newAssess,
                section_id: selectedAssignment.section_id,
                subject_id: selectedAssignment.subject_id
            });
            setShowAddModal(false);
            setNewAssess({ note_ar: '', full_mark: 20, type: 'quiz' });
            loadData();
            setConfirmModal({
                isOpen: true,
                type: 'success',
                title: t.successTitle,
                message: t.successMsg,
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
        } catch (err) {
            setConfirmModal({
                isOpen: true,
                type: 'danger',
                title: t.errOpTitle,
                message: t.errOpMsg,
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
        }
    };

    const handleDeleteAssessment = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'danger',
            title: t.confirmDelTitle,
            message: t.confirmDelMsg,
            onConfirm: async () => {
                try {
                    setConfirmModal(f => ({ ...f, isOpen: false }));
                    await axios.delete(route('staff.delete-assessment', id));
                    loadData();
                    setConfirmModal({
                        isOpen: true,
                        type: 'success',
                        title: t.deletedTitle,
                        message: t.deletedMsg,
                        onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
                    });
                } catch (err) {
                    setConfirmModal({
                        isOpen: true,
                        type: 'danger',
                        title: t.errTitle,
                        message: t.errDelMsg,
                        onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
                    });
                }
            },
            onCancel: () => setConfirmModal(f => ({ ...f, isOpen: false }))
        });
    };
    
    const handlePasswordChange = async () => {
        if (!passData.password || passData.password !== passData.password_confirmation) {
            setConfirmModal({
                isOpen: true,
                type: 'danger',
                title: t.errValTitle,
                message: t.errValMsg,
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
            return;
        }

        setPassLoading(true);
        try {
            await axios.post(route('staff.change-password'), passData);
            setShowPasswordModal(false);
            setPassData({ password: '', password_confirmation: '' });
            setConfirmModal({
                isOpen: true,
                type: 'success',
                title: t.passChangedTitle,
                message: t.passChangedMsg,
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
        } catch (err) {
            setConfirmModal({
                isOpen: true,
                type: 'danger',
                title: t.errTitle,
                message: t.errPassMsg,
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
        } finally {
            setPassLoading(false);
        }
    };

    // Calculate Stats
    const stats = useMemo(() => {
        if (!students.length || !assessments.length) return { max: 0, avg: 0, entries: 0, success: 0 };
        
        let totalActualScore = 0;
        let highest = 0;
        let entriesCount = 0;
        let successCount = 0;

        // Sum up all assessment full marks
        const totalPossiblePerStudent = assessments.reduce((sum, a) => sum + parseFloat(a.full_mark || 0), 0);
        const totalPossibleSystem = totalPossiblePerStudent * students.length;

        students.forEach(s => {
            let studentTotal = 0;
            let hasAnyGrade = false;

            assessments.forEach(a => {
                const scoreStr = grades[`${s.id}_${a.id}`];
                if (scoreStr !== undefined && scoreStr !== null && scoreStr !== '') {
                    const numScore = parseFloat(scoreStr);
                    studentTotal += numScore;
                    if (numScore > highest) highest = numScore;
                    hasAnyGrade = true;
                }
            });

            totalActualScore += studentTotal;
            if (hasAnyGrade) entriesCount++;
            
            // Success if student average >= 60%
            if (totalPossiblePerStudent > 0 && (studentTotal / totalPossiblePerStudent) >= 0.6) {
                successCount++;
            }
        });

        const overallAvg = totalPossibleSystem > 0 
            ? ((totalActualScore / totalPossibleSystem) * 100).toFixed(1) 
            : 0;

        return {
            max: highest,
            avg: overallAvg + '%',
            entries: `${entriesCount} / ${students.length}`,
            success: students.length > 0 ? Math.round((successCount / students.length) * 100) : 0
        };
    }, [students, assessments, grades, lang]);

    const logout = () => {
        sessionStorage.removeItem('staff_session_end');
        router.post(route('logout'));
    };

    return (
        <div className="staff-portal-body" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Head title="" />
            
            {/* Header */}
            <header className="staff-header" style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={logout} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 15px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>{t.logout}</button>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{t.session} {formatTime(seconds)}</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <span onClick={() => setLang('ar')} style={{ cursor: 'pointer', fontWeight: lang === 'ar' ? 'bold' : 'normal', color: lang === 'ar' ? '#1c4c6e' : '#94a3b8' }}>ع</span>
                        <span onClick={() => setLang('en')} style={{ cursor: 'pointer', fontWeight: lang === 'en' ? 'bold' : 'normal', color: lang === 'en' ? '#1c4c6e' : '#94a3b8' }}>EN</span>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1c4c6e' }}>{lang === 'ar' ? staff.name_ar : staff.name_en || staff.name_ar}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t.schName}</div>
                </div>
            </header>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {/* Actions Bar */}
                <div className="actions-bar">
                    <div className="btns-group">
                        <button className="p-btn btn-dark" onClick={() => setShowPrintModal(true)}>{t.print}</button>
                        <button className="p-btn btn-green">{t.confirmUpload}</button>
                        <button className="p-btn btn-indigo" onClick={() => setShowAddModal(true)}>{t.newAssess}</button>
                    </div>

                    <div className="filters-group">
                        <div className="f-item">
                            <span className="f-label">{t.subject}</span>
                            <select className="f-select" value={assignments.indexOf(selectedAssignment)} onChange={(e) => {
                                const idx = e.target.value;
                                if (assignments[idx]) setSelectedAssignment(assignments[idx]);
                            }}>
                                {assignments.map((ass, idx) => (
                                    <option key={idx} value={idx}>{lang === 'ar' ? ass.subject?.name_ar : ass.subject?.name_en || ass.subject?.name_ar}</option>
                                ))}
                            </select>
                        </div>
                        <div className="f-item">
                            <span className="f-label">{t.section}</span>
                            <select className="f-select">
                                <option>{selectedAssignment?.section?.grade?.number}{selectedAssignment?.section?.letter}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="table-viewport">
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>{t.loading}</div>
                    ) : assessments.length === 0 ? (
                        <div className="empty-state-box" style={{ padding: '80px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0', margin: '20px 0' }}>
                            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📁</div>
                            <h3 className="text-xl font-black text-slate-800 mb-3">{t.emptyTitle}</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">{t.emptyDesc}</p>
                            <button 
                                className="p-btn btn-indigo shadow-xl px-10 py-4 transform hover:scale-105 transition-all"
                                onClick={() => setShowAddModal(true)}
                            >
                                {t.addFirst}
                            </button>
                        </div>
                    ) : (
                        <table className="classic-table">
                            <thead>
                                <tr>
                                    <th className="student-col">{t.stdName}</th>
                                    {assessments.map(ass => (
                                        <th key={ass.id} className="th-assessment">
                                            <div className="ass-badge">{t.types[ass.type] || ass.type}</div>
                                            <div className="ass-title">{lang === 'ar' ? ass.note_ar : ass.note_en || ass.note_ar}</div>
                                            <div style={{ fontSize: '10px', opacity: 0.6 }}>{t.fullMark} {ass.full_mark}</div>
                                            <div className="ass-controls">
                                                <button className="ass-icon-btn trash" onClick={() => handleDeleteAssessment(ass.id)}>🗑️</button>
                                                <button className="ass-icon-btn edit">✍️</button>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="total-col" style={{ textAlign: 'center' }}>{t.total}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((std, index) => {
                                    let rowTotal = 0;
                                    return (
                                        <tr key={std.id}>
                                            <td className="student-col">
                                                <div className="std-name-wrap">
                                                    <span className="std-num">{index + 1}.</span>
                                                    <span>{lang === 'ar' ? std.name_ar : std.name_en || std.name_ar}</span>
                                                </div>
                                            </td>
                                            {assessments.map(ass => {
                                                const sId = String(std.id).toLowerCase();
                                                const aId = String(ass.id).toLowerCase();
                                                const key = `${sId}_${aId}`;
                                                const score = grades[key];
                                                if (score) rowTotal += parseFloat(score);
                                                
                                                return (
                                                    <td key={ass.id} className="score-cell">
                                                        <input 
                                                            type="text"
                                                            lang="en"
                                                            className={`score-input ${saving[key] ? 'saving-inp' : ''} ${!score && score !== 0 ? 'empty' : ''} ${score !== null && score !== '' && parseFloat(score) === 0 ? 'absent' : ''} ${score !== null && score !== '' && parseFloat(score) > 0 && parseFloat(score) <= 10 ? 'low' : ''}`}
                                                            value={score === 0 || score === "0" ? 'A' : (score ?? '')}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val.toUpperCase() === 'A') {
                                                                    handleScoreChange(std.id, ass.id, 0);
                                                                } else if (val === '' || (!isNaN(val) && parseFloat(val) >= 0)) {
                                                                    if (val === '' || parseFloat(val) <= ass.full_mark) {
                                                                        handleScoreChange(std.id, ass.id, val);
                                                                    }
                                                                }
                                                            }}
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td className="total-col" style={{ textAlign: 'center' }}>
                                                {rowTotal.toFixed(1)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Assessment Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">{t.addAssessTitle}</div>
                        <div className="modal-field">
                            <label>{t.assessNameLbl}</label>
                            <input 
                                className="modal-input" 
                                value={newAssess.note_ar} 
                                onChange={e => setNewAssess({...newAssess, note_ar: e.target.value})}
                            />
                        </div>
                        <div className="modal-field">
                            <label>{t.fullMarkLbl}</label>
                            <input 
                                type="number" 
                                className="modal-input" 
                                value={newAssess.full_mark} 
                                onChange={e => setNewAssess({...newAssess, full_mark: e.target.value})}
                            />
                        </div>
                        <div className="modal-field">
                            <label>{t.assessTypeLbl}</label>
                            <select 
                                className="modal-input" 
                                value={newAssess.type} 
                                onChange={e => setNewAssess({...newAssess, type: e.target.value})}
                            >
                                <option value="quiz">{t.types.quiz}</option>
                                <option value="formative">{t.types.formative}</option>
                                <option value="project">{t.types.project}</option>
                                <option value="homework">{t.types.homework}</option>
                            </select>
                        </div>
                        <div className="modal-btns">
                            <button className="p-btn btn-dark" onClick={() => setShowAddModal(false)}>{t.cancel}</button>
                            <button className="p-btn btn-indigo" onClick={handleAddAssessment}>{t.add}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">{t.changePassTitle}</div>
                        <div className="modal-field">
                            <label>{t.newPassLbl}</label>
                            <input 
                                type="password"
                                className="modal-input" 
                                value={passData.password} 
                                onChange={e => setPassData({...passData, password: e.target.value})}
                            />
                        </div>
                        <div className="modal-field">
                            <label>{t.confirmPassLbl}</label>
                            <input 
                                type="password" 
                                className="modal-input" 
                                value={passData.password_confirmation} 
                                onChange={e => setPassData({...passData, password_confirmation: e.target.value})}
                            />
                        </div>
                        <div className="modal-btns">
                            <button className="p-btn btn-dark" onClick={() => setShowPasswordModal(false)}>{t.cancel}</button>
                            <button className="p-btn btn-indigo" onClick={handlePasswordChange} disabled={passLoading}>
                                {passLoading ? t.saving : t.updatePass}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ActionConfirmModal 
                {...confirmModal}
                lang={lang}
                confirmText={t.confirm}
                cancelText={t.cancel}
                onConfirm={confirmModal.onConfirm}
                onCancel={confirmModal.onCancel || (() => setConfirmModal(f => ({ ...f, isOpen: false })))}
            />

            <PrintGradesModal 
                isOpen={showPrintModal}
                onClose={() => setShowPrintModal(false)}
                staff={staff}
                selectedAssignment={selectedAssignment}
                students={students}
                assessments={assessments}
                grades={grades}
                lang={lang}
                t={t}
            />
        </div>
    );
}
