import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function SubjectGrades({ staff, section, subject, assessments, students, grades }) {
    // Helper to get grade for student and assessment
    const getGrade = (studentId, assessmentId) => {
        return grades.find(g => g.student_id === studentId && g.assessment_id === assessmentId);
    };

    // Calculate totals and averages
    const totalStudents = students.length;
    let submittedCount = 0;
    let totalActualScore = 0;
    let totalPossibleScore = 0;
    
    students.forEach(s => {
        let studentHasAnyGrade = false;
        assessments.forEach(a => {
            const g = getGrade(s.id, a.id);
            const score = g ? parseFloat(g.score) : 0;
            const possible = parseFloat(a.full_mark) || 0;
            
            totalActualScore += score;
            totalPossibleScore += possible;
            
            if (score > 0) studentHasAnyGrade = true;
        });
        if (studentHasAnyGrade) submittedCount++;
    });

    const averagePct = totalPossibleScore > 0 ? Math.round((totalActualScore / totalPossibleScore) * 100) : 0;

    return (
        <div className="sg-page" dir="rtl">
            <Head title={`درجات مادة ${subject?.name_ar || ''}`} />

            {/* Navbar */}
            <div className="sg-nav">
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <button className="sg-btn-monitor">
                        <span className="dot"></span> وضع المراقبة
                    </button>
                </div>
                
                <div style={{ flex: 2, textAlign: 'center' }}>
                    <div className="sg-title">{subject?.name_ar || 'المادة'} — {(section?.grade?.number || '')}{(section?.letter || '')}</div>
                    <div className="sg-subtitle">{staff?.name_ar || 'اسم المعلم'}</div>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href={route('admin.dashboard')} className="sg-btn-back">
                        &larr; رجوع
                    </Link>
                </div>
            </div>

            {/* KPIs */}
            <div className="sg-kpi-bar">
                <div className="sg-kpi-card">
                    <div className="sg-kval">{totalStudents}</div>
                    <div className="sg-klbl">إجمالي الطلاب</div>
                </div>
                <div className="sg-kpi-card">
                    <div className="sg-kval">{assessments.length || 1}</div>
                    <div className="sg-klbl">التقييمات</div>
                </div>
                <div className="sg-kpi-card">
                    <div className="sg-kval">{averagePct}%</div>
                    <div className="sg-klbl">المتوسط</div>
                </div>
                <div className="sg-kpi-card">
                    <div className="sg-kval">{submittedCount}/{totalStudents}</div>
                    <div className="sg-klbl">مدخلون</div>
                </div>
            </div>

            {/* Table */}
            <div className="sg-table-container">
                <table className="sg-table">
                    <thead>
                        <tr>
                            <th className="th-student">اسم الطالب</th>
                            {assessments.map(a => (
                                <th key={a.id} className="th-ass">
                                    <div className="th-ass-title">{a.note_ar || a.title || 'تقييم'}</div>
                                    <div className="th-ass-type">{a.type === 'exam' ? 'امتحان' : 'نشاط'}</div>
                                    <div className="th-ass-max">{parseFloat(a.full_mark) || 0} درجة</div>
                                </th>
                            ))}
                            {assessments.length === 0 && (
                                <th className="th-ass">
                                    <div className="th-ass-title">Test1</div>
                                    <div className="th-ass-type">امتحان</div>
                                    <div className="th-ass-max">20 درجة</div>
                                </th>
                            )}
                            <th className="th-sum">المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => {
                            let totalScore = 0;
                            
                            const gradesCols = assessments.length > 0 ? assessments.map(a => {
                                const g = getGrade(student.id, a.id);
                                const score = g ? parseFloat(g.score) : 0;
                                totalScore += score;
                                const isGreen = score > 0;
                                
                                return (
                                    <td key={a.id} className={`td-grade ${isGreen ? 'grade-green' : 'grade-red'}`}>
                                        {score > 0 ? score : '0'}
                                    </td>
                                );
                            }) : (
                                <td className="td-grade grade-red">0</td>
                            );

                            return (
                                <tr key={student.id}>
                                    <td className="td-student">
                                        {idx + 1}. {student.name_ar}
                                    </td>
                                    {gradesCols}
                                    <td className="td-sum">{totalScore > 0 ? totalScore.toFixed(1) : '0.0'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
