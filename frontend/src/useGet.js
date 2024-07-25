import { useState, useEffect } from 'react';
import axios from 'axios';

const token = localStorage.getItem('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Custom hook for performing GET request using Axios
export default function useGet(url, defaultData) {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  // Expose a mutate function to refresh the data
  const mutate = () => {
    setLoading(true);
    fetchData();
  };

  return { data, loading, error, mutate};
};
