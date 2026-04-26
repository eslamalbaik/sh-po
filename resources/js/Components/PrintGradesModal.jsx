import React, { useMemo } from 'react';
import '@/../css/StaffPortal.css'; // Reuse portal styles

export default function PrintGradesModal({ isOpen, onClose, staff, selectedAssignment, students, assessments, grades, lang = 'ar', t }) {
    if (!isOpen) return null;

    const stats = useMemo(() => {
        if (!students.length || !assessments.length) return { total: 0, entered: 0, avg: '0%', passed: '0/0' };
        
        let totalActualScore = 0;
        let entriesCount = 0;
        let successCount = 0;

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
                    hasAnyGrade = true;
                }
            });

            totalActualScore += studentTotal;
            if (hasAnyGrade) entriesCount++;
            if (totalPossiblePerStudent > 0 && (studentTotal / totalPossiblePerStudent) >= 0.5) {
                successCount++;
            }
        });

        const overallAvg = totalPossibleSystem > 0 
            ? ((totalActualScore / totalPossibleSystem) * 100).toFixed(1) 
            : 0;

        return {
            total: students.length,
            entered: entriesCount,
            avg: overallAvg + '%',
            passed: `${successCount} / ${students.length}`
        };
    }, [students, assessments, grades]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="print-modal-overlay" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <style>
                {`
                @media screen {
                    .print-modal-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.8);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: flex-start;
                        padding: 40px 20px;
                        z-index: 9999;
                        overflow-y: auto;
                    }
                    .print-modal-content {
                        background: #fff;
                        width: 100%;
                        max-width: 1100px;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                        position: relative;
                    }
                    .print-modal-actions {
                        width: 100%;
                        max-width: 1100px;
                        display: flex;
                        justify-content: flex-end;
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                }

                @media print {
                    body * { visibility: hidden; }
                    .print-modal-content, .print-modal-content * { visibility: visible; }
                    .print-modal-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0;
                        box-shadow: none;
                    }
                    .no-print { display: none !important; }
                    @page { size: portrait; margin: 1cm; }
                }

                .print-sheet-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 20px;
                }
                .print-title-area h1 {
                    font-size: 28px;
                    color: #1c4c6e;
                    margin: 0;
                    font-weight: 800;
                }
                .print-meta {
                    font-size: 14px;
                    color: #64748b;
                    margin-top: 5px;
                }
                .print-kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .print-kpi-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                }
                .p-kpi-val {
                    font-size: 24px;
                    font-weight: 800;
                    color: #1e293b;
                }
                .p-kpi-lbl {
                    font-size: 12px;
                    color: #64748b;
                    margin-top: 5px;
                    font-weight: 600;
                }
                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                }
                .print-table th {
                    background: #1c4c6e;
                    color: #fff;
                    padding: 8px 5px;
                    text-align: center;
                    border: 1px solid #0f344d;
                    font-size: 11px;
                }
                .print-table td {
                    padding: 5px 8px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                    font-size: 12px;
                }
                .print-table tr:nth-child(even) {
                    background: #f8fafc;
                }
                .std-name-cell {
                    text-align: ${lang === 'ar' ? 'right' : 'left'} !important;
                    font-weight: 700;
                }
                .total-cell-print {
                    font-weight: 800;
                    background: #f1f5f9 !important;
                }
                .score-nan { color: #ef4444; font-weight: 700; background: #fef2f2; }
                .score-val { color: #059669; font-weight: 700; }
                `}
            </style>

            <div className="print-modal-actions no-print">
                <button className="p-btn btn-indigo" onClick={handlePrint}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/><path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/></svg>
                    {t.print}
                </button>
                <button className="p-btn btn-dark" onClick={onClose}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                    {t.close}
                </button>
            </div>

            <div className="print-modal-content">
                <div className="print-sheet-header">
                    <div className="print-title-area">
                        <h1>{lang === 'ar' ? 'كشف الدرجات' : 'Grades Sheet'} — {lang === 'ar' ? selectedAssignment?.subject?.name_ar : selectedAssignment?.subject?.name_en || selectedAssignment?.subject?.name_ar}</h1>
                        <div className="print-meta">
                            {t.schName} | {lang === 'ar' ? 'التاريخ:' : 'Date:'} {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB')} | {lang === 'ar' ? 'الطلاب:' : 'Students:'} {students.length}
                        </div>
                    </div>
                    <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '18px', color: '#1c4c6e' }}>{lang === 'ar' ? staff.name_ar : staff.name_en || staff.name_ar}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedAssignment?.section?.grade?.number}{selectedAssignment?.section?.letter} — {lang === 'ar' ? 'الفصل الدراسي الثالث' : 'Third Term'}</div>
                    </div>
                </div>

                <div className="print-kpi-grid">
                    <div className="print-kpi-card">
                        <div className="p-kpi-val">{stats.total}</div>
                        <div className="p-kpi-lbl">{lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}</div>
                    </div>
                    <div className="print-kpi-card">
                        <div className="p-kpi-val">{stats.entered}</div>
                        <div className="p-kpi-lbl">{t.entries}</div>
                    </div>
                    <div className="print-kpi-card">
                        <div className="p-kpi-val">{stats.avg}</div>
                        <div className="p-kpi-lbl">{lang === 'ar' ? 'المعدل' : 'Average'}</div>
                    </div>
                    <div className="print-kpi-card">
                        <div className="p-kpi-val">{stats.passed}</div>
                        <div className="p-kpi-lbl">{lang === 'ar' ? 'الناجحون' : 'Passed'}</div>
                    </div>
                </div>

                <table className="print-table">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>{t.stdName}</th>
                            <th style={{ width: '15%' }}>{lang === 'ar' ? 'رقم الطالب' : 'Student No.'}</th>
                            {assessments.map(ass => (
                                <th key={ass.id}>
                                    <div>{lang === 'ar' ? ass.note_ar : ass.note_en || ass.note_ar}</div>
                                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{ass.full_mark}</div>
                                </th>
                            ))}
                            <th style={{ width: '10%' }}>{t.total}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((std, idx) => {
                            let rowTotal = 0;
                            return (
                                <tr key={std.id}>
                                    <td className="std-name-cell">{idx + 1}. {lang === 'ar' ? std.name_ar : std.name_en || std.name_ar}</td>
                                    <td>{std.student_no}</td>
                                    {assessments.map(ass => {
                                        const score = grades[`${std.id}_${ass.id}`];
                                        const numScore = parseFloat(score);
                                        if (!isNaN(numScore)) rowTotal += numScore;
                                        
                                        return (
                                            <td key={ass.id} className={score === undefined || score === null || score === '' ? 'score-nan' : 'score-val'}>
                                                {score === undefined || score === null || score === '' ? '—' : (numScore === 0 ? 'A' : numScore)}
                                            </td>
                                        );
                                    })}
                                    <td className="total-cell-print">
                                        {rowTotal > 0 ? rowTotal.toFixed(1) : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

