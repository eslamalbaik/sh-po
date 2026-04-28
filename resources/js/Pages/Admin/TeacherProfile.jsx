import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function TeacherProfile({ staff, reportData = [] }) {
    const [expandedAssignment, setExpandedAssignment] = useState(null);
    const [lang, setLang] = useState(localStorage.getItem('admin_lang') || 'ar');
    const [isLangOpen, setIsLangOpen] = useState(false);

    const dict = {
        ar: {
            back: "العودة للرئيسية",
            profileTitle: "ملف المعلم:",
            statsSubjects: "إجمالي المواد والشعب",
            statsSuccess: "متوسط نسبة النجاح",
            statsStudents: "إجمالي الطلاب",
            detailsTitle: "تفاصيل المواد والصفوف",
            student: "الطالب",
            totalPct: "المجموع %",
            assessments: "تقييمات",
            successRate: "نسبة النجاح",
            overallSuccess: "متوسط نسبة النجاح",
            totalStudents: "إجمالي الطلاب",
        },
        en: {
            back: "Back to Dashboard",
            profileTitle: "Teacher Profile:",
            statsSubjects: "Total Subjects & Sections",
            statsSuccess: "Average Success Rate",
            statsStudents: "Total Students Managed",
            detailsTitle: "Subjects & Sections Details",
            student: "Student",
            totalPct: "Total %",
            assessments: "Assessments",
            successRate: "Success Rate",
            overallSuccess: "Avg Success Rate",
            totalStudents: "Total Students",
        }
    };

    const t = dict[lang];

    const toggleAssignment = (id) => {
        setExpandedAssignment(expandedAssignment === id ? null : id);
    };

    const overallSuccess = reportData.length > 0 
        ? Math.round(reportData.reduce((acc, curr) => acc + curr.success_rate, 0) / reportData.length)
        : 0;

    const totalStudentsManaged = reportData.reduce((acc, curr) => acc + curr.total_students, 0);

    return (
        <div className="admin-portal-body" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Head title={`${t.profileTitle} ${lang === 'ar' ? staff.name_ar : staff.name_en || staff.name_ar}`} />

            <div className="legacy-admin-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href={route('admin.dashboard')} className="leg-logout-btn" style={{ textDecoration: 'none', background: '#334155' }}>
                        {lang === 'ar' ? '⬅️' : '➡️'} {t.back}
                    </Link>

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
                                <button onClick={() => { setLang('ar'); localStorage.setItem('admin_lang', 'ar'); setIsLangOpen(false); }} className={`lang-item ${lang === 'ar' ? 'active' : ''}`}>
                                    <img src="/uae_flag_circle_1777214736267.png" alt="uae" />
                                    <span>العربية</span>
                                </button>
                                <button onClick={() => { setLang('en'); localStorage.setItem('admin_lang', 'en'); setIsLangOpen(false); }} className={`lang-item ${lang === 'en' ? 'active' : ''}`}>
                                    <img src="/usa_flag_circle_1777214760165.png" alt="usa" />
                                    <span>English</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d' }}>{t.profileTitle} {lang === 'ar' ? staff.name_ar : staff.name_en || staff.name_ar}</div>
                    <div style={{ fontSize: '12px', color: '#f8fafc', opacity: 0.8 }}>{staff.staff_no} — {lang === 'ar' ? staff.name_en : staff.name_ar}</div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                {/* Stats Summary */}
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '25px', borderRadius: '20px', color: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>{t.statsSubjects}</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{reportData.length}</div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', padding: '25px', borderRadius: '20px', color: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>{t.statsSuccess}</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{overallSuccess}%</div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', padding: '25px', borderRadius: '20px', color: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>{t.statsStudents}</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalStudentsManaged}</div>
                    </div>
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>{t.detailsTitle}</h2>

                <div className="assignments-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {reportData.map((ass) => (
                        <div key={ass.id} className="ass-card" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div 
                                className="ass-header" 
                                onClick={() => toggleAssignment(ass.id)}
                                style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ background: '#f1f5f9', padding: '10px 15px', borderRadius: '12px', fontWeight: 'bold', color: '#1e293b' }}>{ass.section_name}</div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                            {lang === 'ar' 
                                                ? (ass.subject?.name_ar || ass.subject_name_ar || ass.subject_name) 
                                                : (ass.subject?.name_en || ass.subject?.name_ar || ass.subject_name_en || ass.subject_name_ar || ass.subject_name)
                                            }
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{ass.total_students} {t.totalStudents} — {ass.assessments.length} {t.assessments}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{t.successRate}</div>
                                        <div style={{ fontWeight: 'bold', color: ass.success_rate >= 50 ? '#059669' : '#dc2626' }}>{ass.success_rate}%</div>
                                    </div>
                                    <div style={{ transform: expandedAssignment === ass.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>🔽</div>
                                </div>
                            </div>

                            {expandedAssignment === ass.id && (
                                <div className="ass-content" style={{ padding: '20px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table className="classic-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: '#f1f5f9' }}>
                                                    <th style={{ padding: '12px', textAlign: lang === 'ar' ? 'right' : 'left', borderRadius: lang === 'ar' ? '10px 0 0 10px' : '0 10px 10px 0' }}>{t.student}</th>
                                                    {ass.assessments.map(assess => (
                                                        <th key={assess.id} style={{ padding: '12px', textAlign: 'center', fontSize: '11px' }}>
                                                            {lang === 'ar' ? assess.note_ar : (assess.note_en || assess.note_ar)}<br/>
                                                            <span style={{ opacity: 0.5 }}>({assess.full_mark})</span>
                                                        </th>
                                                    ))}
                                                    <th style={{ padding: '12px', textAlign: 'center', borderRadius: lang === 'ar' ? '0 10px 10px 0' : '10px 0 0 10px' }}>{t.totalPct}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ass.students.map(student => {
                                                    const studentGrades = ass.grades.filter(g => g.student_id === student.id);
                                                    const totalScore = studentGrades.reduce((sum, g) => sum + parseFloat(g.score || 0), 0);
                                                    const totalPossible = ass.assessments.reduce((sum, a) => sum + parseFloat(a.full_mark), 0);
                                                    const pct = totalPossible > 0 ? Math.min(Math.round((totalScore / totalPossible) * 100), 100) : 0;

                                                    return (
                                                        <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                            <td style={{ padding: '12px', fontWeight: '500' }}>{lang === 'ar' ? student.name_ar : (student.name_en || student.name_ar)}</td>
                                                            {ass.assessments.map(assess => {
                                                                const grade = studentGrades.find(g => g.assessment_id === assess.id);
                                                                return (
                                                                    <td key={assess.id} style={{ padding: '12px', textAlign: 'center' }}>
                                                                        {grade ? grade.score : '-'}
                                                                    </td>
                                                                );
                                                            })}
                                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                                <span style={{ 
                                                                    padding: '4px 8px', 
                                                                    borderRadius: '6px', 
                                                                    fontSize: '12px', 
                                                                    fontWeight: 'bold',
                                                                    background: pct >= 50 ? '#dcfce7' : '#fee2e2',
                                                                    color: pct >= 50 ? '#166534' : '#991b1b'
                                                                }}>
                                                                    {pct}%
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .classic-table th { color: #64748b; font-weight: 600; }
                .classic-table td { color: #1e293b; }
                .ass-card:hover { transform: translateY(-2px); transition: all 0.2s; }
            `}} />
        </div>
    );
}
