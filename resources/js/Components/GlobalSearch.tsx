import React, { useState, useEffect, useRef } from 'react';

interface SearchResult {
    type: 'Teacher' | 'Subject' | 'Class';
    name: string;
    id: string | number;
    subtext?: string;
    payload?: any;
}

interface Props {
    data: SearchResult[];
    onSelect: (result: SearchResult) => void;
    placeholder?: string;
    lang?: string;
}

export default function GlobalSearch({ data, onSelect, placeholder = "بحث عن معلم، مادة، أو شعبة...", lang = 'ar' }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
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

    // Debounced search logic
    useEffect(() => {
        const timer = setTimeout(() => {
            const cleanQuery = query.trim().toLowerCase();
            if (cleanQuery.length > 0) {
                console.log('Searching for:', cleanQuery);
                const searchTerms = cleanQuery.split(' ');
                
                const filtered = data.filter(item => {
                    const itemName = (item.name || '').toLowerCase();
                    const itemSubtext = (item.subtext || '').toLowerCase();
                    
                    // Match if ALL search terms are found in either name or subtext
                    return searchTerms.every(term => 
                        itemName.includes(term) || itemSubtext.includes(term)
                    );
                }).slice(0, 20);
                
                console.log('Results found:', filtered.length);
                setResults(filtered);
                setIsOpen(true);
                setActiveIndex(-1);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, data]);

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
            case 'Class': return 'badge-class';
            default: return '';
        }
    };

    const getBadgeLabel = (type: string) => {
        const labels: Record<string, Record<string, string>> = {
            ar: { Teacher: 'معلم', Subject: 'مادة', Class: 'شعبة' },
            en: { Teacher: 'Teacher', Subject: 'Subject', Class: 'Class' }
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
                <span className="search-icon">🔍</span>
            </div>

            {isOpen && (
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
                    ) : (
                        <div className="search-no-results">{noResultsMsg}</div>
                    )}
                </div>
            )}
        </div>
    );
}

