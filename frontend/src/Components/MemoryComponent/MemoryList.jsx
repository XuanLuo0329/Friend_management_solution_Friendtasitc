import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MemoryList() {
    const [memories, setMemories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMemories();
    }, []);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

    const fetchMemories = async () => {
        const response = await fetch(`${API_BASE_URL}/api/user/memories/showAllMemories`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setMemories(data);
    };

    const handleViewDetails = (id) => {
        navigate(`/memories/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/update-memory/${id}`);
    };

    const handleDelete = async (id) => {
        await fetch(`${API_BASE_URL}/api/user/memories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        fetchMemories(); // Refresh the list after deleting
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <button
              onClick={() => navigate('/create-memory')}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
              Create New Memory
          </button>
          <div className="grid gap-4">
              {memories.map(memory => (
                  <div key={memory._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex overflow-hidden">
                      <div
                          className="w-1/4 flex items-center justify-center p-2" // Reduced padding for tighter spacing
                          onClick={() => handleViewDetails(memory._id)}
                      >
                          <img
                              src={memory.image ? `${API_BASE_URL}/${memory.image}` : `${API_BASE_URL}/uploads/default.png`}
                              alt="Memory"
                              className="h-32 w-32 object-cover rounded p-1"
                          />
                      </div>
                      <div className="flex flex-col justify-between pl-0 pr-0 py-2 leading-normal w-3/4"> {/* Reduced side padding */}
                          <div>
                              <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-1">{memory.title}</h5>
                              <p className="text-gray-700 text-base mb-3">
                                  {new Date(memory.date).toLocaleDateString()}
                              </p>
                              <p className="text-gray-500 text-sm">{memory.description.substring(0, 50)}...</p>
                          </div>
                          <div className="flex justify-start items-center mt-2 space-x-2">
                              <button onClick={() => handleEdit(memory._id)} className="text-sm bg-purple-300 text-white py-1 px-3 space-x-2 rounded hover:bg-purple-400">
                                  Edit
                              </button>
                              <button onClick={() => handleDelete(memory._id)} className="text-sm bg-pink-300 text-white py-1 px-3 rounded hover:bg-pink-400">
                                  Delete
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
  
      
}
