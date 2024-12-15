import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckApi() {
    const navigate = useNavigate();
    useEffect(() => {
        const checkApiAvailability = async () => {
            try {
                await axios.get('http://localhost:5199/status');
            } catch (error) {
                navigate('/error?code=503&message=Service+Unavailable')
            }
        };

        checkApiAvailability();
    }, []);

    return <></>;
}
