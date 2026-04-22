import React, { useState, useEffect } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import GlobalSearch from '@/Components/GlobalSearch';
import AddStudentModal from '@/Components/AddStudentModal';
import TransferStudentModal from '@/Components/TransferStudentModal';
import ActionConfirmModal from '@/Components/ActionConfirmModal';
import axios from 'axios';

export default function Dashboard({ 
    stats = {}, 
    reports = [], 
    all_grades = [], 
    all_sections = [], 
    students_list = [], 
    all_subjects = [] 
}) {
    const [tab, setTab] = useState('teachers');
    const [students, setStudents] = useState([]);
    const [studentLoading, setStudentLoading] = useState(false);
    const [studentFilters, setStudentFilters] = useState({ search: '', grade_id: '', section_id: '', is_active: 'true' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, last: 1 });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, type: 'warning', title: '', message: '' });
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Assignments State
    const [selectedStaff, setSelectedStaff] = useState('');
    const [currentAssignments, setCurrentAssignments] = useState([]);
    const [assignForm, setAssignForm] = useState({ grade_id: '', section_id: '', subject_id: '' });
    const [isAssigning, setIsAssigning] = useState(false);

    const [resetModal, setResetModal] = useState({ open: false, teacher: null });
    const { data: pwdData, setData: setPwdData, post: postPwd, processing: pwdProcessing, errors: pwdErrors, reset: pwdReset } = useForm({
        user_id: '',
        password: '',
        password_confirmation: ''
    });

    const [showPwd1, setShowPwd1] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);

    const [isAdminResetOpen, setIsAdminResetOpen] = useState(false);
    const adminPwd = useForm({
        password: '',
        password_confirmation: ''
    });

    const openResetModal = (teacher) => {
        setResetModal({ open: true, teacher });
        setPwdData({ user_id: teacher.user_id, password: '', password_confirmation: '' });
        setShowPwd1(false);
        setShowPwd2(false);
    };

    const submitReset = (e) => {
        e.preventDefault();
        if (pwdData.password !== pwdData.password_confirmation) {
            alert('كلمتا المرور غير متطابقتين');
            return;
        }
        postPwd(route('admin.reset-password'), {
            onSuccess: () => {
                setResetModal({ open: false, teacher: null });
                pwdReset();
                alert('تم إعادة تعيين كلمة المرور بنجاح.');
            }
        });
    };

    const submitAdminReset = (e) => {
        e.preventDefault();
        if (adminPwd.data.password !== adminPwd.data.password_confirmation) {
            alert('كلمتا المرور غير متطابقتين');
            return;
        }
        adminPwd.post(route('admin.reset-my-password'), {
            onSuccess: () => {
                setIsAdminResetOpen(false);
                adminPwd.reset();
                setConfirmModal({
                    isOpen: true,
                    type: 'success',
                    title: 'تمت العملية بنجاح',
                    message: 'تم تحديث كلمة المرور الخاصة بك بنجاح. يمكنك استخدامها في المرة القادمة.',
                    onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
                });
            }
        });
    };

    const logout = () => router.post(route('logout'));

    const filteredReports = reports.filter(r => {
        const matchesSearch = r.name_ar.includes(search) || (r.name_en && r.name_en.toLowerCase().includes(search.toLowerCase()));
        if (!matchesSearch) return false;
        
        if (filterStatus === 'all') return true;
        if (filterStatus === 'done') return r.completion >= 100;
        if (filterStatus === 'partial') return r.completion > 0 && r.completion < 100;
        if (filterStatus === 'not_started') return r.completion === 0;
        return true;
    });

    // Flatten data for Global Search
    const searchIndex = React.useMemo(() => {
        if (!reports || !Array.isArray(reports)) return [];
        
        const index = [];
        reports.forEach(teacher => {
            const teacherName = teacher.name_ar || teacher.name_en || 'بدون اسم';
            
            // Add teacher
            index.push({
                type: 'Teacher',
                name: teacherName,
                id: teacher.id,
                subtext: `${teacher.assignments?.length || 0} مادة/شعبة`
            });

            // Add subjects and classes
            (teacher.assignments || []).forEach(ass => {
                const subjName = ass.label || ass.subject_id || 'مادة غير معروفة';
                const className = ass.section_name || 'شعبة غير معروفة';
                
                // Unique identifying keys
                const subjId = `t${teacher.id}-sub-${ass.subject_id}-${ass.section_id}`;
                const classId = `t${teacher.id}-cls-${ass.section_id}-${ass.subject_id}`;

                index.push({
                    type: 'Subject',
                    name: subjName,
                    id: subjId,
                    subtext: `بواسطة ${teacherName} — ${className}`,
                    payload: { staffId: teacher.id, sectionId: ass.section_id || 1, subjectId: ass.subject_id || 1 }
                });

                index.push({
                    type: 'Class',
                    name: className,
                    id: classId,
                    subtext: `بواسطة ${teacherName} — ${subjName}`,
                    payload: { staffId: teacher.id, sectionId: ass.section_id || 1, subjectId: ass.subject_id || 1 }
                });
            });
        });
        // Add Students
        if (students_list && Array.isArray(students_list)) {
            students_list.forEach(student => {
                index.push({
                    type: 'Student',
                    name: student.name_ar,
                    id: student.id,
                    subtext: `رقم مالي: ${student.student_no}`
                });
            });
        }

        console.log('Search Index Created:', index.length, 'items');
        return index;
    }, [reports, students_list]);

    const handleSearchSelect = (result) => {
        if (result.type === 'Teacher') {
            setTab('teachers');
            setTimeout(() => {
                const el = document.getElementById(`teacher-card-${result.id}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('highlight-flash');
                    setTimeout(() => el.classList.remove('highlight-flash'), 2000);
                }
            }, 100);
        } else if (result.type === 'Student') {
            setTab('students');
            setStudentFilters(f => ({ ...f, search: result.name }));
        } else {
            // Navigate to grades page for subjects/classes
            router.get(route('admin.subject-grades', result.payload));
        }
    };

    const fetchStudents = async (page = 1) => {
        setStudentLoading(true);
        try {
            const resp = await axios.get(route('api.admin.students'), {
                params: { ...studentFilters, page }
            });
            setStudents(resp.data.data);
            setPagination({ current: resp.data.current_page, last: resp.data.last_page });
        } catch (err) {
            console.error(err);
        } finally {
            setStudentLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 'students') {
            fetchStudents();
        }
    }, [tab, studentFilters]);

    const handleArchiveStudent = (id) => {
        setConfirmModal({
            isOpen: true,
            id: id,
            type: 'warning',
            title: 'تغيير حالة الطالب',
            message: 'هل أنت متأكد من تغيير حالة أرشفة هذا الطالب؟ سيؤثر هذا على ظهوره في القوائم النشطة.'
        });
    };

    const confirmArchive = () => {
        const id = confirmModal.id;
        setConfirmModal(f => ({ ...f, isOpen: false }));
        router.post(route('admin.students.archive', id), {}, {
            onSuccess: () => fetchStudents()
        });
    };

    // Assignments Logic
    const fetchStaffAssignments = async (staffId) => {
        if (!staffId) return;
        try {
            const resp = await axios.get(route('api.admin.staff-assignments', staffId));
            setCurrentAssignments(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (selectedStaff) {
            fetchStaffAssignments(selectedStaff);
        } else {
            setCurrentAssignments([]);
        }
    }, [selectedStaff]);

    const handleAddAssignment = (e) => {
        e.preventDefault();
        setIsAssigning(true);
        router.post(route('admin.assignments.store'), {
            staff_id: selectedStaff,
            ...assignForm
        }, {
            onSuccess: () => {
                fetchStaffAssignments(selectedStaff);
                setIsAssigning(false);
                setAssignForm({ grade_id: '', section_id: '', subject_id: '' });
                setConfirmModal({
                    isOpen: true,
                    type: 'success',
                    title: 'تمت العملية بنجاح',
                    message: 'تمت إضافة التكليف بنجاح إلى سجل المعلم.',
                    onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
                });
            },
            onError: (err) => {
                setIsAssigning(false);
                setConfirmModal({
                    isOpen: true,
                    type: 'danger',
                    title: 'خطأ في العملية',
                    message: err.error || 'حدث خطأ أثناء إضافة التكليف. يرجى التأكد من البيانات.',
                    onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
                });
            }
        });
    };

    const handleDeleteAssignment = (id) => {
        setConfirmModal({
            isOpen: true,
            id: id,
            type: 'danger',
            title: 'حذف تكليف',
            message: 'هل أنت متأكد من رغبتك في حذف هذا التكليف؟ سيؤدي ذلك لإزالة المادة من لوحة المعلم.'
        });
    };

    const performDeleteAssignment = () => {
        const id = confirmModal.id;
        setConfirmModal(f => ({ ...f, isOpen: false }));
        router.delete(route('admin.assignments.destroy', id), {
            onSuccess: () => fetchStaffAssignments(selectedStaff)
        });
    };

    return (
        <div className="admin-portal-body" dir="rtl">
            <Head title="Admin Dashboard" />
            
            <div className="legacy-admin-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="admin-badge-new">ADMIN</span>
                    <span className="admin-title-new">لوحة متابعة الأداء — مدرسة مدينة زايد</span>
                    
                    <GlobalSearch 
                        data={searchIndex} 
                        onSelect={handleSearchSelect} 
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button 
                        onClick={() => setTab('teachers')} 
                        className={`leg-tab-btn ${tab === 'teachers' ? 'active' : ''}`}
                    >المعلمون</button>
                    <button 
                        onClick={() => setTab('students')} 
                        className={`leg-tab-btn ${tab === 'students' ? 'active' : ''}`}
                    >الطلاب</button>
                    <button 
                        onClick={() => setTab('assignments')} 
                        className={`leg-tab-btn ${tab === 'assignments' ? 'active' : ''}`}
                    >التكليفات</button>
                    
                    <button 
                        className="leg-icon-btn" 
                        title="تغيير كلمة المرور الخاصة بك"
                        onClick={() => {
                            setIsAdminResetOpen(true);
                            adminPwd.reset();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                    </button>
                    
                    <button className="leg-logout-btn" onClick={logout}>خروج</button>
                </div>
            </div>

            <div className="leg-kpi-container">
                <div className="leg-kpi-card">
                    <div className="kinfo">
                        <div className="kval" style={{ color: '#bae6fd' }}>{stats.students_count || '1448'}</div>
                        <div className="klbl">طالب مسجل</div>
                    </div>
                    <div className="kicon" style={{ background: 'rgba(51, 65, 85, .5)' }}>🎓</div>
                </div>
                
                <div className="leg-kpi-card">
                    <div className="kinfo">
                        <div className="kval" style={{ color: '#fcd34d' }}>{stats.grades_count || '8673'}</div>
                        <div className="klbl">درجة مدخلة</div>
                    </div>
                    <div className="kicon" style={{ background: 'rgba(51, 65, 85, .5)' }}>✏️</div>
                </div>

                <div className="leg-kpi-card">
                    <div className="kinfo">
                        <div className="kval" style={{ color: '#6ee7b7' }}>{stats.completion || '18'}%</div>
                        <div className="klbl">متوسط الأداء العام</div>
                    </div>
                    <div className="kicon" style={{ background: 'rgba(51, 65, 85, .5)' }}>📊</div>
                </div>

                <div className="leg-kpi-card">
                    <div className="kinfo">
                        <div className="kval" style={{ color: '#f8fafc' }}>{stats.teachers_count || '70'}</div>
                        <div className="klbl">معلم نشط</div>
                    </div>
                    <div className="kicon" style={{ background: 'rgba(51, 65, 85, .5)' }}>👨‍🏫</div>
                </div>
            </div>

            <div className="leg-main-section">
                {tab === 'teachers' && (
                    <>
                        <div className="leg-section-header">
                            <div>
                                <div className="sh-title">تقرير أداء المعلمين</div>
                                <div className="sh-sub">متابعة متوسط تحصيل الطلاب لكل معلم</div>
                            </div>

                            <div className="leg-filters-row">
                                <label className={`leg-filter-label ${filterStatus === 'all' ? 'active-all' : ''}`}>
                                    <input type="radio" name="fs" checked={filterStatus === 'all'} onChange={() => setFilterStatus('all')} />
                                    <span>الكل</span> <span className="f-circle"></span>
                                </label>
                                <label className={`leg-filter-label ${filterStatus === 'done' ? 'active-done' : ''}`}>
                                    <input type="radio" name="fs" checked={filterStatus === 'done'} onChange={() => setFilterStatus('done')} />
                                    <span>أنجز</span> <span style={{ color: '#22c55e', fontSize: '12px' }}>✔</span>
                                </label>
                                <label className={`leg-filter-label ${filterStatus === 'partial' ? 'active-partial' : ''}`}>
                                    <input type="radio" name="fs" checked={filterStatus === 'partial'} onChange={() => setFilterStatus('partial')} />
                                    <span>جزئي</span> <span className="f-diamond"></span>
                                </label>
                                <label className={`leg-filter-label ${filterStatus === 'not_started' ? 'active-not' : ''}`}>
                                    <input type="radio" name="fs" checked={filterStatus === 'not_started'} onChange={() => setFilterStatus('not_started')} />
                                    <span>لم يبدأ</span> <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 700 }}>✖</span>
                                </label>
                            </div>
                        </div>

                        <div className="leg-cards-grid">
                            {filteredReports.map(teacher => {
                                const numSubj = teacher.assignments ? teacher.assignments.length : 0;
                                const completion = teacher.completion || 0;
                                const statusClass = completion >= 100 ? 'done' : (completion > 0 ? 'partial' : 'empty');
                                const statusText = completion >= 60 ? 'أنجز' : (completion > 0 ? 'تحصيل متدني' : 'لم يبدأ');
                                
                                return (
                                    <div key={teacher.id} id={`teacher-card-${teacher.id}`} className="leg-teacher-card">
                                        <div className="ltc-header">
                                            <div className="ltc-name-col">
                                                <div className="ltc-avatar">
                                                    {teacher.name_ar.slice(0, 1)}
                                                </div>
                                                <div style={{ marginRight: '15px' }}>
                                                    <div className="ltc-name">{teacher.name_ar}</div>
                                                    <div className="ltc-meta">{numSubj} مادة/شعبة مكلف بها</div>
                                                </div>
                                            </div>

                                            <div className="ltc-controls">
                                                <button className="ltc-reset-btn" onClick={() => openResetModal(teacher)}>
                                                    إعادة تعيين 🔑
                                                </button>
                                                <div className="ltc-pct-val">{completion}%</div>
                                                <div className={`ltc-badge ltc-badge-${statusClass}`}>
                                                    {statusClass === 'partial' && <span className="f-diamond-s"></span>}
                                                    {statusClass === 'done' && <span style={{ color: '#22c55e' }}>✔</span>}
                                                    {statusClass === 'empty' && <span style={{ color: '#ef4444' }}>✖</span>}
                                                    {statusText} — %{completion}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ltc-progress-track">
                                            <div 
                                                className={`ltc-progress-fill ${statusClass}`}
                                                style={{ width: `${Math.min(completion, 100)}%` }}
                                            />
                                        </div>

                                        <div className="ltc-subjects">
                                            {(teacher.assignments || []).map((ass, idx) => {
                                                const ratStr = ass.completion_ratio || '1/5';
                                                const secStr = ass.section_name || '10Gen';
                                                const pctStr = ass.has_data ? '(20%)' : '(0%)';
                                                
                                                return (
                                                    <Link 
                                                        key={idx} 
                                                        href={route('admin.subject-grades', { staffId: teacher.id, sectionId: ass.section_id || 1, subjectId: ass.subject_id || 1 })} 
                                                        className="ltc-subj-pill link-pill"
                                                    >
                                                        <span className="lsp-icon">👁️</span>
                                                        <span className="lsp-text">
                                                            {pctStr} <span style={{ fontWeight: 700, margin: '0 4px', color: '#1e293b'}}>{ratStr}</span> {secStr} — {ass.label || ass.subject_id}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                            {(!teacher.assignments || teacher.assignments.length === 0) && (
                                              <Link href="#" className="ltc-subj-pill link-pill">
                                                <span className="lsp-icon">👁️</span>
                                                <span className="lsp-text">
                                                    (20%) <span style={{ fontWeight: 700, margin: '0 4px', color: '#1e293b'}}>1/5</span> 8Gen10 — علوم عامة
                                                </span>
                                              </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {tab === 'students' && (
                    <div className="students-tab-content w-full" style={{ animation: 'fadeUp 0.4s ease-out' }}>
                        <div className="st-header-actions mb-6 flex justify-between items-center bg-white/50 backdrop-blur p-4 rounded-xl border border-slate-200/50 shadow-sm">
                            <div className="flex gap-3">
                                <button 
                                    className="btn-add-student bg-[#10b981] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#059669] transition-all shadow-lg shadow-green/20"
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    <span>+</span> إضافة طالب جديد
                                </button>
                                <div className="toggle-archive flex items-center bg-white/80 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                    <button 
                                        className={`px-4 py-2 text-sm font-bold transition-colors ${studentFilters.is_active === 'true' ? 'bg-[#27374D] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                        onClick={() => setStudentFilters(f => ({ ...f, is_active: 'true' }))}
                                    >
                                        النشطون
                                    </button>
                                    <button 
                                        className={`px-4 py-2 text-sm font-bold transition-colors ${studentFilters.is_active === 'false' ? 'bg-[#27374D] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                        onClick={() => setStudentFilters(f => ({ ...f, is_active: 'false' }))}
                                    >
                                        المؤرشفون
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 items-center">
                                <div className="f-select-wrap">
                                    <select 
                                        className="st-filter-select"
                                        value={studentFilters.grade_id}
                                        onChange={e => setStudentFilters(f => ({ ...f, grade_id: e.target.value, section_id: '' }))}
                                    >
                                        <option value="">كل الصفوف</option>
                                        {all_grades.map(g => <option key={g.id} value={g.id}>صف {g.number}</option>)}
                                    </select>
                                </div>
                                <div className="f-select-wrap">
                                    <select 
                                        className="st-filter-select"
                                        value={studentFilters.section_id}
                                        onChange={e => setStudentFilters(f => ({ ...f, section_id: e.target.value }))}
                                        disabled={!studentFilters.grade_id}
                                    >
                                        <option value="">كل الشعب</option>
                                        {all_sections.filter(s => s.grade_id == studentFilters.grade_id).map(s => (
                                            <option key={s.id} value={s.id}>{s.letter} - {s.label_ar}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        className="st-search-input pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white/80 focus:w-[350px] transition-all shadow-sm outline-none focus:border-indigo-400"
                                        placeholder="ابحث بالاسم، الرقم، أو الهوية..."
                                        value={studentFilters.search}
                                        onChange={e => setStudentFilters(f => ({ ...f, search: e.target.value }))}
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
                                </div>
                            </div>
                        </div>

                        <div className="st-table-wrap bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden glass-card">
                            <table className="st-table w-full text-right border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-5 text-slate-400 font-bold text-xs uppercase tracking-wider w-[60px]">#</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm">اسم الطالب</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm">رقم الطالب</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm w-[90px]">الصف</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm w-[90px]">الشعبة</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm">الأداء الأكاديمي</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm text-center">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentLoading ? (
                                        <tr><td colSpan={7} className="p-20 text-center text-slate-400">
                                            <div className="loading-spinner mb-2"></div>
                                            جاري جلب البيانات...
                                        </td></tr>
                                    ) : students.length > 0 ? students.map((std, idx) => (
                                        <tr key={std.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                            <td className="p-5 text-slate-300 text-xs font-mono">{(pagination.current - 1) * 15 + idx + 1}</td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="st-avatar-mini">{std.name_ar.charAt(0)}</div>
                                                    <div className="font-bold text-slate-800">{std.name_ar}</div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-slate-500 font-mono text-sm tracking-tighter">{std.student_no}</td>
                                            <td className="p-5"><span className="st-cell-badge blue">{std.grade?.number}</span></td>
                                            <td className="p-5"><span className="st-cell-badge purple">{std.section?.letter}</span></td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                        <div 
                                                            className={`h-full transition-all duration-1000 ${std.performance >= 60 ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                                                            style={{ width: `${std.performance}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-xs font-black ${std.performance >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>%{std.performance}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        className="st-action-circle blue" 
                                                        title="كشف الدرجات"
                                                        onClick={() => window.open(`/parent/results-direct?sid=${std.id}`, '_blank')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                                    </button>
                                                    <button 
                                                        className="st-action-circle orange" 
                                                        title="نقل الشعبة"
                                                        onClick={() => {
                                                            setSelectedStudent(std);
                                                            setIsTransferModalOpen(true);
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
                                                    </button>
                                                    <button 
                                                        className={`st-action-circle ${std.is_active ? 'rose' : 'emerald'}`} 
                                                        title={std.is_active ? "أرشفة" : "استعادة"}
                                                        onClick={() => handleArchiveStudent(std.id)}
                                                    >
                                                        {std.is_active ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path></svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={7} className="p-20 text-center">
                                            <div className="text-slate-200 text-6xl mb-4">🔍</div>
                                            <div className="text-slate-400 font-bold text-lg">لا يوجد طلاب مطابقين لمعايير البحث</div>
                                        </td></tr>
                                    )}
                                </tbody>
                            </table>
                            {pagination.last > 1 && (
                                <div className="pagination-bar p-5 bg-slate-50/50 flex justify-center items-center gap-3 border-t border-slate-100">
                                    <button 
                                        disabled={pagination.current === 1}
                                        onClick={() => fetchStudents(pagination.current - 1)}
                                        className="p-2 rounded-lg bg-white border shadow-sm disabled:opacity-30"
                                    >←</button>
                                    
                                    <div className="text-xs font-bold text-slate-500 mx-4 uppercase tracking-widest">
                                        الصفحة {pagination.current} من {pagination.last}
                                    </div>

                                    <button 
                                        disabled={pagination.current === pagination.last}
                                        onClick={() => fetchStudents(pagination.current + 1)}
                                        className="p-2 rounded-lg bg-white border shadow-sm disabled:opacity-30"
                                    >→</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === 'assignments' && (
                    <div className="assignments-tab-content w-full" style={{ animation: 'fadeUp 0.4s ease-out' }}>
                        <div className="as-header-box bg-white/50 backdrop-blur p-8 rounded-2xl border border-slate-200/50 shadow-xl mb-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-[#27374D] flex items-center justify-center gap-3">
                                    <span style={{ color: '#3b82f6' }}>📑</span> إدارة تكليفات المعلمين
                                </h2>
                                <p className="text-slate-400 mt-2">إضافة أو حذف شعبة/مادة لكل معلم على النظام</p>
                            </div>

                            <div className="max-w-2xl mx-auto">
                                <div className="f-field">
                                    <label className="f-label text-center">اختر معلماً</label>
                                    <select 
                                        className="f-select text-center font-bold text-lg border-2 border-indigo-100"
                                        value={selectedStaff}
                                        onChange={e => setSelectedStaff(e.target.value)}
                                    >
                                        <option value="">— اختر المعلم —</option>
                                        {reports.map(staff => (
                                            <option key={staff.id} value={staff.id}>{staff.name_ar}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {selectedStaff && (
                            <div className="grid gap-8 animate-fade-in">
                                {/* Current Assignments */}
                                <div className="as-current-panel bg-white p-6 rounded-2xl border border-slate-100 shadow-lg">
                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        📋 التكليفات الحالية
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {currentAssignments.length > 0 ? currentAssignments.map(ass => (
                                            <div key={ass.id} className="as-pill bg-indigo-50/50 border border-indigo-100 px-4 py-2 rounded-xl flex items-center gap-3 group hover:border-rose-200 hover:bg-rose-50 transition-all">
                                                <div className="text-sm">
                                                    <span className="font-black text-indigo-600 group-hover:text-rose-600">
                                                        {ass.section?.grade?.number}{ass.section?.letter}
                                                    </span>
                                                    <span className="mx-2 opacity-30">—</span>
                                                    <span className="font-bold text-slate-700">{ass.subject?.name_ar}</span>
                                                </div>
                                                <button 
                                                    className="w-6 h-6 rounded-full bg-indigo-200/50 text-indigo-600 flex items-center justify-center text-xs hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                    onClick={() => handleDeleteAssignment(ass.id)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )) : (
                                            <div className="w-full text-center py-6 text-slate-400 italic">لا يوجد تكليفات مسندة لهذا المعلم حالياً</div>
                                        )}
                                    </div>
                                </div>

                                {/* Add New Assignment */}
                                <div className="as-add-panel bg-[#27374D] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                                    
                                    <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2 relative z-10">
                                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">➕</span> إضافة تكليف جديد
                                    </h3>

                                    <form onSubmit={handleAddAssignment} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                                        <div className="f-field-dark">
                                            <label className="text-white/60 text-xs block mb-2 mr-2">الصف</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/10 focus:border-indigo-400 outline-none transition-all"
                                                value={assignForm.grade_id}
                                                onChange={e => setAssignForm(f => ({ ...f, grade_id: e.target.value, section_id: '' }))}
                                                required
                                            >
                                                <option value="" className="text-slate-800">— الصف —</option>
                                                {all_grades?.map(g => <option key={g.id} value={g.id} className="text-slate-800">{g.number}</option>)}
                                            </select>
                                        </div>
                                        <div className="f-field-dark">
                                            <label className="text-white/60 text-xs block mb-2 mr-2">الشعبة</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/10 focus:border-indigo-400 outline-none transition-all disabled:opacity-20"
                                                value={assignForm.section_id}
                                                onChange={e => setAssignForm(f => ({ ...f, section_id: e.target.value }))}
                                                required
                                                disabled={!assignForm.grade_id}
                                            >
                                                <option value="" className="text-slate-800">— اختر الصف أولاً —</option>
                                                {all_sections?.filter(s => s.grade_id == assignForm.grade_id).map(s => (
                                                    <option key={s.id} value={s.id} className="text-slate-800">{s.letter} - {s.label_ar}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="f-field-dark">
                                            <label className="text-white/60 text-xs block mb-2 mr-2">المادة</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/10 focus:border-indigo-400 outline-none transition-all"
                                                value={assignForm.subject_id}
                                                onChange={e => setAssignForm(f => ({ ...f, subject_id: e.target.value }))}
                                                required
                                            >
                                                <option value="" className="text-slate-800">— اختر المادة —</option>
                                                {all_subjects?.map(subj => (
                                                    <option key={subj.id} value={subj.id} className="text-slate-800">{subj.name_ar}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={isAssigning || !assignForm.grade_id || !assignForm.section_id || !assignForm.subject_id}
                                            className="bg-[#10b981] hover:bg-[#059669] text-white font-black rounded-xl shadow-lg shadow-green/20 h-[50px] mt-6 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                                        >
                                            {isAssigning ? 'جاري الإضافة...' : 'إضافة تكليف'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Reset Password Modal */}
            {resetModal.open && resetModal.teacher && (
                <div className="reset-modal-overlay">
                    <div className="reset-modal">
                        <div className="rm-header">
                            <button className="rm-close" onClick={() => setResetModal({ open: false, teacher: null })}>✖</button>
                            <span className="rm-title">إعادة تعيين 🔑 — {resetModal.teacher.name_ar}</span>
                        </div>
                        <form onSubmit={submitReset} className="rm-body">
                            <div className="rm-field">
                                <label>كلمة المرور الجديدة</label>
                                <div className="rm-input-wrap">
                                    <input 
                                        type={showPwd1 ? "text" : "password"} 
                                        value={pwdData.password}
                                        onChange={e => setPwdData('password', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <button type="button" className="rm-eye" onClick={() => setShowPwd1(!showPwd1)}>👁️</button>
                                </div>
                                {pwdErrors.password && <div className="rm-err">{pwdErrors.password}</div>}
                            </div>
                            <div className="rm-field" style={{ marginTop: '15px' }}>
                                <label>تأكيد كلمة المرور</label>
                                <div className="rm-input-wrap">
                                    <input 
                                        type={showPwd2 ? "text" : "password"} 
                                        value={pwdData.password_confirmation}
                                        onChange={e => setPwdData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button type="button" className="rm-eye" onClick={() => setShowPwd2(!showPwd2)}>👁️</button>
                                </div>
                            </div>
                            <div className="rm-footer">
                                <button type="submit" className="rm-btn-save" disabled={pwdProcessing}>حفظ</button>
                                <button type="button" className="rm-btn-cancel" onClick={() => setResetModal({ open: false, teacher: null })}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Student Modals */}
            <AddStudentModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                grades={all_grades}
                sections={all_sections}
            />

            <TransferStudentModal
                student={selectedStudent}
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                grades={all_grades}
                sections={all_sections}
            />

            <ActionConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.type === 'danger' ? performDeleteAssignment : confirmArchive}
                onCancel={() => setConfirmModal(f => ({ ...f, isOpen: false }))}
            />
            {/* Admin Self Reset Modal */}
            {isAdminResetOpen && (
                <div className="modal-overlay">
                    <div className="modal-content premium-modal w-[450px]">
                        <div className="modal-header-premium">
                            <div className="icon-circle bg-amber-100 text-amber-600">🔑</div>
                            <h3 className="text-xl font-black text-slate-800">تغيير كلمة المرور الخاصة بك</h3>
                        </div>
                        <form onSubmit={submitAdminReset} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور الجديدة</label>
                                <div className="relative">
                                    <input 
                                        type={showPwd1 ? "text" : "password"}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-all"
                                        value={adminPwd.data.password}
                                        onChange={e => adminPwd.setData('password', e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPwd1(!showPwd1)}
                                        className="absolute left-3 top-3 text-slate-400"
                                    >
                                        {showPwd1 ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                {adminPwd.errors.password && <div className="text-rose-500 text-xs mt-1">{adminPwd.errors.password}</div>}
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <input 
                                        type={showPwd2 ? "text" : "password"}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-all"
                                        value={adminPwd.data.password_confirmation}
                                        onChange={e => adminPwd.setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPwd2(!showPwd2)}
                                        className="absolute left-3 top-3 text-slate-400"
                                    >
                                        {showPwd2 ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button 
                                    type="submit"
                                    disabled={adminPwd.processing}
                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black py-3 rounded-xl shadow-lg shadow-amber-200 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {adminPwd.processing ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsAdminResetOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-400 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all"
                                >إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
