import tw from 'twin.macro';
import React from 'react';

interface Props {
    categories: string[];
    active: string;
    onChange: (category: string) => void;
}

const CategoryTabs = ({ categories, active, onChange }: Props) => {
    return (
        <div css={tw`flex flex-wrap gap-2 mb-4`}>
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onChange(cat)}
                    css={[
                        tw`px-4 py-2 rounded text-sm font-medium transition-colors duration-150`,
                        active === cat
                            ? tw`bg-primary-600 text-white`
                            : tw`bg-neutral-700 text-neutral-300 hover:bg-neutral-600`
                    ]}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
