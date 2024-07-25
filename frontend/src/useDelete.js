import { useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Custom hook for performing DELETE request using Axios
export default function useDelete() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteData = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(url);
            setData(response.data); 
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            setError(error);
            return null; 
        }
    };

    return { deleteData, data, loading, error };
}
