import React, { useState, Fragment } from 'react';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, Transition } from '@headlessui/react';

interface Option {
    id: string | number;
    label: string;
}

interface Props {
    options?: Option[];
    value: string | number;
    onChange: (id: string | number) => void;
    placeholder?: string;
    lang?: string;
    noResultsText?: string;
    className?: string;
}

export default function SearchableSelect({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "Select...", 
    noResultsText = "No results found",
    className = ""
}: Props) {
    const [query, setQuery] = useState('');

    const filteredOptions = query === ''
        ? options
        : options.filter((option) => {
            const name = (option.label || '').toLowerCase();
            return name.includes(query.toLowerCase());
        });

    const selectedOption = options.find(opt => String(opt.id) === String(value)) || null;

    return (
        <div className={`relative w-full ${className}`}>
            <Combobox value={selectedOption} onChange={(val: Option | null) => onChange(val ? val.id : '')}>
                <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-white text-right sm:text-sm border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all shadow-sm">
                    <ComboboxInput
                        className="w-full border-none py-3 pr-10 pl-3 text-sm leading-5 text-slate-900 focus:ring-0 font-bold outline-none"
                        // @ts-ignore
                        displayValue={(option: Option) => option ? option.label : ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <ComboboxButton className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </ComboboxButton>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-[100] border border-slate-100">
                        {filteredOptions.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-4 px-4 text-slate-500 italic text-center">
                                {noResultsText}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <ComboboxOption
                                    key={option.id}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-3 px-4 ${
                                            active ? 'bg-blue-600 text-white' : 'text-slate-900'
                                        }`
                                    }
                                    value={option}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`block truncate ${selected ? 'font-black' : 'font-medium'}`}>
                                                {option.label}
                                            </span>
                                            {selected ? (
                                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue-600'}`}>
                                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </Transition>
            </Combobox>
        </div>
    );
}
