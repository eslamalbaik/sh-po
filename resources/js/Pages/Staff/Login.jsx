import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const [siteCodeEntered, setSiteCodeEntered] = useState(false);
    const [siteCode, setSiteCode] = useState('');
    const [scError, setScError] = useState(false);
    const [role, setRole] = useState('teacher'); // 'teacher' or 'admin'
    const [lang, setLang] = useState('ar');
    const [showCode, setShowCode] = useState(false);
    const [showLoginPass, setShowLoginPass] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        login_id: '',
        password: '',
        role: 'teacher'
    });

    const dict = {
        ar: {
            title: "بوابة الكادر التعليمي",
            subtitle: "Staff Portal — Restricted Access",
            label: "رمز الدخول / Access Code",
            btn: "دخول / Enter",
            footer: "للحصول على رمز الدخول يرجى",
            contact: "التواصل مع إدارة المدرسة",
            err: "رمز الدخول غير صحيح. يرجى التأكد من الرمز والمحاولة مرة أخرى أو التواصل مع الإدارة.",
            schName: "مدرسة مدينة زايد — حلقة ثانية وثالثة — بنين",
            schYear: "العام الدراسي 2025/2026 — الفصل الدراسي الثالث",
            roleT: "معلم",
            roleA: "Admin",
            lblUser: "رقم المعلم",
            lblAdmin: "اسم المستخدم",
            lblPass: "كلمة المرور",
            btnLog: "دخول",
            secure: "اتصال آمن ومشفر"
        },
        en: {
            title: "Staff Portal",
            subtitle: "Restricted Access — Authorized Only",
            label: "Access Code",
            btn: "Enter",
            footer: "To obtain the access code, please",
            contact: "contact school administration",
            err: "Invalid access code",
            schName: "Madinat Zayed School — Cycles 2 & 3 — Boys",
            schYear: "Academic Year 2025/2026 — Third Term",
            roleT: "Teacher",
            roleA: "Admin",
            lblUser: "Teacher Number",
            lblAdmin: "Username",
            lblPass: "Password",
            btnLog: "Login",
            secure: "Secure & Encrypted Connection"
        }
    };

    const t = dict[lang];

    const handleSiteCode = (e) => {
        e.preventDefault();
        if (siteCode === 'MZS@Staff2026' || siteCode === '2026' || siteCode === '1234') { 
            setSiteCodeEntered(true);
        } else {
            setScError(true);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        data.role = role;
        post(route('login'));
    };

    if (!siteCodeEntered) {
        return (
            <div className="staff-portal-body">
                <Head title="Staff Access" />
                <div className="sitecode-wrap">
                    <div className="lang-switcher">
                        <button className="lang-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
                            {lang === 'ar' ? 'English' : 'العربية'}
                        </button>
                    </div>

                    <div className="sitecode-card">
                        <div className="sitecode-banner">
                            <div className="sitecode-logo">🏫</div>
                            <div className="sitecode-school">
                                مدرسة مدينة زايد<br/>
                                <span style={{fontSize: '14px', fontWeight: 400, opacity: 0.8}}>Madinat Zayed School</span>
                            </div>
                        </div>
                        <form className="sitecode-body" onSubmit={handleSiteCode}>
                            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                                <div className="sitecode-title">{t.title}</div>
                                <div className="sitecode-subtitle">{t.subtitle}</div>
                            </div>
                            
                            <label className="sitecode-label">{t.label}</label>
                            <div className="sitecode-input-wrap">
                                <input 
                                    className="sitecode-input" 
                                    type={showCode ? "text" : "password"} 
                                    value={siteCode}
                                    onChange={e => setSiteCode(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button" 
                                    className="eye-toggle" 
                                    onClick={() => setShowCode(!showCode)}
                                    title={showCode ? "Hide" : "Show"}
                                >
                                    {showCode ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>

                            <button className="sitecode-btn" type="submit">{t.btn}</button>
                            
                            {scError && <div className="sitecode-err">{t.err}</div>}

                            <div className="sitecode-footer">
                                {t.footer} <a href="#" className="sitecode-footer-link">{t.contact}</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="staff-portal-body">
            <Head title="Staff Login" />
            <div className="login-wrap">
                <div className="lang-switcher">
                    <button className="lang-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
                        {lang === 'ar' ? 'English' : 'العربية'}
                    </button>
                </div>

                <div className="login-card">
                    <div className="school-banner">
                        <div className="school-name">{t.schName}</div>
                        <div className="school-year">{t.schYear}</div>
                    </div>
                    <div className="login-body">
                        <div className="role-tabs">
                            <button 
                                className={`role-tab ${role === 'teacher' ? 'active-t' : ''}`}
                                onClick={() => setRole('teacher')}
                            >{t.roleT}</button>
                            <button 
                                className={`role-tab ${role === 'admin' ? 'active-a' : ''}`}
                                onClick={() => setRole('admin')}
                            >{t.roleA}</button>
                        </div>

                        <form onSubmit={submit}>
                            <div className="field">
                                <label>{role === 'admin' ? t.lblAdmin : t.lblUser}</label>
                                <input 
                                    type="text" 
                                    value={data.login_id}
                                    onChange={e => setData('login_id', e.target.value)}
                                    placeholder={role === 'admin' ? 'admin' : 'T001'}
                                />
                            </div>
                            <div className="field">
                                <label>{t.lblPass}</label>
                                <div className="field-input-wrap">
                                    <input 
                                        type={showLoginPass ? "text" : "password"} 
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button" 
                                        className="field-eye" 
                                        onClick={() => setShowLoginPass(!showLoginPass)}
                                    >
                                        {showLoginPass ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {errors.login_id && <div className="err-msg" style={{ display: 'block', textAlign: 'center', marginBottom: '15px' }}>{errors.login_id}</div>}

                            <button 
                                className={`login-btn ${role === 'teacher' ? 'btn-t' : 'btn-a'}`}
                                disabled={processing}
                            >
                                {processing ? '...' : t.btnLog}
                            </button>

                            <div className="login-footer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                {t.secure}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
