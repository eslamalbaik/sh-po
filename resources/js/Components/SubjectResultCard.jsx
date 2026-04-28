import React from 'react';

export default function SubjectResultCard({ subject, stats, lang, onClick }) {
    const isAr = lang === 'ar';
    
    const SUBJECT_ICONS = {
        'الرياضيات': '÷', 'Mathematics': '÷',
        'العلوم': '🔬', 'Science': '🔬', 'علوم عامة': '🔬',
        'اللغة العربية': '📖', 'Arabic Language': '📖',
        'اللغة الانجليزية': '🌐', 'English Language': '🌐',
        'التربية الإسلامية': '🕋', 'Islamic Education': '🕋',
        'الدراسات الاجتماعية': '📚', 'Social Studies': '📚', 'الدراسات الاجتماعية والتربية الوطنية': '📚',
        'التربية البدنية': '⚽', 'Physical Education': '⚽',
        'الفيزياء': '⚡', 'Physics': '⚡',
        'الكيمياء': '🧪', 'Chemistry': '🧪',
        'الأحياء': '🧬', 'Biology': '🧬',
        'الحاسوب': '💻', 'Computer Science': '💻',
        'الفنون': '🎨', 'Art': '🎨',
    };

    const getIcon = (ar, en) => SUBJECT_ICONS[ar] || SUBJECT_ICONS[en] || '📚';
    const getPillClass = (p) => p >= 85 ? 'g' : p >= 70 ? 'b' : p >= 50 ? 'a' : 'r';
    const getBarColor = (p) => p >= 85 ? '#1D9E75' : p >= 70 ? '#3B82F6' : p >= 50 ? '#EF9F27' : '#E24B4A';

    return (
        <div className="subj-card-premium" onClick={onClick} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="subj-card-top">
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div className="subj-icon-box">
                        {getIcon(subject.subjectNameAr, subject.subjectNameEn)}
                    </div>
                    <div className="subj-info-text">
                        <h3 className="subj-info-name">{isAr ? subject.nameAr : subject.nameEn}</h3>
                        <div className="subj-info-teacher">{isAr ? subject.teacherAr : subject.teacherEn}</div>
                    </div>
                </div>
                <div className={`pct-badge ${getPillClass(stats.pct)}`}>
                    {stats.pct}%
                </div>
            </div>

            <div className="bar-track-premium">
                <div 
                    className="bar-fill-premium" 
                    style={{ 
                        width: `${stats.pct}%`, 
                        backgroundColor: getBarColor(stats.pct) 
                    }}
                ></div>
            </div>

            <div className="subj-card-footer">
                <div className="score-display">
                    <span className="score-current">{stats.tot}</span> / {stats.full}
                </div>
                <div className="eval-count-pill">
                    {stats.count} {isAr ? 'تقييمات' : 'assessments'}
                </div>
            </div>
        </div>
    );
}
