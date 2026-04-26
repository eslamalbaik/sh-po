import React, { useState, useEffect } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import GlobalSearch from '@/Components/GlobalSearch';
import AddStudentModal from '@/Components/AddStudentModal';
import AddStaffModal from '@/Components/AddStaffModal';
import AddSubjectModal from '@/Components/AddSubjectModal';
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
    const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
    const [selectedStaffForEdit, setSelectedStaffForEdit] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, last: 1 });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, type: 'warning', title: '', message: '', action: null });
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLangOpen, setIsLangOpen] = useState(false);

    // Language Dictionary
    const [lang, setLang] = useState(localStorage.getItem('admin_lang') || 'ar');
    useEffect(() => {
        localStorage.setItem('admin_lang', lang);
    }, [lang]);

    const dict = {
        ar: {
            adminBadge: "ADMIN",
            adminTitle: "لوحة متابعة الأداء — مدرسة مدينة زايد",
            teachers: "المعلمون",
            students: "الطلاب",
            assignments: "التكليفات",
            changePass: "تغيير كلمة المرور الخاصة بك",
            logout: "خروج",
            studentsCount: "طالب مسجل",
            gradesCount: "درجة مدخلة",
            avgPerformance: "متوسط الأداء العام",
            activeTeachers: "معلم نشط",
            teacherPerformanceReport: "تقرير أداء المعلمين",
            followAvgPerformance: "متابعة متوسط تحصيل الطلاب لكل معلم",
            all: "الكل",
            done: "أنجز",
            partial: "جزئي",
            notStarted: "لم يبدأ",
            lowPerformance: "تحصيل متدني",
            numSubjects: "مادة/شعبة مكلف بها",
            reset: "إعادة تعيين 🔑",
            subject: "مادة",
            section: "شعبة",
            studentName: "اسم الطالب",
            studentNo: "رقم الطالب",
            grade: "الصف",
            academicPerformance: "الأداء الأكاديمي",
            actions: "إجراءات",
            fetchData: "جاري جلب البيانات...",
            noResults: "لا توجد نتائج",
            active: "النشطون",
            archived: "المؤرشفون",
            addNewStudent: "إضافة طالب جديد",
            searchPlaceholder: "ابحث بالاسم، الرقم، أو الهوية...",
            manageAssignments: "إدارة التكليفات",
            manageAssignmentsSub: "إضافة أو حذف شعبة/مادة لكل معلم على النظام",
            selectTeacher: "اختر المعلم",
            currentAssignments: "التكليفات الحالية",
            noAssignments: "لا يوجد تكليفات مسندة لهذا المعلم حالياً",
            addNewAssignment: "إضافة تكليف جديد",
            assigning: "جاري الإضافة...",
            add: "إضافة",
            unknownSubject: "مادة غير معروفة",
            unknownSection: "شعبة غير معروفة",
            passwordMismatch: "كلمتا المرور غير متطابقتين",
            passwordResetSuccess: "تم إعادة تعيين كلمة المرور بنجاح.",
            adminPasswordResetTitle: "تغيير كلمة المرور الخاصة بك",
            adminPasswordResetSuccess: "تم تحديث كلمة المرور الخاصة بك بنجاح. يمكنك استخدامها في المرة القادمة.",
            studentStatusTitle: "تغيير حالة الطالب",
            studentStatusMsg: "هل أنت متأكد من تغيير حالة أرشفة هذا الطالب؟ سيؤثر هذا على ظهوره في القوائم النشطة.",
            assignmentAddSuccess: "تمت إضافة التكليف بنجاح إلى سجل المعلم.",
            assignmentAddError: "حدث خطأ أثناء إضافة التكليف. يرجى التأكد من البيانات.",
            deleteAssignmentTitle: "حذف تكليف",
            deleteAssignmentMsg: "هل أنت متأكد من رغبتك في حذف هذا التكليف؟ سيؤدي ذلك لإزالة المادة من لوحة المعلم.",
            confirm: "تأكيد",
            cancel: "إلغاء",
            save: "حفظ",
            newPassword: "كلمة المرور الجديدة",
            confirmPassword: "تأكيد كلمة المرور",
            selectAll: "تحديد الكل",
            deselectAll: "إلغاء التحديد",
            selectStudents: "تحديد الطلاب",
            scope: "نطاق التكليف",
            wholeClass: "الصف بالكامل",
            selective: "طلاب محددون",
            assignBtn: "تثبيت التكليف",
            teacher: "المعلم",
            addNewSubject: "إضافة مادة جديدة"
        },
        en: {
            adminBadge: "ADMIN",
            adminTitle: "Performance Tracking — Madinat Zayed School",
            teachers: "Teachers",
            students: "Students",
            assignments: "Assignments",
            changePass: "Change your password",
            logout: "Logout",
            studentsCount: "Registered Students",
            gradesCount: "Grades Entered",
            avgPerformance: "Avg General Performance",
            activeTeachers: "Active Teachers",
            teacherPerformanceReport: "Teacher Performance Report",
            followAvgPerformance: "Follow average student attainment per teacher",
            all: "All",
            done: "Done",
            partial: "Partial",
            notStarted: "Not Started",
            lowPerformance: "Low Attainment",
            numSubjects: "subjects/sections assigned",
            reset: "Reset 🔑",
            subject: "Subject",
            section: "Section",
            studentName: "Student Name",
            studentNo: "Student No",
            grade: "Grade",
            academicPerformance: "Academic Performance",
            actions: "Actions",
            fetchData: "Fetching data...",
            noResults: "No results",
            active: "Active",
            archived: "Archived",
            addNewStudent: "Add New Student",
            searchPlaceholder: "Search by name, number, or ID...",
            manageAssignments: "Manage Assignments",
            manageAssignmentsSub: "Add or remove sections/subjects for each teacher",
            selectTeacher: "Select Teacher",
            currentAssignments: "Current Assignments",
            noAssignments: "No assignments assigned to this teacher currently",
            addNewAssignment: "Add New Assignment",
            assigning: "Assigning...",
            add: "Add",
            unknownSubject: "Unknown Subject",
            unknownSection: "Unknown Section",
            passwordMismatch: "Passwords do not match",
            passwordResetSuccess: "Password reset successfully.",
            adminPasswordResetTitle: "Change your password",
            adminPasswordResetSuccess: "Your password has been updated successfully. You can use it next time.",
            studentStatusTitle: "Change Student Status",
            studentStatusMsg: "Are you sure you want to change this student's archive status? This will affect their visibility in active lists.",
            assignmentAddSuccess: "Assignment added successfully to teacher's record.",
            assignmentAddError: "Error adding assignment. Please check the data.",
            deleteAssignmentTitle: "Delete Assignment",
            deleteAssignmentMsg: "Are you sure you want to delete this assignment? This will remove the subject from the teacher's dashboard.",
            confirm: "Confirm",
            cancel: "Cancel",
            save: "Save",
            newPassword: "New Password",
            confirmPassword: "Confirm Password",
            selectAll: "Select All",
            deselectAll: "Deselect All",
            selectStudents: "Select Students",
            scope: "Assignment Scope",
            wholeClass: "Whole Class",
            selective: "Selective Students",
            assignBtn: "Assign Subject",
            teacher: "Teacher",
            addNewSubject: "Add New Subject"
        }
    };

    const t = dict[lang];

    // Assignments State
    const [selectedStaff, setSelectedStaff] = useState('');
    const [currentAssignments, setCurrentAssignments] = useState([]);
    const [assignForm, setAssignForm] = useState({ grade_id: '', section_id: '', subject_id: '' });
    const [isAssigning, setIsAssigning] = useState(false);
    const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
    const [assignmentScope, setAssignmentScope] = useState('whole');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [sectionStudents, setSectionStudents] = useState([]);
    const [loadingSectionStudents, setLoadingSectionStudents] = useState(false);

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
            alert(t.passwordMismatch);
            return;
        }
        postPwd(route('admin.reset-password'), {
            onSuccess: () => {
                setResetModal({ open: false, teacher: null });
                pwdReset();
                alert(t.passwordResetSuccess);
            }
        });
    };

    const submitAdminReset = (e) => {
        e.preventDefault();
        if (adminPwd.data.password !== adminPwd.data.password_confirmation) {
            alert(t.passwordMismatch);
            return;
        }
        adminPwd.post(route('admin.reset-my-password'), {
            onSuccess: () => {
                setIsAdminResetOpen(false);
                adminPwd.reset();
                setConfirmModal({
                    isOpen: true,
                    type: 'success',
                    title: t.done,
                    message: t.adminPasswordResetSuccess,
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
            title: t.studentStatusTitle,
            message: t.studentStatusMsg
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

    useEffect(() => {
        const fetchSectionStudents = async () => {
            if (!assignForm.section_id || assignmentScope !== 'selective') {
                setSectionStudents([]);
                return;
            }
            setLoadingSectionStudents(true);
            try {
                // We use the existing API but with a larger page size or without pagination if possible
                // For simplicity, let's assume 100 students is enough or use a dedicated endpoint if it existed
                const resp = await axios.get(route('api.admin.students'), {
                    params: { section_id: assignForm.section_id, is_active: 'true', per_page: 100 }
                });
                setSectionStudents(resp.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSectionStudents(false);
            }
        };
        fetchSectionStudents();
    }, [assignForm.section_id, assignmentScope]);

    const handleAddAssignment = (e) => {
        e.preventDefault();
        setIsAssigning(true);
        router.post(route('admin.assignments.store'), {
            staff_id: selectedStaff,
            ...assignForm,
            student_ids: assignmentScope === 'selective' ? selectedStudentIds : []
        }, {
            onSuccess: () => {
                fetchStaffAssignments(selectedStaff);
                setIsAssigning(false);
                setAssignForm({ grade_id: '', section_id: '', subject_id: '' });
                setSelectedStudentIds([]);
                setAssignmentScope('whole');
                setConfirmModal({
                    isOpen: true,
                    type: 'success',
                    title: t.done,
                    message: t.assignmentAddSuccess,
                    onConfirm: () => setConfirmModal(f => ({ ...f, isOpen: false })),
                });
            },
            onError: (err) => {
                setIsAssigning(false);
                setConfirmModal({
                    isOpen: true,
                    type: 'danger',
                    title: t.notStarted,
                    message: err.error || t.assignmentAddError,
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
            title: t.deleteAssignmentTitle,
            message: t.deleteAssignmentMsg,
            action: 'delete_assignment'
        });
    };

    const handleDeleteStaff = (id) => {
        setConfirmModal({
            isOpen: true,
            id: id,
            type: 'danger',
            title: lang === 'ar' ? 'حذف معلم' : 'Delete Teacher',
            message: lang === 'ar' ? 'هل أنت متأكد من حذف هذا المعلم نهائياً؟ سيتم حذف حسابه وجميع بياناته.' : 'Are you sure you want to delete this teacher permanently? Their account and all data will be removed.',
            action: 'delete_staff'
        });
    };

    const performDeleteStaff = () => {
        const id = confirmModal.id;
        setConfirmModal(f => ({ ...f, isOpen: false }));
        router.delete(route('admin.staff.destroy', id));
    };

    const performDeleteAssignment = () => {
        const id = confirmModal.id;
        setConfirmModal(f => ({ ...f, isOpen: false }));
        router.delete(route('admin.assignments.destroy', id), {
            onSuccess: () => fetchStaffAssignments(selectedStaff)
        });
    };

    return (
        <div className="admin-portal-body" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Head title={lang === 'ar' ? "لوحة التحكم" : "Admin Dashboard"} />
            <div className="legacy-admin-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="admin-badge-new">{t.adminBadge}</span>
                        <span className="admin-title-new">{t.adminTitle}</span>
                    </div>

                    {/* Premium Language Dropdown */}
                    <div className="relative" onMouseLeave={() => setIsLangOpen(false)}>
                        <button 
                            onMouseEnter={() => setIsLangOpen(true)}
                            className="lang-dropdown-trigger"
                        >
                            <img src={lang === 'ar' ? '/uae_flag_circle_1777214736267.png' : '/usa_flag_circle_1777214760165.png'} alt="flag" />
                            <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                            <svg className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>

                        {isLangOpen && (
                            <div className="lang-dropdown-menu">
                                <button onClick={() => { setLang('ar'); setIsLangOpen(false); }} className={`lang-item ${lang === 'ar' ? 'active' : ''}`}>
                                    <img src="/uae_flag_circle_1777214736267.png" alt="uae" />
                                    <span>العربية</span>
                                </button>
                                <button onClick={() => { setLang('en'); setIsLangOpen(false); }} className={`lang-item ${lang === 'en' ? 'active' : ''}`}>
                                    <img src="/usa_flag_circle_1777214760165.png" alt="usa" />
                                    <span>English</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button 
                        onClick={() => setTab('teachers')} 
                        className={`leg-tab-btn ${tab === 'teachers' ? 'active' : ''}`}
                    >{t.teachers}</button>
                    <button 
                        onClick={() => setTab('students')} 
                        className={`leg-tab-btn ${tab === 'students' ? 'active' : ''}`}
                    >{t.students}</button>
                    <button 
                        onClick={() => setTab('assignments')} 
                        className={`leg-tab-btn ${tab === 'assignments' ? 'active' : ''}`}
                    >{t.assignments}</button>
                    
                    <button 
                        className="leg-icon-btn" 
                        title={t.changePass}
                        onClick={() => {
                            setIsAdminResetOpen(true);
                            adminPwd.reset();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                    </button>
                    
                    <button className="leg-logout-btn" onClick={logout}>{t.logout}</button>
                </div>
            </div>

            <div className="leg-kpi-container">
                <div className="leg-kpi-card">
                    <div className="kinfo">
                        <div className="kval" style={{ color: '#bae6fd' }}>{stats.students_count || '1448'}</div>
                        <div className="klbl">{t.studentsCount}</div>
                    </div>
                    <div className="kicon" style={{ background: 'rgba(51, 65, 85, .5)' }}>🎓</div>
                </div>
                
                <div className="leg-kpi-card">
                    <div className="kinfo">
                        <div className="kval" style={{ color: '#fcd34d' }}>{stats.grades_count || '8673'}</div>
                        <div className="klbl">{t.gradesCount}</div>
                    </div>
                    <div className="kicon" style={{ background: 'rgba(51, 65, 85, .5)' }}>✏️</div>
                </div>

                <div className="leg-kpi-card">
                    <div className="kinfo">
                        <div className="kval" style={{ color: '#6ee7b7' }}>{stats.completion || '18'}%</div>
                        <div className="klbl">{t.avgPerformance}</div>
                    </div>
                    <div className="kicon" style={{ background: 'rgba(51, 65, 85, .5)' }}>📊</div>
                </div>

                <div className="leg-kpi-card">
                    <div className="kinfo">
                        <div className="kval" style={{ color: '#f8fafc' }}>{stats.teachers_count || '70'}</div>
                        <div className="klbl">{t.activeTeachers}</div>
                    </div>
                    <div className="kicon" style={{ background: 'rgba(51, 65, 85, .5)' }}>👨‍🏫</div>
                </div>
            </div>

            <div className="leg-main-section">
                {tab === 'teachers' && (
                    <>
                        <div className="leg-section-header">
                            <div>
                                <div className="sh-title">{t.teacherPerformanceReport}</div>
                                <div className="sh-sub">{t.followAvgPerformance}</div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <button 
                                    className="p-btn btn-indigo" 
                                    style={{ padding: '8px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    onClick={() => { setSelectedStaffForEdit(null); setIsAddStaffOpen(true); }}
                                >
                                    <span>➕</span> {t.addNewTeacher || (lang === 'ar' ? 'إضافة معلم' : 'Add Teacher')}
                                </button>

                                <div className="leg-filters-row">
                                <label className={`leg-filter-label ${filterStatus === 'all' ? 'active-all' : ''}`}>
                                    <input type="radio" name="fs" checked={filterStatus === 'all'} onChange={() => setFilterStatus('all')} />
                                    <span>{t.all}</span> <span className="f-circle"></span>
                                </label>
                                <label className={`leg-filter-label ${filterStatus === 'done' ? 'active-done' : ''}`}>
                                    <input type="radio" name="fs" checked={filterStatus === 'done'} onChange={() => setFilterStatus('done')} />
                                    <span>{t.done}</span> <span style={{ color: '#22c55e', fontSize: '12px' }}>✔</span>
                                </label>
                                <label className={`leg-filter-label ${filterStatus === 'partial' ? 'active-partial' : ''}`}>
                                    <input type="radio" name="fs" checked={filterStatus === 'partial'} onChange={() => setFilterStatus('partial')} />
                                    <span>{t.partial}</span> <span className="f-diamond"></span>
                                </label>
                                <label className={`leg-filter-label ${filterStatus === 'not_started' ? 'active-not' : ''}`}>
                                    <input type="radio" name="fs" checked={filterStatus === 'not_started'} onChange={() => setFilterStatus('not_started')} />
                                    <span>{t.notStarted}</span> <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 700 }}>✖</span>
                                </label>
                            </div>
                        </div>
                    </div>

                        <div className="leg-cards-grid">
                            {filteredReports.map(teacher => {
                                const numSubj = teacher.assignments ? teacher.assignments.length : 0;
                                const completion = teacher.completion || 0;
                                const statusClass = completion >= 100 ? 'done' : (completion > 0 ? 'partial' : 'empty');
                                const statusText = completion >= 60 ? t.done : (completion > 0 ? t.lowPerformance : t.notStarted);
                                
                                return (
                                    <div key={teacher.id} id={`teacher-card-${teacher.id}`} className="leg-teacher-card">
                                        <div className="ltc-header">
                                            <div className="ltc-name-col">
                                                <div className="ltc-avatar">
                                                    {(lang === 'ar' ? teacher.name_ar : (teacher.name_en || teacher.name_ar)).slice(0, 1)}
                                                </div>
                                                <div style={{ marginRight: '15px' }}>
                                                    <div className="ltc-name">{lang === 'ar' ? teacher.name_ar : (teacher.name_en || teacher.name_ar)}</div>
                                                    <div className="ltc-meta">{numSubj} {t.numSubjects}</div>
                                                </div>
                                            </div>

                                            <div className="ltc-controls">
                                                <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                                                    <button className="ltc-reset-btn" onClick={() => openResetModal(teacher)} title={t.reset}>
                                                        🔑
                                                    </button>
                                                    <button 
                                                        className="ltc-reset-btn" 
                                                        style={{ background: '#f1f5f9', color: '#64748b' }} 
                                                        onClick={() => { setSelectedStaffForEdit(teacher); setIsAddStaffOpen(true); }}
                                                        title={lang === 'ar' ? 'تعديل' : 'Edit'}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        className="ltc-reset-btn" 
                                                        style={{ background: '#fee2e2', color: '#ef4444' }} 
                                                        onClick={() => handleDeleteStaff(teacher.id)}
                                                        title={lang === 'ar' ? 'حذف' : 'Delete'}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
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
                                                    (20%) <span style={{ fontWeight: 700, margin: '0 4px', color: '#1e293b'}}>1/5</span> 8Gen10 — {lang === 'ar' ? 'علوم عامة' : 'General Science'}
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
                        <div className="st-header-actions mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                            <div className="flex gap-3">
                                <button 
                                    className="btn-add-student bg-[#10b981] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#059669] transition-all"
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    <span>+</span> {t.addNewStudent}
                                </button>
                                <div className="toggle-archive flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                                    <button 
                                        className={`px-4 py-2 text-sm font-bold transition-colors ${studentFilters.is_active === 'true' ? 'bg-[#27374D] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                        onClick={() => setStudentFilters(f => ({ ...f, is_active: 'true' }))}
                                    >
                                        {t.active}
                                    </button>
                                    <button 
                                        className={`px-4 py-2 text-sm font-bold transition-colors ${studentFilters.is_active === 'false' ? 'bg-[#27374D] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                        onClick={() => setStudentFilters(f => ({ ...f, is_active: 'false' }))}
                                    >
                                        {t.archived}
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
                                        <option value="">{lang === 'ar' ? "كل الصفوف" : "All Grades"}</option>
                                        {all_grades.map(g => <option key={g.id} value={g.id}>{lang === 'ar' ? "صف" : "Grade"} {g.number}</option>)}
                                    </select>
                                </div>
                                <div className="f-select-wrap">
                                    <select 
                                        className="st-filter-select"
                                        value={studentFilters.section_id}
                                        onChange={e => setStudentFilters(f => ({ ...f, section_id: e.target.value }))}
                                        disabled={!studentFilters.grade_id}
                                    >
                                        <option value="">{lang === 'ar' ? "كل الشعب" : "All Sections"}</option>
                                        {all_sections.filter(s => s.grade_id == studentFilters.grade_id).map(s => (
                                            <option key={s.id} value={s.id}>{s.letter} - {lang === 'ar' ? s.label_ar : (s.label_en || s.label_ar)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        className="st-search-input pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:w-[350px] transition-all outline-none focus:border-indigo-400"
                                        placeholder={t.searchPlaceholder}
                                        value={studentFilters.search}
                                        onChange={e => setStudentFilters(f => ({ ...f, search: e.target.value }))}
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
                                </div>
                            </div>
                        </div>

                        <div className="st-table-wrap bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <table className="st-table w-full text-right border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-5 text-slate-400 font-bold text-xs uppercase tracking-wider w-[60px]">#</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm">{t.studentName}</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm">{t.studentNo}</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm w-[90px]">{t.grade}</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm w-[90px]">{t.section}</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm">{t.academicPerformance}</th>
                                        <th className="p-5 text-slate-700 font-extrabold text-sm text-center">{t.actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentLoading ? (
                                        <tr><td colSpan={7} className="p-20 text-center text-slate-400">
                                            <div className="loading-spinner mb-2"></div>
                                            {t.fetchData}
                                        </td></tr>
                                    ) : students.length > 0 ? students.map((std, idx) => (
                                        <tr key={std.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                            <td className="p-5 text-slate-300 text-xs font-mono">{(pagination.current - 1) * 15 + idx + 1}</td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="st-avatar-mini">{(lang === 'ar' ? std.name_ar : (std.name_en || std.name_ar)).charAt(0)}</div>
                                                    <div className="font-bold text-slate-800">{lang === 'ar' ? std.name_ar : (std.name_en || std.name_ar)}</div>
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
                                                        title={std.is_active ? (lang === 'ar' ? "أرشفة" : "Archive") : (lang === 'ar' ? "استعادة" : "Restore")}
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
                                            <div className="text-slate-400 font-bold text-lg">{lang === 'ar' ? "لا يوجد طلاب مطابقين لمعايير البحث" : "No students matching search criteria"}</div>
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
                                        {lang === 'ar' ? "الصفحة" : "Page"} {pagination.current} {lang === 'ar' ? "من" : "of"} {pagination.last}
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
                    <div className="assignments-tab-content w-full" style={{ background: '#fff', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#27374D' }}>📝 {t.manageAssignments}</h2>
                            <p style={{ color: '#94a3b8', marginTop: '5px' }}>{t.manageAssignmentsSub}</p>
                        </div>

                        <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
                            <div className="f-field">
                                <label className="f-label" style={{ textAlign: 'center' }}>{t.selectTeacher}</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select 
                                        className="f-select"
                                        style={{ height: '50px', fontSize: '16px', fontWeight: 'bold', flex: 1 }}
                                        value={selectedStaff}
                                        onChange={e => setSelectedStaff(e.target.value)}
                                    >
                                        <option value="">— {t.selectTeacher} —</option>
                                        {reports.map(staff => (
                                            <option key={staff.id} value={staff.id}>{lang === 'ar' ? staff.name_ar : (staff.name_en || staff.name_ar)}</option>
                                        ))}
                                    </select>
                                    <button 
                                        className="p-btn btn-dark"
                                        style={{ padding: '0 20px', borderRadius: '12px' }}
                                        onClick={() => setIsAddStaffOpen(true)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {selectedStaff && (
                            <div style={{ animation: 'fadeIn 0.4s' }}>
                                {/* Current Assignments */}
                                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '20px' }}>📌 {t.currentAssignments}</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {currentAssignments.length > 0 ? currentAssignments.map(ass => (
                                            <div key={ass.id} className="as-pill" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontWeight: '800', color: '#1c4c6e' }}>{ass.section?.grade?.number}{ass.section?.letter}</span>
                                                <span style={{ color: '#94a3b8' }}>—</span>
                                                <span style={{ fontWeight: 'bold' }}>{lang === 'ar' ? (ass.subject?.name_ar || t.unknownSubject) : (ass.subject?.name_en || ass.subject?.name_ar || t.unknownSubject)}</span>
                                                <button 
                                                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: '22px', height: '22px', borderRadius: '50%', fontSize: '10px', cursor: 'pointer' }}
                                                    onClick={() => handleDeleteAssignment(ass.id)}
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        )) : (
                                            <div style={{ width: '100%', textAlign: 'center', padding: '20px', color: '#94a3b8', fontStyle: 'italic' }}>{t.noAssignments}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Add New Assignment */}
                                <div style={{ background: '#27374D', padding: '30px', borderRadius: '15px', color: '#fff', marginTop: '30px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '25px' }}>➕ {t.addNewAssignment}</h3>
                                    <form onSubmit={handleAddAssignment}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
                                            <div className="f-field">
                                                <label className="f-label" style={{ color: '#fff' }}>{t.grade}</label>
                                                <select className="f-select" style={{ background: '#fff', color: '#1e293b', border: 'none' }} value={assignForm.grade_id} onChange={e => setAssignForm({...assignForm, grade_id: e.target.value, section_id: ''})}>
                                                    <option value="" className="text-slate-800">— {t.grade} —</option>
                                                    {all_grades.map(g => <option key={g.id} value={g.id} className="text-slate-800">{g.number}</option>)}
                                                </select>
                                            </div>
                                            <div className="f-field">
                                                <label className="f-label" style={{ color: '#fff' }}>{t.section}</label>
                                                <select className="f-select" style={{ background: '#fff', color: '#1e293b', border: 'none' }} value={assignForm.section_id} onChange={e => setAssignForm({...assignForm, section_id: e.target.value})} disabled={!assignForm.grade_id}>
                                                    <option value="" className="text-slate-800">— {t.section} —</option>
                                                    {all_sections.filter(s => String(s.grade_id) === String(assignForm.grade_id)).map(s => <option key={s.id} value={s.id} className="text-slate-800">{s.letter}</option>)}
                                                </select>
                                            </div>
                                            <div className="f-field">
                                                <label className="f-label" style={{ color: '#fff' }}>{t.subject}</label>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <select className="f-select" style={{ background: '#fff', color: '#1e293b', border: 'none', flex: 1 }} value={assignForm.subject_id} onChange={e => setAssignForm({...assignForm, subject_id: e.target.value})}>
                                                        <option value="" className="text-slate-800">— {t.subject} —</option>
                                                        {all_subjects.map(s => <option key={s.id} value={s.id} className="text-slate-800">{lang === 'ar' ? s.name_ar : (s.name_en || s.name_ar)}</option>)}
                                                    </select>
                                                    <button 
                                                        type="button"
                                                        className="p-btn btn-indigo"
                                                        style={{ padding: '0 12px', borderRadius: '8px' }}
                                                        onClick={() => setIsAddSubjectOpen(true)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="f-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                <button type="submit" className="p-btn btn-green" style={{ width: '100%', height: '42px', justifyContent: 'center' }} disabled={isAssigning}>
                                                    {isAssigning ? t.assigning : t.add}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Assignment Scope */}
                                        {assignForm.section_id && (
                                            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                                <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#94a3b8' }}>{t.scope}</h4>
                                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                        <input type="radio" checked={assignmentScope === 'whole'} onChange={() => setAssignmentScope('whole')} />
                                                        <span style={{ fontSize: '14px' }}>{t.wholeClass}</span>
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                        <input type="radio" checked={assignmentScope === 'selective'} onChange={() => setAssignmentScope('selective')} />
                                                        <span style={{ fontSize: '14px' }}>{t.selective}</span>
                                                    </label>
                                                </div>

                                                {assignmentScope === 'selective' && (
                                                    <div style={{ animation: 'fadeDown 0.3s ease-out' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{t.selectStudents} ({selectedStudentIds.length})</span>
                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                <button 
                                                                    type="button" 
                                                                    style={{ fontSize: '11px', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}
                                                                    onClick={() => setSelectedStudentIds(sectionStudents.map(s => s.id))}
                                                                >{t.selectAll}</button>
                                                                <button 
                                                                    type="button" 
                                                                    style={{ fontSize: '11px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
                                                                    onClick={() => setSelectedStudentIds([])}
                                                                >{t.deselectAll}</button>
                                                            </div>
                                                        </div>
                                                        
                                                        <div style={{ 
                                                            maxHeight: '250px', 
                                                            overflowY: 'auto', 
                                                            background: '#fff', 
                                                            borderRadius: '10px', 
                                                            padding: '10px',
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                                            gap: '8px'
                                                        }}>
                                                            {loadingSectionStudents ? (
                                                                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px', color: '#94a3b8' }}>{t.fetchData}</div>
                                                            ) : sectionStudents.length > 0 ? sectionStudents.map(student => (
                                                                <label 
                                                                    key={student.id} 
                                                                    style={{ 
                                                                        display: 'flex', 
                                                                        alignItems: 'center', 
                                                                        gap: '8px', 
                                                                        padding: '8px 12px', 
                                                                        background: selectedStudentIds.includes(student.id) ? '#eff6ff' : '#f8fafc',
                                                                        borderRadius: '8px',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s',
                                                                        border: selectedStudentIds.includes(student.id) ? '1px solid #3b82f6' : '1px solid transparent'
                                                                    }}
                                                                >
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={selectedStudentIds.includes(student.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) setSelectedStudentIds([...selectedStudentIds, student.id]);
                                                                            else setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                                                                        }}
                                                                    />
                                                                    <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 'bold' }}>
                                                                        {lang === 'ar' ? student.name_ar : (student.name_en || student.name_ar)}
                                                                    </span>
                                                                </label>
                                                            )) : (
                                                                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px', color: '#94a3b8' }}>{t.noResults}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Teacher Password Reset Modal */}
            {resetModal.open && resetModal.teacher && (
                <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="modal-container premium-modal w-[450px]">
                        <div className="modal-header-blue" style={{ background: '#27374D' }}>
                            <button className="close-btn" onClick={() => setResetModal({ open: false, teacher: null })}>×</button>
                            <h3 className="modal-title">{lang === 'ar' ? "إعادة تعيين كلمة المرور" : "Reset Password"}</h3>
                        </div>
                        <form onSubmit={submitReset} className="modal-body p-8">
                            <div className="text-center mb-6">
                                <div className="text-slate-400 text-xs font-black uppercase mb-1">{t.teacher}</div>
                                <div className="text-lg font-black text-slate-800">{lang === 'ar' ? resetModal.teacher.name_ar : (resetModal.teacher.name_en || resetModal.teacher.name_ar)}</div>
                            </div>

                            <div className="f-field mb-6">
                                <label className="f-label">{t.newPassword}</label>
                                <input 
                                    type="password"
                                    className="f-input"
                                    value={pwdData.password}
                                    onChange={e => setPwdData('password', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="f-field mb-8">
                                <label className="f-label">{t.confirmPassword}</label>
                                <input 
                                    type="password"
                                    className="f-input"
                                    value={pwdData.password_confirmation}
                                    onChange={e => setPwdData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="p-btn btn-indigo flex-1" disabled={pwdProcessing}>
                                    {pwdProcessing ? t.saving : t.save}
                                </button>
                                <button type="button" className="p-btn btn-dark flex-1" onClick={() => setResetModal({ open: false, teacher: null })}>
                                    {t.cancel}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Teacher Modals */}
            <AddStaffModal 
                isOpen={isAddStaffOpen} 
                onClose={() => { setIsAddStaffOpen(false); setSelectedStaffForEdit(null); }}
                lang={lang}
                staff={selectedStaffForEdit}
            />
            <AddStudentModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                grades={all_grades}
                sections={all_sections}
                lang={lang}
            />
            <AddSubjectModal 
                isOpen={isAddSubjectOpen} 
                onClose={() => setIsAddSubjectOpen(false)}
                lang={lang}
            />

            <TransferStudentModal
                student={selectedStudent}
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                grades={all_grades}
                sections={all_sections}
                lang={lang}
            />

            <ActionConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                lang={lang}
                onConfirm={() => {
                    if (confirmModal.action === 'delete_staff') performDeleteStaff();
                    else if (confirmModal.type === 'danger') performDeleteAssignment();
                    else confirmArchive();
                }}
                onCancel={() => setConfirmModal(f => ({ ...f, isOpen: false }))}
            />
            
            {/* Admin Self Reset Modal */}
            {isAdminResetOpen && (
                <div className="modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
