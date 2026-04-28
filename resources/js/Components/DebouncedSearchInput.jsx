import React, { useState, useEffect } from 'react';

export default function DebouncedSearchInput({ 
    onSearch, 
    placeholder = "بحث...", 
    delay = 500,
    className = ""
}) {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(searchTerm);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, delay, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full h-[38px] pl-10 pr-4 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                dir="auto"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        </div>
    );
}
