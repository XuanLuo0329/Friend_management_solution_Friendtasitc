import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import usePost from './usePost';
import usePut from './usePut';
import useGet from './useGet';
import { MBTISelector } from './Components/MBTISelector';
import { GenderSelector } from './Components/GenderSelector';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const CreateProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Custom hooks for API calls
    const { data: profileData } = useGet(id ? `${API_BASE_URL}/api/user/friend/${id}` : null);
    const { postData } = usePost();
    const { putData } = usePut();
    const { error: verifyError } = useGet(`${API_BASE_URL}/api/auth/verifyToken`, null);

    const [profile, setProfile] = useState({
        name: '',
        birthday: new Date(),
        gender: '',
        relationship: '',
        mbtiType: '',
        hobbies: '',
        skills: '',
        preferences: {
            likes: '',
            dislikes: ''
        },
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Effect to load profile data if id is present
    useEffect(() => {
        if (profileData) {
            setProfile({
                ...profileData,
                birthday: new Date(profileData.birthday)
            });
        }
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "hobbies" || name === "skills") {
            setProfile(prev => ({ ...prev, [name]: value }));
        } else if (name === "likes" || name === "dislikes") {
            setProfile(prev => ({
                ...prev,
                preferences: { ...prev.preferences, [name]: value }
            }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name, value) => {
        setProfile(prev => ({
            ...prev,
            [name]: value 
        }));
    };

    const handleDateChange = (e) => {
        setProfile(prev => ({ ...prev, birthday: new Date(e.target.value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profile.name || !profile.gender || !profile.relationship) {
            setErrorMessage('Name, gender, and relationship are required.');
            return;
        }

        const payload = {
            ...profile,
            birthday: profile.birthday.toISOString(),
        };

        try {
            const response = id ? await putData(`${API_BASE_URL}/api/user/friend/${id}`, payload)
                                : await postData(`${API_BASE_URL}/api/user/friend`, payload);
            console.log('Operation successful:', response);
            navigate('/showAllFriends');
        } catch (error) {
            console.error('Operation failed:', error);
            setErrorMessage(error.message || 'An error occurred');
        }
    };

    const handleCancelButton = () => {
        navigate('/showAllFriends');
    };

     // prevent directly accessing the page
     useEffect(() => {
        if (verifyError) {
            navigate('/login');
        }
    }, [verifyError]);

    return (
        <div className="my-20 mx-auto max-w-md">
            <form className="w-full" onSubmit={handleSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-xl font-semibold leading-7 text-gray-900">Create a profile</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            This information will be recorded in the database and displayed on your contacts page.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2 ">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="Enter full name (first + last)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="birthday" className="block text-sm font-medium leading-6 text-gray-900">
                                    Birthday
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={profile.birthday instanceof Date ? profile.birthday.toISOString().substring(0, 10) : ''}
                                            onChange={handleDateChange}
                                            className="flex-1 rounded-md border-gray-300"
                                        />

                                    </div>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Please select a birth date</p>
                            </div>

                            <div className="sm:col-span-6">
                                <GenderSelector
                                    selectedGender={profile.gender}
                                    onChange={(value) => handleSelectChange('gender', value)}
                                    required
                                />
                            </div>


                            <div className="sm:col-span-6">
                                <div className="sm:col-span-4">
                                    <label htmlFor="relationship" className="block text-sm font-medium leading-6 text-gray-900">
                                        Relationship
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                            <input
                                                type="text"
                                                name="relationship"
                                                value={profile.relationship}
                                                onChange={handleChange}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Describe your relationship with this person (e.g., colleague, friend)"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="sm:col-span-6">
                                <MBTISelector
                                    selectedMBTI={profile.mbtiType}
                                    onChange={(value) => handleSelectChange('mbtiType', value)}
                                />
                            </div>


                            <div className="sm:col-span-6">
                                <label htmlFor="hobbies" className="block text-sm font-medium leading-6 text-gray-900">
                                    Hobbies
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="text"
                                            name="hobbies"
                                            value={profile.hobbies}
                                            onChange={handleChange}
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="Enter this person's hobbies (e.g., reading, swimming)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900">
                                    Skills
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="text"
                                            name="skills"
                                            value={profile.skills}
                                            onChange={handleChange}
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="Enter this person's skills (e.g., programming, public speaking)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="likes" className="block text-sm font-medium leading-6 text-gray-900">
                                    Likes
                                </label>
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        name="likes"
                                        value={profile.preferences.likes}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="List things the person likes, separated by commas (e.g., cats, traveling)"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="dislikes" className="block text-sm font-medium leading-6 text-gray-900">
                                    Dislikes
                                </label>
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        name="dislikes"
                                        value={profile.preferences.dislikes}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="List things the person likes, separated by commas (e.g., cats, traveling)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={handleCancelButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
               
                {errorMessage && (
                    <div className="rounded-md bg-yellow-50 p-4 my-5">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>{errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default CreateProfile;
