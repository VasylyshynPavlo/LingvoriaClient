import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { accountService } from '../services/accounts.service';
import { useNavigate } from 'react-router-dom';

interface LoginFormValues {
  name: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('UsernameOrEmail', values.name);
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
        console.log('Response:', response.data);
        
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
          name="name"
          rules={[{ required: true, message: 'Please input your Username or Email!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username or Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <div style={styles.flexContainer}>
            <a href="">Forgot password</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            Log in
          </Button>
          or <a href="/register">Register now!</a>
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
