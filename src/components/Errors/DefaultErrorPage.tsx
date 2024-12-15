import { useSearchParams } from 'react-router-dom';

export default function DefaultErrorPage() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code') || 'Unknown';
    const message = searchParams.get('message') || 'Something went wrong';

    return (
        <>
            <p style={{ textAlign: 'center', fontSize: '50pt', fontFamily: 'sans-serif', color: 'red', fontWeight: '800' }}>{code}</p>
            <p style={{ textAlign: 'center', fontSize: '30pt', fontFamily: 'sans-serif', color: 'red', fontWeight: '800' }}>{message}</p>
        </>
    );
}
