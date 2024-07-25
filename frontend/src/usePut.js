import { useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default function usePut () {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const putData = async (url, payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(url, payload);
            setData(response.data);
            setLoading(false);
            return response.data;  
        } catch (err) {
            setLoading(false);
            setError(err);
            throw err;  
        }
    };

    return { data, loading, error, putData };
};

