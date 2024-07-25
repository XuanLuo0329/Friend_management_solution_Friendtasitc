import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making requests

function EditMemory() {
    const { id } = useParams();  // Get the memory ID from the URL
    const navigate = useNavigate();
    const [memory, setMemory] = useState({
        title: '',
        tag: '',
        date: '',
        description: '',
        image: null
    });
    const [newImage, setNewImage] = useState(null); // To handle new image file
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

    // Fetch the memory details when the component mounts
    useEffect(() => {
        const fetchMemory = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/user/memories/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setMemory({
                        title: data.title,
                        tag: data.tag,
                        date: data.date.split('T')[0],  // Adjust date format for input[type="date"]
                        description: data.description,
                        image: data.image
                    });
                } else {
                    throw new Error('Failed to fetch memory details');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMemory();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMemory(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        setNewImage(event.target.files[0]); // Update to handle single file
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token available.");// If no token is available, it means the user is not logged in
            navigate('/login'); // Redirect to the login page
        }

        const formData = new FormData();
        formData.append('title', memory.title);
        formData.append('tag', memory.tag);
        formData.append('date', memory.date);
        formData.append('description', memory.description);
        if (newImage) {
            formData.append('memoryImage', newImage);  // Changed key to 'memoryImage'
        }

        try {
            console.log('Sending request to the server...');
            const url = `${API_BASE_URL}/api/user/memories/${id}`;
            const response = await axios.put(url, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const updatedMemory = response.data;
            navigate(`/memories/${updatedMemory._id}`);  // Redirect to view the updated memory
        } catch (error) {
            setError(error.message);
        }


    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="title">
              <strong>Title:</strong>
                <input type="text" name="title" value={memory.title} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="tag">
                <strong>Tag:</strong>
                <input type="text" name="tag" value={memory.tag} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="date">
              <strong>Date:</strong>
                <input type="date" name="date" value={memory.date} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm  mb-2" htmlFor="description">
              <strong>Description:</strong>
                <textarea name="description" value={memory.description} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </label>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm  mb-2" htmlFor="image">
              <strong>Upload Image:</strong>
                <input type="file" name="image" onChange={handleFileChange} className="mt-1 block w-full" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-purple-300 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Update Memory
              </button>
              <button type="button" onClick={() => navigate('/showAllMemories')} className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
      
}

export default EditMemory;
