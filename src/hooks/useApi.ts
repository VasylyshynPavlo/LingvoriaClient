import { useState } from 'react';
import axios from 'axios';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  status: number | null;
  fetchData: (data: any) => void; // додали параметр для передачі даних при POST запитах
}

const useApi = <T>(url: string): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number | null>(null);

  const getToken = () => {
    return localStorage.getItem('access-token');
  };

  const fetchData = async (postData: any) => { // додаємо параметр для передавання даних
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const token = getToken();
      const response = await axios.post<T>(url, postData, {
        headers: {
          'Content-Type': 'multipart/form-data', // або 'application/json', залежно від формату запиту
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      setStatus(response.status);
      setData(response.data);
    } catch (err: any) {
      if (err.response) {
        // Помилка від сервера
        setStatus(err.response.status);
        setError(err.response.statusText || 'Error');
      } else {
        // Мережева помилка
        setStatus(0);
        setError('Network error: Unable to fetch data.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, status, fetchData };
};

export default useApi;
