import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MemoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

  useEffect(() => {
    const fetchMemory = async () => {
      const response = await fetch(`${API_BASE_URL}/api/user/memories/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        }
      });
      const data = await response.json();
      setMemory(data);
    };

    fetchMemory();
  }, [id]);

  const handleEdit = () => {
    navigate(`/update-memory/${id}`); // redirect to the edit page
  };

  const handleDelete = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/memories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      navigate('/showAllMemories'); // Navigate back to the memory list after deletion
    } else {
      console.error('Failed to delete the memory');
    }
  };

  if (!memory) return <div>Loading...</div>;

  const handleBack = () => {
    navigate('/showAllMemories'); // go back to the memory list
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            {memory.image && memory.image.length > 0 ? (
              <img src={`${API_BASE_URL}/${memory.image}`} alt="Memory" className="rounded object-cover h-48 w-full" />
            ) : (
              <img src={`${API_BASE_URL}/uploads/default.png`} alt="Default" className="rounded object-cover h-48 w-full" />
            )}
          </div>
          <div className="md:w-2/3 md:pl-4">
            <h2 className="text-xl font-bold mb-2">{memory.title}</h2>
            <p className="text-gray-600"><strong>Date:</strong> {new Date(memory.date).toLocaleDateString()}</p>
            <p className="text-gray-600"><strong>Tag:</strong> {memory.tag}</p>
            <p className="text-gray-600"><strong>Description:</strong> {memory.description}</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-2 justify-end">
          <button onClick={handleBack} className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <span>Back</span>
          </button>
          <button onClick={handleEdit}  className="bg-purple-300 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <span>Edit</span>
          </button>
          <button onClick={handleDelete} className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
  
}
