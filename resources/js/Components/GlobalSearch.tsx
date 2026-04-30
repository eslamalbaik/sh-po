import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface SearchResult {
    type: 'Teacher' | 'Student' | 'Subject' | 'Class';
    name: string;
    id: string | number;
    subtext?: string;
    payload?: any;
}

interface Props {
    onSelect: (result: SearchResult) => void;
    placeholder?: string;
    lang?: string;
}

export default function GlobalSearch({ onSelect, placeholder = "بحث عن معلم، طالب، أو مادة...", lang = 'ar' }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // API search logic with debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            const cleanQuery = query.trim();
            if (cleanQuery.length >= 2) {
                setLoading(true);
                try {
                    const response = await axios.get('/api/admin/global-search', {
                        params: { query: cleanQuery }
                    });
                    
                    const data = response.data;
                    const combinedResults: SearchResult[] = [];

                    // Format Teachers
                    if (data.teachers) {
                        data.teachers.forEach((t: any) => {
                            combinedResults.push({
                                type: 'Teacher',
                                name: lang === 'ar' ? t.name_ar : (t.name_en || t.name_ar),
                                id: t.id,
                                subtext: t.user?.email || t.staff_no,
                                payload: t
                            });
                        });
                    }

                    // Format Students
                    if (data.students) {
                        data.students.forEach((s: any) => {
                            combinedResults.push({
                                type: 'Student',
                                name: lang === 'ar' ? s.name_ar : (s.name_en || s.name_ar),
                                id: s.id,
                                subtext: `${lang === 'ar' ? 'رقم الطالب' : 'Student No'}: ${s.student_no}`,
                                payload: s
                            });
                        });
                    }

                    // Format Subjects
                    if (data.subjects) {
                        data.subjects.forEach((subj: any) => {
                            combinedResults.push({
                                type: 'Subject',
                                name: lang === 'ar' ? subj.name_ar : (subj.name_en || subj.name_ar),
                                id: subj.id,
                                payload: subj
                            });
                        });
                    }

                    setResults(combinedResults);
                    setIsOpen(true);
                    setActiveIndex(-1);
                } catch (error) {
                    console.error('Search error:', error);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, lang]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            onSelect(results[activeIndex]);
            setIsOpen(false);
            setQuery('');
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const getBadgeClass = (type: string) => {
        switch (type) {
            case 'Teacher': return 'badge-teacher';
            case 'Subject': return 'badge-subject';
            case 'Student': return 'badge-student';
            case 'Class': return 'badge-class';
            default: return '';
        }
    };

    const getBadgeLabel = (type: string) => {
        const labels: Record<string, Record<string, string>> = {
            ar: { Teacher: 'معلم', Subject: 'مادة', Student: 'طالب', Class: 'شعبة' },
            en: { Teacher: 'Teacher', Subject: 'Subject', Student: 'Student', Class: 'Class' }
        };
        return labels[lang]?.[type] || type;
    };

    const noResultsMsg = lang === 'ar' ? `لم يتم العثور على نتائج لـ "${query}"` : `No results found for "${query}"`;

    return (
        <div className="search-container" ref={containerRef} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    aria-label="Global Search"
                    aria-expanded={isOpen}
                    role="combobox"
                    aria-controls="search-results-list"
                />
                <span className="search-icon">
                    {loading ? <span className="animate-spin text-xs">⏳</span> : '🔍'}
                </span>
            </div>

            {isOpen && query.trim().length >= 2 && (
                <div className="search-results" id="search-results-list" role="listbox">
                    {results.length > 0 ? (
                        results.map((result, index) => (
                            <div
                                key={`${result.type}-${result.id}`}
                                className={`search-item ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => {
                                    onSelect(result);
                                    setIsOpen(false);
                                    setQuery('');
                                }}
                                role="option"
                                aria-selected={index === activeIndex}
                            >
                                <div className="si-info">
                                    <span className="si-name">{result.name}</span>
                                    {result.subtext && <span className="si-subtext">{result.subtext}</span>}
                                </div>
                                <span className={`si-badge ${getBadgeClass(result.type)}`}>
                                    {getBadgeLabel(result.type)}
                                </span>
                            </div>
                        ))
                    ) : !loading && (
                        <div className="search-no-results">{noResultsMsg}</div>
                    )}
                </div>
            )}
        </div>
    );
}
