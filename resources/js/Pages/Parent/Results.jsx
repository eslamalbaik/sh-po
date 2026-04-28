import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import GroupCard from '@/Components/GroupCard';
import SubjectResultCard from '@/Components/SubjectResultCard';
import '../../../css/ParentPortal.css';

export default function Results({ student, results = [], groups = [], isAdminView = false }) {
    const [lang, setLang] = useState('ar');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [selectedSubj, setSelectedSubj] = useState(null);

    const isAr = lang === 'ar';

    useEffect(() => {
        console.log('Results Page Mount. isAdminView:', isAdminView);
    }, [isAdminView]);



    const getInitials = (name) => {
        if (!name) return 'S';
        const parts = name.split(' ');
        const first = parts[0];
        return first.length >= 2 ? first.substring(0, 2) : first;
    };

    const SUBJECT_ICONS = {
        'الرياضيات': '➗', 'Mathematics': '➗',
        'العلوم': '🔬', 'Science': '🔬', 'علوم عامة': '🔬',
        'اللغة العربية': '📖', 'Arabic Language': '📖',
        'اللغة الانجليزية': '🌐', 'English Language': '🌐',
        'التربية الإسلامية': '🕌', 'Islamic Education': '🕌',
        'الدراسات الاجتماعية': '🌍', 'Social Studies': '🌍',
        'التربية البدنية': '⚽', 'Physical Education': '⚽',
        'الفيزياء': '⚡', 'Physics': '⚡',
        'الكيمياء': '🧪', 'Chemistry': '🧪',
        'الأحياء': '🧬', 'Biology': '🧬',
        'الحاسوب': '💻', 'Computer Science': '💻',
        'الفنون': '🎨', 'Art': '🎨',
    };
    const getIcon = (ar, en) => SUBJECT_ICONS[ar] || SUBJECT_ICONS[en] || '📚';
    const gbg = (p) => p >= 85 ? 'fill-g' : p >= 70 ? 'fill-b' : p >= 50 ? 'fill-a' : 'fill-r';
    const gpill = (p) => p >= 85 ? 'pill-g' : p >= 70 ? 'pill-b' : p >= 50 ? 'pill-a' : 'pill-r';

    // المجموعة حسب المادة
    const bySubj = {};
    
    // 1. إضافة المجموعات الأساسية أولاً (لضمان ظهورها حتى لو فارغة)
    groups.forEach(g => {
        const key = g.id; // UUID المجموعة كـ مفتاح
        if (!bySubj[key]) {
            bySubj[key] = {
                id: g.id,
                type: 'group',
                nameAr: g.name_ar,
                nameEn: g.name_en,
                subjectNameAr: g.subject_name_ar,
                subjectNameEn: g.subject_name_en,
                teacherAr: g.teacher_name_ar,
                teacherEn: g.teacher_name_en,
                evals: []
            };
        }
    });

    // 2. إضافة النتائج الفعلية
    results.forEach(r => {
        // إذا كانت نتيجة مجموعة، نستخدم معرف المجموعة، وإلا نستخدم اسم المادة والمعلم كمفتاح
        const key = r.group_id || `${r.subject_ar}_${r.teacher_ar}`;
        
        if (!bySubj[key]) {
            bySubj[key] = {
                id: r.group_id,
                type: r.group_id ? 'group' : 'section',
                nameAr: r.group_name_ar ? `${r.subject_ar} (${r.group_name_ar})` : r.subject_ar,
                nameEn: r.subject_en,
                subjectNameAr: r.subject_ar,
                subjectNameEn: r.subject_en,
                teacherAr: r.teacher_ar,
                teacherEn: r.teacher_en,
                evals: []
            };
        }
        bySubj[key].evals.push(r);
    });

    const subjects = Object.values(bySubj);

    // حساب الإحصائيات بناءً على متوسط 5 تكليفات
    const subjStats = subjects.map(s => {
        const entered = s.evals.filter(e => e.score !== null && e.score !== undefined && !e.is_absent);
        
        // حساب مجموع النسب المئوية للتكليفات (بحد أقصى 5 تكليفات)
        const totalPercentages = entered.slice(0, 5).reduce((sum, e) => {
            const pct = e.full_mark > 0 ? (parseFloat(e.score) / e.full_mark) * 100 : 0;
            return sum + pct;
        }, 0);

        // المتوسط النهائي (الدرجة النهائية) هو مجموع النسب مقسوماً على 5
        const finalGrade = Math.round(totalPercentages / 5);

        return { 
            tot: finalGrade, 
            full: 100, 
            pct: finalGrade, 
            hasScores: entered.length > 0, 
            count: entered.length 
        };
    });

    const totalScore = subjStats.reduce((a, b) => a + b.tot, 0);
    const totalFull = subjStats.reduce((a, b) => a + b.full, 0);
    const overallAvg = totalFull > 0 ? Math.round((totalScore / totalFull) * 100) : 0;

    const logout = (reason = 'USER_ACTION') => {
        console.log('Logging out. Reason:', reason);
        router.post(route('parent.logout'));
    };

    if (selectedSubj !== null) {
        return <Detail 
            subject={subjects[selectedSubj]} 
            stats={subjStats[selectedSubj]} 
            lang={lang} 
            onBack={() => setSelectedSubj(null)} 
        />;
    }

    return (
        <div className="parent-portal-body">
            <Head title={isAr ? 'نتائج الطالب' : 'Student Results'} />
            
            <div className="top-bar" dir={isAr ? 'rtl' : 'ltr'}>
                {isAr ? (
                    <>
                        <div className="top-school">
                            {isAr ? 'مدرسه مدينه زايد — حلقه ثانيه وثالثه — بنين' : 'Madinat Zayed School — Cycles 2 & 3 — Boys'}
                        </div>
                        <div className="top-student">
                            <div className="top-avatar">{getInitials(isAr ? student.name_ar : student.name_en)}</div>
                            <div className="top-info">
                                <div className="top-name">{isAr ? student.name_ar : student.name_en}</div>
                                <div className="top-class">
                                    {isAr ? 'الصف ' : 'Grade '}
                                    {student.grade?.number || ''}
                                    {isAr ? student.section?.label_ar : student.section?.label_en ? ' — ' + (isAr ? student.section?.label_ar : student.section?.label_en) : ''}
                                </div>
                            </div>
                        </div>
                        <div className="top-left-group">
                            {/* Premium Language Dropdown */}
                            <div className="relative" onMouseLeave={() => setIsLangOpen(false)} style={{ position: 'relative' }}>
                                <button 
                                    onMouseEnter={() => setIsLangOpen(true)}
                                    className="lang-dropdown-trigger"
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        background: 'rgba(255, 255, 255, 0.1)', 
                                        border: '1px solid rgba(255, 255, 255, 0.2)', 
                                        padding: '4px 10px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <img src={lang === 'ar' ? '/uae_flag_circle_1777214736267.png' : '/usa_flag_circle_1777214760165.png'} alt="flag" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                                    <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                                    <svg className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} style={{ width: '12px', height: '12px', transition: 'transform 0.2s', transform: isLangOpen ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {isLangOpen && (
                                    <div className="lang-dropdown-menu" style={{ 
                                        position: 'absolute', 
                                        top: '100%', 
                                        [lang === 'ar' ? 'right' : 'left']: 0, 
                                        background: '#fff', 
                                        borderRadius: '10px', 
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                                        padding: '5px', 
                                        zIndex: 1000, 
                                        minWidth: '130px',
                                        marginTop: '5px',
                                        border: '1px solid #eee'
                                    }}>
                                        <button onClick={() => { setLang('ar'); setIsLangOpen(false); }} className={`lang-item ${lang === 'ar' ? 'active' : ''}`} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px', 
                                            width: '100%', 
                                            padding: '8px 12px', 
                                            border: 'none', 
                                            background: lang === 'ar' ? '#f8fafc' : 'transparent', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer',
                                            textAlign: lang === 'ar' ? 'right' : 'left'
                                        }}>
                                            <img src="/uae_flag_circle_1777214736267.png" alt="uae" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                                            <span style={{ fontWeight: lang === 'ar' ? 'bold' : '500', color: '#1e293b' }}>العربية</span>
                                        </button>
                                        <button onClick={() => { setLang('en'); setIsLangOpen(false); }} className={`lang-item ${lang === 'en' ? 'active' : ''}`} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px', 
                                            width: '100%', 
                                            padding: '8px 12px', 
                                            border: 'none', 
                                            background: lang === 'en' ? '#f8fafc' : 'transparent', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer',
                                            textAlign: lang === 'ar' ? 'right' : 'left'
                                        }}>
                                            <img src="/usa_flag_circle_1777214760165.png" alt="usa" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                                            <span style={{ fontWeight: lang === 'en' ? 'bold' : '500', color: '#1e293b' }}>English</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!isAdminView && (
                                <button className="logout-btn" onClick={logout}>{isAr ? 'خروج' : 'Exit'}</button>
                            )}
                            {isAdminView && (
                                <button className="logout-btn" style={{ background: '#334155' }} onClick={() => window.close()}>{isAr ? 'إغلاق' : 'Close'}</button>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="top-left-group">
                            {/* Premium Language Dropdown */}
                            <div className="relative" onMouseLeave={() => setIsLangOpen(false)} style={{ position: 'relative' }}>
                                <button 
                                    onMouseEnter={() => setIsLangOpen(true)}
                                    className="lang-dropdown-trigger"
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        background: 'rgba(255, 255, 255, 0.1)', 
                                        border: '1px solid rgba(255, 255, 255, 0.2)', 
                                        padding: '4px 10px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <img src={lang === 'ar' ? '/uae_flag_circle_1777214736267.png' : '/usa_flag_circle_1777214760165.png'} alt="flag" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                                    <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
                                    <svg className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} style={{ width: '12px', height: '12px', transition: 'transform 0.2s', transform: isLangOpen ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {isLangOpen && (
                                    <div className="lang-dropdown-menu" style={{ 
                                        position: 'absolute', 
                                        top: '100%', 
                                        [lang === 'ar' ? 'right' : 'left']: 0, 
                                        background: '#fff', 
                                        borderRadius: '10px', 
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                                        padding: '5px', 
                                        zIndex: 1000, 
                                        minWidth: '130px',
                                        marginTop: '5px',
                                        border: '1px solid #eee'
                                    }}>
                                        <button onClick={() => { setLang('ar'); setIsLangOpen(false); }} className={`lang-item ${lang === 'ar' ? 'active' : ''}`} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px', 
                                            width: '100%', 
                                            padding: '8px 12px', 
                                            border: 'none', 
                                            background: lang === 'ar' ? '#f8fafc' : 'transparent', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer',
                                            textAlign: lang === 'ar' ? 'right' : 'left'
                                        }}>
                                            <img src="/uae_flag_circle_1777214736267.png" alt="uae" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                                            <span style={{ fontWeight: lang === 'ar' ? 'bold' : '500', color: '#1e293b' }}>العربية</span>
                                        </button>
                                        <button onClick={() => { setLang('en'); setIsLangOpen(false); }} className={`lang-item ${lang === 'en' ? 'active' : ''}`} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '10px', 
                                            width: '100%', 
                                            padding: '8px 12px', 
                                            border: 'none', 
                                            background: lang === 'en' ? '#f8fafc' : 'transparent', 
                                            borderRadius: '6px', 
                                            cursor: 'pointer',
                                            textAlign: lang === 'ar' ? 'right' : 'left'
                                        }}>
                                            <img src="/usa_flag_circle_1777214760165.png" alt="usa" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                                            <span style={{ fontWeight: lang === 'en' ? 'bold' : '500', color: '#1e293b' }}>English</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!isAdminView && (
                                <button className="logout-btn" onClick={logout}>{isAr ? 'خروج' : 'Exit'}</button>
                            )}
                            {isAdminView && (
                                <button className="logout-btn" style={{ background: '#334155' }} onClick={() => window.close()}>{isAr ? 'إغلاق' : 'Close'}</button>
                            )}
                        </div>
                        <div className="top-student">
                            <div className="top-avatar">{getInitials(isAr ? student.name_ar : student.name_en)}</div>
                            <div className="top-info">
                                <div className="top-name">{isAr ? student.name_ar : student.name_en}</div>
                                <div className="top-class">
                                    {isAr ? 'الصف ' : 'Grade '}
                                    {student.grade?.number || ''}
                                    {isAr ? student.section?.label_ar : student.section?.label_en ? ' — ' + (isAr ? student.section?.label_ar : student.section?.label_en) : ''}
                                </div>
                            </div>
                        </div>
                        <div className="top-school">
                            {isAr ? 'مدرسه مدينه زايد — حلقه ثانيه وثالثه — بنين' : 'Madinat Zayed School — Cycles 2 & 3 — Boys'}
                        </div>
                    </>
                )}
            </div>

            <div className="container" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="sec-panel">
                    <div className="sec-row">
                        <span className="sec-ok">✓</span>
                        <span>{isAr ? 'بياناتك محمية بالكامل' : 'Your data is fully protected'}</span>
                    </div>
                    <div className="sec-row">
                        <span className="sec-ok">✓</span>
                        <span>{isAr ? 'لا تُشارك مع أي طرف ثالث' : 'Never shared with third parties'}</span>
                    </div>
                    <div className="sec-row">
                        <span className="sec-ok">✓</span>
                        <span>{isAr ? 'تسجيل خروج تلقائي بعد انتهاء الجلسة' : 'Automatic logout after session ends'}</span>
                    </div>
                </div>

                <div className="ov-grid">
                    <div className="ov-box">
                        <div className="ov-val" style={{ color: 'var(--green)' }}>{overallAvg}%</div>
                        <div className="ov-lbl">{isAr ? 'متوسط' : 'Average'}</div>
                    </div>
                    <div className="ov-box">
                        <div className="ov-val">{subjects.length}</div>
                        <div className="ov-lbl">{isAr ? 'المواد' : 'Subjects'}</div>
                    </div>
                    <div className="ov-box">
                        <div className="ov-val">{results.filter(r => r.score !== null).length}</div>
                        <div className="ov-lbl">{isAr ? 'التقييمات' : 'Assessments'}</div>
                    </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">{isAr ? 'موادي ومجموعاتي الدراسية' : 'My Subjects & Groups'}</h2>
                </div>

                <div className="subj-list-premium">
                    {subjects.map((s, i) => (
                        <SubjectResultCard
                            key={i}
                            subject={s}
                            stats={subjStats[i]}
                            lang={lang}
                            onClick={() => setSelectedSubj(i)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function Detail({ subject, stats, lang, onBack }) {
    const isAr = lang === 'ar';
    const gbg = (p) => p >= 85 ? 'fill-g' : p >= 70 ? 'fill-b' : p >= 50 ? 'fill-a' : 'fill-r';
    
    // الألوان بناءً على النسبة
    const scoreColor = stats.pct >= 85 ? '#1D9E75' : stats.pct >= 70 ? '#1F4E79' : stats.pct >= 50 ? '#EF9F27' : '#E24B4A';
    const circleBg = stats.pct >= 85 ? '#EAF3DE' : stats.pct >= 70 ? '#E6F1FB' : stats.pct >= 50 ? '#FFF2CC' : '#FCEBEB';
    const levelTxt = stats.pct >= 85 ? (isAr ? 'ممتاز' : 'Excellent') : stats.pct >= 70 ? (isAr ? 'جيد جداً' : 'Very Good') : stats.pct >= 50 ? (isAr ? 'مقبول' : 'Acceptable') : (isAr ? 'يحتاج دعم' : 'Needs Support');

    const typeLabels = { exam: { ar: 'امتحان', en: 'Exam' }, task: { ar: 'مهمة', en: 'Task' }, quiz: { ar: 'اختبار قصير', en: 'Quiz' }, project: { ar: 'مشروع', en: 'Project' }, oral: { ar: 'شفهي', en: 'Oral' } };

    return (
        <div className="parent-portal-body">
            <div className="container" dir={isAr ? 'rtl' : 'ltr'}>
                <button className="back-btn" onClick={onBack}>{isAr ? '← العودة' : '← Back'}</button>
                
                <div className="prog-header">
                    <div className="prog-top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="subj-icon" style={{ width: '46px', height: '46px', fontSize: '22px' }}>📚</div>
                            <div>
                                <div className="prog-subj-name">{isAr ? subject.nameAr : subject.nameEn}</div>
                                <div className="prog-teacher">{isAr ? subject.teacherAr : subject.teacherEn}</div>
                            </div>
                        </div>
                        <div className="prog-pct-circle" style={{ background: circleBg }}>
                            <div className="prog-pct-num" style={{ color: scoreColor }}>{stats.pct}%</div>
                            <div className="prog-pct-lbl" style={{ color: scoreColor }}>{levelTxt}</div>
                        </div>
                    </div>
                    <div className="prog-bar-bg">
                        <div className={`prog-bar-fill ${gbg(stats.pct)}`} style={{ width: `${stats.pct}%` }}></div>
                    </div>
                    <div className="prog-stats">
                        <div className="prog-stat"><div className="prog-stat-val" style={{ color: scoreColor }}>{stats.tot}</div><div className="prog-stat-lbl">{isAr ? 'مجموع الدرجات' : 'Total score'}</div></div>
                        <div className="prog-stat"><div className="prog-stat-val">{stats.full}</div><div className="prog-stat-lbl">{isAr ? 'الدرجة الكاملة' : 'Full mark'}</div></div>
                        <div className="prog-stat"><div className="prog-stat-val">{subject.evals.length}</div><div className="prog-stat-lbl">{isAr ? 'عدد التقييمات' : 'Assessments'}</div></div>
                    </div>
                </div>

                {subject.evals.map((e, i) => {
                    const isNotRecorded = e.score === null || e.score === undefined;
                    const isAbsent = e.is_absent;
                    const epct = e.full_mark > 0 ? Math.round((parseFloat(e.score || 0) / e.full_mark) * 100) : 0;
                    const eColor = isNotRecorded ? '#94a3b8' : isAbsent ? '#E24B4A' : epct >= 85 ? '#1D9E75' : epct >= 70 ? '#1F4E79' : epct >= 50 ? '#EF9F27' : '#E24B4A';
                    
                    return (
                        <div key={i} className="eval-card">
                            <div className="eval-top">
                                <div>
                                    <div className="eval-name">{isAr ? e.assessment_ar : e.assessment_en}</div>
                                    <div className="eval-date">{e.published_at?.split('T')[0] || ''}</div>
                                </div>
                                <span className={`type-badge badge-${e.assessment_type || 'exam'}`}>
                                    {isAr ? typeLabels[e.assessment_type]?.ar : typeLabels[e.assessment_type]?.en}
                                </span>
                            </div>
                            <div className="scores-grid">
                                <div className="score-col">
                                    <div className="score-lbl">{isAr ? 'الدرجة' : 'Score'}</div>
                                    <div>
                                        {isNotRecorded ? (
                                            <span className="score-num" style={{ color: '#94a3b8', fontSize: '16px' }}>{isAr ? 'لم ترصد' : 'Not Recorded'}</span>
                                        ) : isAbsent ? (
                                            <span className="score-num" style={{ color: '#E24B4A', fontSize: '16px' }}>{isAr ? 'غائب' : 'Absent'}</span>
                                        ) : (
                                            <>
                                                <span className="score-num" style={{ color: eColor }}>{e.score}</span>
                                                <span className="score-den">/{e.full_mark}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="score-div"></div>
                                <div className="score-col">
                                    <div className="score-lbl">{isAr ? 'النسبة' : 'Percentage'}</div>
                                    <div>
                                        {isNotRecorded || isAbsent ? (
                                            <span className="score-num" style={{ color: '#94a3b8' }}>-</span>
                                        ) : (
                                            <>
                                                <span className="score-num" style={{ color: eColor }}>{epct}</span>
                                                <span className="score-den">%</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {!isNotRecorded && !isAbsent && (
                                <div className="eval-bar">
                                    <div className={`prog-bar-fill ${gbg(epct)}`} style={{ width: `${epct}%` }}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
