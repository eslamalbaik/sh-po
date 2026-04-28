import React from 'react';

export default function GroupCard({ item, onViewResults, onEditStudents, onDelete, lang = 'ar' }) {
    const isAr = lang === 'ar';
    const isGroup = item.type === 'group';

    // Tailwind base classes for premium look
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between" dir={isAr ? 'rtl' : 'ltr'}>
            
            {/* Top section: Icon & Title */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${isGroup ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-blue-500'}`}>
                        {isGroup ? '👥' : '📚'}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 line-clamp-1" title={isAr ? item.name_ar : item.name_en}>
                            {isAr ? item.name_ar : item.name_en}
                        </h3>
                        <div className="text-sm text-slate-500 font-medium mt-1">
                            {isAr ? item.teacher_name_ar : item.teacher_name_en}
                        </div>
                    </div>
                </div>
                
                {/* Delete button (only for groups) */}
                {isGroup && onDelete && (
                    <button 
                        onClick={() => onDelete(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title={isAr ? 'حذف' : 'Delete'}
                    >
                        🗑️
                    </button>
                )}
            </div>

            {/* Description (if any) */}
            {item.description && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {item.description}
                </p>
            )}

            {/* Stats section */}
            <div className="flex items-center gap-6 mb-6 mt-auto">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{isAr ? 'الطلاب' : 'Students'}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="font-bold text-slate-700">{item.students_count}</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{isAr ? 'الصف' : 'Grade'}</span>
                    <div className="mt-1 font-bold text-slate-700">
                        {item.grade_name || (isAr ? 'عام' : 'General')}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : 'flex-row'} justify-end border-t border-slate-50 pt-4 mt-2`}>
                {isGroup && onEditStudents && (
                    <button 
                        onClick={() => onEditStudents(item)}
                        className="px-4 py-2 rounded-xl bg-[#1D9E75] text-white font-bold text-sm hover:brightness-110 shadow-md shadow-emerald-100 transition-all flex-1 text-center"
                    >
                        {isAr ? 'تعديل الطلاب' : 'Edit Students'}
                    </button>
                )}
                
                <button 
                    onClick={() => onViewResults(item)}
                    className="px-4 py-2 rounded-xl bg-[#1c4c6e] text-white font-bold text-sm hover:brightness-110 shadow-md shadow-slate-200 transition-all flex-1 text-center"
                >
                    {isAr ? 'رصد / عرض الدرجات' : 'Enter / View Grades'}
                </button>
            </div>
        </div>
    );
}
