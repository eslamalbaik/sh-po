import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import ActionConfirmModal from '@/Components/ActionConfirmModal';
import PrintGradesModal from '@/Components/PrintGradesModal';

export default function Dashboard({ staff, assignments }) {
    const [selectedAssignment, setSelectedAssignment] = useState(assignments[0] || null);
    const [students, setStudents] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAssess, setNewAssess] = useState({ note_ar: '', full_mark: 20, type: 'اختبار قصير' });
    const [seconds, setSeconds] = useState(1800); // 30m
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: () => {} });
    
    // Password change states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passData, setPassData] = useState({ password: '', password_confirmation: '' });
    const [passLoading, setPassLoading] = useState(false);
    
    // Print Modal state
    const [showPrintModal, setShowPrintModal] = useState(false);

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
                title: 'خطأ في الحفظ',
                message: 'حدث خطأ أثناء رصد الدرجة. يرجى التأكد من اتصالك بالإنترنت.',
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
            setNewAssess({ note_ar: '', full_mark: 20, type: 'اختبار قصير' });
            loadData();
            setConfirmModal({
                isOpen: true,
                type: 'success',
                title: 'تمت العملية بنجاح',
                message: 'تمت إضافة التقييم الجديد إلى القائمة بنجاح.',
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
        } catch (err) {
            setConfirmModal({
                isOpen: true,
                type: 'danger',
                title: 'خطأ في العملية',
                message: 'حدث خطأ أثناء رصد التقييم الجديد. يرجى المحاولة مرة أخرى.',
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
        }
    };

    const handleDeleteAssessment = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'danger',
            title: 'تأكيد الحذف',
            message: 'هل أنت متأكد من حذف هذا التقييم؟ سيتم حذف جميع الدرجات المرتبطة به ولا يمكن تراجع عن هذه الخطوة.',
            onConfirm: async () => {
                try {
                    setConfirmModal(f => ({ ...f, isOpen: false }));
                    await axios.delete(route('staff.delete-assessment', id));
                    loadData();
                    setConfirmModal({
                        isOpen: true,
                        type: 'success',
                        title: 'تم الحذف',
                        message: 'تم حذف التقييم بنجاح من سجلات المادة.',
                        onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
                    });
                } catch (err) {
                    setConfirmModal({
                        isOpen: true,
                        type: 'danger',
                        title: 'خطأ',
                        message: 'تعذر حذف التقييم. تأكد من الصلاحيات والاتصال.',
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
                title: 'خطأ في التحقق',
                message: 'كلمات المرور غير متطابقة أو فارغة.',
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
                title: 'تم تغيير كلمة السر',
                message: 'تم تحديث كلمة السر الخاصة بك بنجاح.',
                onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
            });
        } catch (err) {
            setConfirmModal({
                isOpen: true,
                type: 'danger',
                title: 'خطأ',
                message: 'حدث خطأ أثناء تغيير كلمة السر. يرجى المحاولة لاحقاً.',
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
    }, [students, assessments, grades]);

    const logout = () => {
        sessionStorage.removeItem('staff_session_end');
        router.post(route('logout'));
    };

    return (
        <div className="staff-portal-body" dir="rtl">
            <Head title="" />
            
            {/* Header */}
            <header className="premium-header">
                <div className="header-controls">
                    <button className="logout-link" onClick={logout}>خروج</button>
                    <button className="h-ctrl-item" onClick={() => setShowPasswordModal(true)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4H4.2c-.66 0-1.2.54-1.2 1.2v5.6c0 .66.54 1.2 1.2 1.2h7.6c.66 0 1.2-.54 1.2-1.2V8.2c0-.66-.54-1.2-1.2-1.2H11z"/></svg>
                    </button>
                    <div className="h-ctrl-item">الجلسة: {formatTime(seconds)}</div>
                    <div className="h-ctrl-item">ع</div>
                    <div className="h-ctrl-item">EN</div>
                </div>

                <div className="header-user-info">
                    <div className="user-full-name">{staff.name_ar}</div>
                    <div className="school-tagline">مدرسة مدينة زايد — حلقة ثانية وثالثة — بنين</div>
                </div>
            </header>

            {/* KPI Summary */}
            <div className="summary-container">
                <div className="kpi-card-box">
                    <div className="kpi-item">
                        <div className="kpi-val">{stats.max}</div>
                        <div className="kpi-lbl">أعلى درجة</div>
                    </div>
                    <div className="kpi-item">
                        <div className="kpi-val">{stats.avg}</div>
                        <div className="kpi-lbl">متوسط الدرجات</div>
                    </div>
                    <div className="kpi-item">
                        <div className="kpi-val big">{stats.entries}</div>
                        <div className="kpi-lbl">مدخلون</div>
                    </div>
                    <div className="kpi-item" style={{ borderRight: '2px solid #eef2ff', background: '#f8fafc' }}>
                        <div className="kpi-success-radial">
                            <div className="success-percent">{stats.success}%</div>
                            <div className="kpi-lbl">نسبة النجاح ( {'>'}60% )</div>
                        </div>
                        <div className="kpi-progress-bar" style={{ width: `${stats.success}%` }}></div>
                    </div>
                    
                    {/* Decorative Lightning Icon from image */}
                    <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#fbbf24' }}>
                        <svg width="40" height="40" fill="currentColor" viewBox="0 0 16 16"><path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/></svg>
                    </div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {/* Actions Bar */}
                <div className="actions-bar">
                    <div className="btns-group">
                        <button className="p-btn btn-dark" onClick={() => setShowPrintModal(true)}>طباعة</button>
                        <button className="p-btn btn-green">تأكيد الرفع</button>
                        <button className="p-btn btn-indigo" onClick={() => setShowAddModal(true)}>+ تقييم جديد</button>
                    </div>

                    <div className="filters-group">
                        <div className="f-item">
                            <span className="f-label">المادة:</span>
                            <select className="f-select" onChange={(e) => setSelectedAssignment(assignments[e.target.value])}>
                                {assignments.map((ass, idx) => (
                                    <option key={idx} value={idx}>{ass.subject?.name_ar}</option>
                                ))}
                            </select>
                        </div>
                        <div className="f-item">
                            <span className="f-label">الشعبة:</span>
                            <select className="f-select">
                                <option>{selectedAssignment?.section?.grade?.number}{selectedAssignment?.section?.letter}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="table-viewport">
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>
                    ) : assessments.length === 0 ? (
                        <div className="empty-state-box" style={{ padding: '80px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0', margin: '20px 0' }}>
                            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📁</div>
                            <h3 className="text-xl font-black text-slate-800 mb-3">لا توجد تقييمات في هذه المادة بعد</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">ابدأ بإضافة أول تقييم (اختبار، مشروع، واجب...) لتمكن من رصد درجات الطلاب في هذه الشعبة.</p>
                            <button 
                                className="p-btn btn-indigo shadow-xl px-10 py-4 transform hover:scale-105 transition-all"
                                onClick={() => setShowAddModal(true)}
                            >
                                + إضافة أول تقييم الآن
                            </button>
                        </div>
                    ) : (
                        <table className="classic-table">
                            <thead>
                                <tr>
                                    <th className="student-col">اسم الطالب</th>
                                    {assessments.map(ass => (
                                        <th key={ass.id} className="th-assessment">
                                            <div className="ass-badge">{ass.type}</div>
                                            <div className="ass-title">{ass.note_ar}</div>
                                            <div style={{ fontSize: '10px', opacity: 0.6 }}>الدرجة الكاملة: {ass.full_mark}</div>
                                            <div className="ass-controls">
                                                <button className="ass-icon-btn trash" onClick={() => handleDeleteAssessment(ass.id)}>🗑️</button>
                                                <button className="ass-icon-btn edit">✏️</button>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="total-col" style={{ textAlign: 'center' }}>المجموع</th>
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
                                                    <span>{std.name_ar}</span>
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
                        <div className="modal-header">إضافة تقييم جديد</div>
                        <div className="modal-field">
                            <label>اسم التقييم (مثلاً: الاختبار التكويني الأول)</label>
                            <input 
                                className="modal-input" 
                                value={newAssess.note_ar} 
                                onChange={e => setNewAssess({...newAssess, note_ar: e.target.value})}
                            />
                        </div>
                        <div className="modal-field">
                            <label>الدرجة الكاملة</label>
                            <input 
                                type="number" 
                                className="modal-input" 
                                value={newAssess.full_mark} 
                                onChange={e => setNewAssess({...newAssess, full_mark: e.target.value})}
                            />
                        </div>
                        <div className="modal-field">
                            <label>نوع التقييم</label>
                            <select 
                                className="modal-input" 
                                value={newAssess.type} 
                                onChange={e => setNewAssess({...newAssess, type: e.target.value})}
                            >
                                <option>اختبار قصير</option>
                                <option>اختبار تكويني</option>
                                <option>مشروع</option>
                                <option>واجب</option>
                            </select>
                        </div>
                        <div className="modal-btns">
                            <button className="p-btn btn-dark" onClick={() => setShowAddModal(false)}>إلغاء</button>
                            <button className="p-btn btn-indigo" onClick={handleAddAssessment}>إضافة</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">تغيير كلمة السر</div>
                        <div className="modal-field">
                            <label>كلمة السر الجديدة</label>
                            <input 
                                type="password"
                                className="modal-input" 
                                value={passData.password} 
                                onChange={e => setPassData({...passData, password: e.target.value})}
                            />
                        </div>
                        <div className="modal-field">
                            <label>تأكيد كلمة السر</label>
                            <input 
                                type="password" 
                                className="modal-input" 
                                value={passData.password_confirmation} 
                                onChange={e => setPassData({...passData, password_confirmation: e.target.value})}
                            />
                        </div>
                        <div className="modal-btns">
                            <button className="p-btn btn-dark" onClick={() => setShowPasswordModal(false)}>إلغاء</button>
                            <button className="p-btn btn-indigo" onClick={handlePasswordChange} disabled={passLoading}>
                                {passLoading ? 'جاري الحفظ...' : 'تحديث كلمة السر'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ActionConfirmModal 
                {...confirmModal}
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
            />
        </div>
    );
}
