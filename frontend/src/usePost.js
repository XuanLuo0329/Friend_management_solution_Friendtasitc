import { useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default function usePost() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postData = async (url, postData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(url, postData);
            setData(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            setError(error);
            return error.response.data; 
        }
    };

    return { postData, data, loading, error };
}
