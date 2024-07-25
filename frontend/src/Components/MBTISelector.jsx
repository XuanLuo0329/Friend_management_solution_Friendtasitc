import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const mbtiTypes = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
];

export const MBTISelector = ({ selectedMBTI, onChange }) => {
    const [query, setQuery] = useState('');

    const filteredMBTITypes = query === ''
        ? mbtiTypes
        : mbtiTypes.filter(mbti => mbti.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox as="div" value={selectedMBTI} onChange={onChange}>
            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">MBTI Type</Combobox.Label>
            <div className="relative mt-2">
                <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:text-gray-400"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(mbti) => mbti}
                    placeholder='Select an MBTI type'
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>
                
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredMBTITypes.map((mbti, idx) => (
                        <Combobox.Option
                            key={idx}
                            value={mbti}
                            className={({ active }) =>
                                `${active ? 'bg-indigo-600 text-white' : 'text-gray-900'} relative cursor-default select-none py-2 pl-8 pr-4`
                            }
                        >
                            {({ selected }) => (
                                <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{mbti}</span>
                                    {selected && (
                                        <CheckIcon className="absolute inset-y-0 left-0 h-5 w-5 flex items-center pl-1.5 text-indigo-600" aria_hidden="true" />
                                    )}
                                </>
                            )}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    );
};
