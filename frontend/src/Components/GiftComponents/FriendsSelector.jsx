import React, { useState, useEffect } from "react";
import useGet from '../../useGet.js';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
};

function FriendsSelector({onSelect, onReset, disabled}){

    const { data: friends, loading, error } = useGet(`${API_BASE_URL}/api/user/friend`, []);

    const [query, setQuery] = useState('');

    // Initialize selectedFriend from sessionStorage or null
    const [selectedFriend, setSelectedFriend] = useState(() => {
        const saved = sessionStorage.getItem('selectedFriend');
        return saved ? JSON.parse(saved) : null;
    });

    // Save to sessionStorage when selectedFriend changes
    useEffect(() => {
        if (selectedFriend) {
            sessionStorage.setItem('selectedFriend', JSON.stringify(selectedFriend));
        }
    }, [selectedFriend]);

    const handleReset = () => {
        setQuery('');
        setSelectedFriend(null);
        sessionStorage.removeItem('selectedFriend'); // Ensure to clear sessionStorage on reset
        if (onReset) onReset();
    };

    useEffect(() => {
        if (onReset) {
            onReset(handleReset);
        }
    }, [handleReset, onReset]);

    if (loading){ return <div>Loading...</div>; }
    if (error){ return <div>Error fetching friends: {error.message}</div>; }

    const handleSelect = (selectedFriend) => {
        setSelectedFriend(selectedFriend);
        onSelect(selectedFriend);
        setQuery(selectedFriend.name)
    }

    const filteredProfiles = query === ''
        ? friends
        : friends.filter(friend => friend.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div>
            <Combobox as="div" value={selectedFriend} onChange={handleSelect} disabled={disabled}>
                <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Pick a friend<span className="text-red-600">*</span></Combobox.Label>
                <div className="relative mt-2">
                    <Combobox.Input
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(friend) => friend ? friend.name : query}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">     
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button> 
                    {filteredProfiles.length > 0 && (
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredProfiles.map((friend) => (
                                <Combobox.Option
                                    key={friend._id}
                                    value={friend}
                                    className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                        )
                                    }
                                >
                                    {({ active, selected }) => (
                                        <>
                                            <span className={classNames('block truncate', selected && 'font-semibold')}>{friend.name}</span>
                                            {selected && (
                                                <span
                                                    className={classNames(
                                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                                        active ? 'text-white' : 'text-indigo-600'
                                                    )}
                                                >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </div>
            </Combobox>
        </div>
    )
};

export default FriendsSelector;