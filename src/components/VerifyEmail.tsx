import { Input } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import axios from "axios";
import { useState } from "react";
import { tokenService } from "../services/token.service";

interface CodeData {
    code: string
}

const VerifyEmail = () => {
    const [emailCode, setEmailCode] = useState<CodeData | null>(null)
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const accessToken = tokenService.get();
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            const response = await axios.get(`http://localhost:5199/api/Library/words-by-id?collectionId=${collectionId}&wordId=${wordId}`, {
                headers,
            });

            if (response.status === 200) {
                setEmailCode(response.data);
            } else {
                setError('Failed to fetch word data.');
            }
        } catch (err) {
            setError('An error occurred while fetching word data.');
            console.error(err);
        } finally {
        }
    }

    const onChange: OTPProps['onChange'] = (text) => {
        console.log('onChange:', text);
    };

    const onInput: OTPProps['onInput'] = (value) => {
        console.log('onInput:', value);
    };

    const sharedProps: OTPProps = {
        onChange,
        onInput,
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            <h1 style={{ maxWidth: '500px', textAlign: 'center' }}>We send a verification code. Please check your email box end enter the code here:</h1>
            <Input.OTP status="error" formatter={(str) => str.toUpperCase()} {...sharedProps} />
        </div>
    );
};

export default VerifyEmail;
