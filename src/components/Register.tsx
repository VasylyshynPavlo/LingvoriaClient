import React from 'react';
import { LockOutlined, UserOutlined, PictureOutlined, FieldStringOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { accountService } from '../services/accounts.service';
import { useNavigate } from 'react-router-dom'; // Імпортуємо useNavigate
import { tokenService } from '../services/token.service';

// Типізація для форми
interface RegisterFormValues {
    avatarUrl: string,
    username: string,
    fullname: string,
    email: string,
    phone: string,
    password: string;
}

export default function Register() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const onFinish = async (values: RegisterFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const accessToken = tokenService.get();
            const formData = new FormData();
            formData.append('AvatarUrl', values.avatarUrl);
            formData.append('Username', values.username);
            formData.append('FullName', values.fullname);
            formData.append('Email', values.email);
            formData.append('PhoneNumber', values.phone);
            formData.append('Password', values.password);


            const response = await axios.post(
                'http://localhost:5199/api/User/register',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 && response.data.code === 200) {
                message.success('Register successful');
                accountService.login(response.data.data);

            } else if (response.status === 400 || response.status === 404) {
                setError('Incorrect username/email or password');
                message.error('Incorrect username/email or password');
            } else {
                setError('An error occurred during login');
                message.error('Login failed');
            }
        } catch (err: any) {
            setError('An error occurred');
            message.error('An error occurred');
        } finally {
            setLoading(false);
        }
        try {
            const formData = new FormData();
            formData.append('UsernameOrEmail', values.email);
            formData.append('Password', values.password);

            const response = await axios.post(
                'http://localhost:5199/api/User/login',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 && response.data.code === 200) {
                message.success('Login successful');

                accountService.login(response.data.data);

                navigate('/');
            } else if (response.status === 400 || response.status === 404) {
                setError('Incorrect username/email or password');
                message.error('Incorrect username/email or password');
            } else {
                setError('An error occurred during login');
                message.error('Login failed');
            }
        } catch (err: any) {
            setError('An error occurred');
            message.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                style={styles.form}
                onFinish={onFinish}
            >
                <Form.Item
                    name="avatarUrl"
                    rules={[{ required: false }, { type: 'url', warningOnly: true }, { type: 'string' }]}
                >
                    <Input prefix={<PictureOutlined />} placeholder="Avatar url" />
                </Form.Item>

                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>

                <Form.Item
                    name="fullname"
                    rules={[{ required: false }]}
                >
                    <Input prefix={<FieldStringOutlined />} placeholder="Fullname" />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[{
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    rules={[{ required: false },
                    ]}
                >
                    <Input prefix={<PhoneOutlined />} placeholder="Phone" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={loading}>
                        Register
                    </Button>
                    or <a href="/login">Login now!</a>
                </Form.Item>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </Form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
    },
    form: {
        width: '100%',
        maxWidth: 360,
    },
    flexContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
};
