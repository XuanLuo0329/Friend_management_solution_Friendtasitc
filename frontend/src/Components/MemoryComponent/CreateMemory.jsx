import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateMemory() {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        title: '',
        tag: '',
        date: '',
        description: '', 
        image: null // Store single image file
    });

    const [preview, setPreview] = useState(); // For image preview
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (formData.image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(formData.image);
        } else {
            setPreview(null);
        }
    }, [formData.image]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        setFormData(prev => ({
            ...prev,
            image: event.target.files[0]
         // Update to handle single file
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submission started');

        if (!formData.title || !formData.description) {
            setFormErrors({
                ...formErrors,
                title: !formData.title ? 'Title is required' : '',
                description: !formData.description ? 'Description is required' : '',
            });
            return; // Stop the form from submitting until errors are fixed
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token available.");// If no token is available, it means the user is not logged in
            navigate('/login');
            return // Redirect to the login page
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('tag', formData.tag);
        data.append('date', formData.date);
        data.append('description', formData.description);

        if (formData.image) {
            data.append('image', formData.image);
        }

        // Verify the contents of `FormData` before sending
        for (const [key, value] of data.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            console.log('Sending request to the server...');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
            const url = `${API_BASE_URL}/api/user/memories`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Memory created successfully:', result);
                navigate('/showAllMemories'); // Redirect to the memory list page
            } else {
                console.error('Failed to create memory with status: ', response.status);
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Failed to create memory');
            }
        } catch (error) {
            console.error("Error creating memory:", error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-5">
            <h1 className="text-xl font-bold mb-5">Create New Memory</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="flex flex-col gap-1">
                    Title: <span className="text-red-500">{formErrors.title}</span>
                    <input type="text" name="title" data-testid="titleError" value={formData.title} onChange={handleChange} required className="p-2 border border-gray-300 rounded" />
                </label>
                <label className="flex flex-col gap-1">
                    Tag:
                    <input type="text" name="tag" value={formData.tag} onChange={handleChange} className="p-2 border border-gray-300 rounded" />
                </label>
                <label className="flex flex-col gap-1">
                    Date:
                    <input type="date" name="date" value={formData.date} onChange={handleChange} max={today} required className="p-2 border border-gray-300 rounded" />
                </label>
                <label className="flex flex-col gap-1">
                    Description: <span className="text-red-500" data-testid="descriptionError">{formErrors.description}</span>
                    <textarea name="description" value={formData.description} onChange={handleChange} required className="p-2 border border-gray-300 rounded h-24" />
                </label>
                <label className="flex flex-col gap-1">
                    Upload Image:
                    <input type="file" onChange={handleFileChange} className="p-2 border border-gray-300 rounded" />
                    {preview && (
                        <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
                    )}
                </label>
                <button type="submit" className="p-2 rounded-md bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Memory</button>
                <button type="button" onClick={() => navigate('/showAllMemories')} className="p-2 bg-white text-gray-900 rounded shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Cancel</button>
            </form>
            
        </div>
    );
}

export default CreateMemory;
