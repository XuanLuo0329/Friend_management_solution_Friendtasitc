// RelationshipSelector.js
import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export const RelationshipSelector = ({ selectedRelationship, onChange, customRelationship, setCustomRelationship }) => {
    const [query, setQuery] = useState('');
    const relationshipTypes = [
        { id: 1, name: "Friend" },
        { id: 2, name: "Family" },
        { id: 3, name: "Colleague" },
        { id: 4, name: "Classmate" },
        { id: 5, name: "Other" }
    ];
    
    const filteredRelationshipTypes = query === ''
        ? relationshipTypes
        : relationshipTypes.filter(relationship => relationship.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div>
            <Combobox as="div" value={selectedRelationship} onChange={(value) => onChange('relationship', value)}>
                <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Relationship</Combobox.Label>
                <div className="relative mt-2">
                    <Combobox.Input
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 placeholder:text-gray-400"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(relationship) => relationship?.name}
                        placeholder='Select a relationship type'
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredRelationshipTypes.map((relationship) => (
                            <Combobox.Option
                                key={relationship.id}
                                value={relationship}
                                className={({ active }) =>
                                    `${active ? 'bg-indigo-600 text-white' : 'text-gray-900'} relative cursor-default select-none py-2 pl-8 pr-4`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{relationship.name}</span>
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </div>
            </Combobox>
            {selectedRelationship?.name === 'Other' && (
                <input
                    type="text"
                    name="customRelationship"
                    value={customRelationship}
                    onChange={(e) => setCustomRelationship(e.target.value)}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Specify relationship"
                />
            )}
        </div>
    );
};
