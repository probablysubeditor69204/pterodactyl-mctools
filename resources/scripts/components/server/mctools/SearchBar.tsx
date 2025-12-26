import tw from 'twin.macro';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    provider: string;
    setProvider: (provider: string) => void;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    sort: string;
    onSortChange: (sort: string) => void;
}

const SearchBar = ({ value, onChange, placeholder, provider, setProvider, page, totalPages, onPageChange, sort, onSortChange }: Props) => {
    const [showSort, setShowSort] = useState(false);

    const sorts = [
        { label: 'Downloads', value: 'downloads' },
        { label: 'Relevance', value: 'relevance' },
        { label: 'Last Updated', value: 'updated' },
    ];

    const currentSortLabel = sorts.find(s => s.value === sort)?.label || 'Downloads';

    return (
        <div css={tw`mb-4`}>
            {/* Search Input */}
            <div className={'group'} css={tw`relative mb-4`}>
                <div css={tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400`}>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    css={tw`appearance-none outline-none w-full min-w-0 p-3 pl-10 border-2 rounded text-sm transition-all duration-150 bg-neutral-600 border-neutral-500 hover:border-neutral-400 text-neutral-200 shadow-none focus:ring-0 focus:shadow-md focus:border-primary-300 focus:ring-2 focus:ring-primary-400`}
                />
            </div>

            {/* Controls Row */}
            <div css={tw`flex flex-wrap items-center justify-between gap-2`}>
                <div css={tw`flex items-center space-x-2`}>
                    {/* Provider Toggle */}
                    <button
                        onClick={() => setProvider(provider === 'modrinth' ? 'curseforge' : 'modrinth')}
                        css={tw`px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm text-neutral-300 transition-colors duration-150`}
                    >
                        Provider: <span css={tw`font-bold text-primary-400`}>{provider}</span>
                    </button>

                    {/* Sort Dropdown */}
                    <div css={tw`relative`}>
                        <button
                            onClick={() => setShowSort(!showSort)}
                            css={tw`px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm text-neutral-300 transition-colors duration-150 flex items-center space-x-2`}
                        >
                            <span>Sort: <span css={tw`font-bold`}>{currentSortLabel}</span></span>
                            <FontAwesomeIcon icon={faChevronDown} css={tw`text-xs`} />
                        </button>

                        {showSort && (
                            <div css={tw`absolute top-full left-0 mt-1 w-48 bg-neutral-700 border border-neutral-600 rounded shadow-lg z-50 overflow-hidden`}>
                                {sorts.map(s => (
                                    <div
                                        key={s.value}
                                        onClick={() => { onSortChange(s.value); setShowSort(false); }}
                                        css={[
                                            tw`px-4 py-2 text-sm cursor-pointer transition-colors duration-150`,
                                            sort === s.value ? tw`bg-primary-600 text-white` : tw`text-neutral-300 hover:bg-neutral-600`
                                        ]}
                                    >
                                        {s.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Pagination */}
                {totalPages > 1 && (
                    <div css={tw`flex items-center space-x-1`}>
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={page === 1}
                            css={[
                                tw`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors duration-150`,
                                page === 1 ? tw`bg-primary-600 text-white` : tw`bg-neutral-700 text-neutral-300 hover:bg-neutral-600`
                            ]}
                        >
                            1
                        </button>
                        {page > 2 && <span css={tw`text-neutral-500 text-sm px-1`}>...</span>}
                        {page !== 1 && page !== totalPages && (
                            <button
                                css={tw`w-8 h-8 flex items-center justify-center rounded bg-primary-600 text-white text-sm font-medium`}
                            >
                                {page}
                            </button>
                        )}
                        {page < totalPages - 1 && <span css={tw`text-neutral-500 text-sm px-1`}>...</span>}
                        {totalPages > 1 && (
                            <button
                                onClick={() => onPageChange(totalPages)}
                                disabled={page === totalPages}
                                css={[
                                    tw`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors duration-150`,
                                    page === totalPages ? tw`bg-primary-600 text-white` : tw`bg-neutral-700 text-neutral-300 hover:bg-neutral-600`
                                ]}
                            >
                                {totalPages}
                            </button>
                        )}
                        <button
                            disabled={page === totalPages}
                            onClick={() => onPageChange(page + 1)}
                            css={tw`ml-1 w-8 h-8 flex items-center justify-center rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <FontAwesomeIcon icon={faChevronRight} css={tw`text-xs`} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
