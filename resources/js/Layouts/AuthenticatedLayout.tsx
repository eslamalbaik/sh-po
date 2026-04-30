import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, locale } = usePage().props as any;
    const user = auth.user;
    const [lang, setLang] = useState(locale || 'ar');

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const dict = {
        ar: {
            dashboard: 'لوحة التحكم',
            profile: 'الملف الشخصي',
            logout: 'تسجيل الخروج',
        },
        en: {
            dashboard: 'Dashboard',
            profile: 'Profile',
            logout: 'Log Out',
        }
    };

    const t = dict[lang as keyof typeof dict] || dict.ar;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
                                <ApplicationLogo className="h-10 w-auto fill-current text-indigo-600 dark:text-indigo-400" />
                            </Link>

                            <div className="hidden lg:ms-10 lg:flex lg:space-x-8 lg:space-x-reverse gap-2">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="text-sm font-bold"
                                >
                                    {t.dashboard}
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden lg:flex lg:items-center lg:ms-6 gap-6">
                            {/* Language Switcher */}
                            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl shadow-inner">
                                <button 
                                    onClick={() => setLang('ar')} 
                                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${lang === 'ar' ? 'bg-white dark:bg-slate-600 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >AR</button>
                                <button 
                                    onClick={() => setLang('en')} 
                                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-600 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >EN</button>
                            </div>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-all group">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs uppercase shadow-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                                                {user.name}
                                            </span>
                                            <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.profile}</p>
                                            <p className="text-sm font-black text-slate-700 dark:text-slate-200 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2 font-bold py-2.5">
                                            <span>👤</span> {t.profile}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="get" as="button" className="flex items-center gap-2 font-bold py-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                                            <span>🚪</span> {t.logout}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center lg:hidden gap-3">
                            {/* Mobile Lang Toggle */}
                            <button 
                                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-[10px] font-black text-slate-600 dark:text-slate-300"
                            >
                                {lang === 'ar' ? 'EN' : 'AR'}
                            </button>

                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all focus:ring-2 focus:ring-indigo-500"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path 
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} 
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" 
                                    />
                                    <path 
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} 
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" 
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar / Drawer */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 dark:border-slate-700 ${showingNavigationDropdown ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-4 py-6 space-y-2 bg-white dark:bg-slate-800 shadow-inner">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')} className="rounded-xl">
                            {t.dashboard}
                        </ResponsiveNavLink>
                        
                        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700">
                            <div className="px-4 mb-4">
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{user.name}</p>
                                <p className="text-xs font-bold text-slate-500">{user.email}</p>
                            </div>
                            <ResponsiveNavLink href={route('profile.edit')} className="rounded-xl">
                                {t.profile}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="get" href={route('logout')} as="button" className="rounded-xl text-rose-600 font-black">
                                {t.logout}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-100 dark:border-slate-700">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
            </main>
        </div>
    );

}

