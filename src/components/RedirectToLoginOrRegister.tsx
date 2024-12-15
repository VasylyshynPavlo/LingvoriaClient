import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { tokenService } from '../services/token.service';

const RedirectToLoginOrRegister = () => {
  const [status, setStatus] = React.useState<number | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = tokenService.get();
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

        const response = await axios.get('http://localhost:5199/imlogined', {
          headers,
        });

        setStatus(response.status);
      } catch (err: any) {
        if (err.response) {
          setStatus(err.response.status);
        } else {
          setStatus(500);
        }
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (status === 401) {
      navigate('/login');
    }
  }, [status, navigate]);

  return null;
};

export default RedirectToLoginOrRegister;
