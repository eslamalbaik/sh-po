import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import '../../../css/ParentPortal.css';

export default function Login() {
    const [lang, setLang] = useState('ar');
    const [showPw, setShowPw] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        student_no: '',
        id_no: '',
    });

    const isAr = lang === 'ar';

    const labels = {
        school: isAr ? 'مدرسة مدينة زايد — حلقة ثانية وثالثة — بنين' : 'Madinat Zayed School — Cycles 2 & 3 — Boys',
        year: isAr ? 'العام الدراسي 2025/2026 — الفصل الدراسي الثالث' : 'Academic Year 2025/2026 — Third Semester',
        portal: isAr ? '🎓 بوابة أولياء الأمور' : '🎓 Parent Portal',
        student_no: isAr ? 'رقم الطالب' : 'Student Number',
        id_no: isAr ? 'رقم هوية الطالب' : 'Student ID Number',
        login: isAr ? 'دخول' : 'Sign In',
        secure: isAr ? 'اتصال آمن ومشفّر' : 'Secure encrypted connection',
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('parent.login'));
    };

    return (
        <div className="parent-portal-body">
            <Head title={isAr ? 'بوابة أولياء الأمور' : 'Parent Portal'} />
            
            <div className="login-wrap" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="login-card">
                    <div className="login-banner">
                        <div className="login-logo">🏫</div>
                        <div className="login-school">{labels.school}</div>
                        <div className="login-year">{labels.year}</div>
                    </div>
                    
                    <div className="login-body">
                        <div className="lang-row">
                            <button 
                                className={`lang-btn ${lang === 'ar' ? 'on' : ''}`}
                                onClick={() => setLang('ar')}
                            >العربية</button>
                            <button 
                                className={`lang-btn ${lang === 'en' ? 'on' : ''}`}
                                onClick={() => setLang('en')}
                            >English</button>
                        </div>

                        <div className="portal-badge">{labels.portal}</div>

                        <form onSubmit={submit}>
                            <div className="field">
                                <label>{labels.student_no}</label>
                                <input 
                                    type="text"
                                    value={data.student_no}
                                    onChange={e => setData('student_no', e.target.value)}
                                    placeholder="2025001"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="field">
                                <label>{labels.id_no}</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPw ? "text" : "password"}
                                        value={data.id_no}
                                        onChange={e => setData('id_no', e.target.value)}
                                        placeholder="••••••••"
                                        style={{ paddingRight: isAr ? '14px' : '40px', paddingLeft: isAr ? '40px' : '14px' }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPw(!showPw)}
                                        style={{
                                            position: 'absolute',
                                            [isAr ? 'left' : 'right']: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {showPw ? '🙈' : '👁'}
                                    </button>
                                </div>
                            </div>

                            {errors.login && <div className="err-msg">{errors.login}</div>}

                            <button 
                                className="login-btn" 
                                disabled={processing}
                                type="submit"
                            >
                                {processing ? '...' : labels.login}
                            </button>
                        </form>

                        <div className="sec-badge">
                            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                                <path d="M10 2L3 6v5c0 4 3.5 7.5 7 8.5C13.5 18.5 17 15 17 11V6L10 2z" stroke="#1D9E75" strokeWidth="1.5"/>
                                <path d="M7 10l2 2 4-4" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span>{labels.secure}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
