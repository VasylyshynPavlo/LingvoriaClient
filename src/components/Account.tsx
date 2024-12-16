import { Avatar, Button, Form, Input, Progress, Row, Space } from 'antd';
import { accountService } from '../services/accounts.service';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { tokenService } from '../services/token.service';

interface DataType {
  avatarUrl: string | null;
  username: string;
  fullName: string | null;
  email: string;
  emailConfirmed: boolean;
}

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [userData, setUserData] = useState<DataType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressColor, setProgressColor] = useState<string>("#1677FF");
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setShowProgress(true);
      setLoading(true);


      setProgress(0);
      const accessToken = tokenService.get();
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const response = await axios.get(
        `http://localhost:5199/api/User/user/short`,
        { headers }
      );

      if (response.status === 200) {
        setUserData(response.data);
        setError(null);

        setProgress(100);

        form.setFieldsValue({
          avatarUrl: response.data.avatarUrl,
          username: response.data.username,
          fullName: response.data.fullName,
          email: response.data.email,
        });

        setTimeout(() => {
          setProgressColor("#3ccf3c");
        }, 100);

        setTimeout(() => {
          setShowProgress(false);
        }, 200);
      } else {
        setError('Failed to fetch user data.');
      }
    } catch (err) {
      setError('An error occurred while fetching user data.');
      console.error(err);
    } finally {
      setProgressColor("#1677FF");

      setLoading(false);
    }
  };

  const onFinish = async () => {
    try {
      setShowProgress(true);
      setLoading(true);


      setProgress(0);
      const accessToken = tokenService.get();
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const response = await axios.get(
        `http://localhost:5199/api/User/user/short`,
        { headers }
      );

      if (response.status === 200) {
        setUserData(response.data);
        setError(null);

        setProgress(100);

        form.setFieldsValue({
          avatarUrl: response.data.avatarUrl,
          username: response.data.username,
          fullName: response.data.fullName,
          email: response.data.email,
        });

        setTimeout(() => {
          setProgressColor("#3ccf3c");
        }, 100);

        setTimeout(() => {
          setShowProgress(false);
        }, 200);
      } else {
        setError('Failed to fetch user data.');
      }
    } catch (err) {
      setError('An error occurred while fetching user data.');
      console.error(err);
    } finally {
      setProgressColor("#1677FF");

      setLoading(false);
    }
  };

  const handleLogout = () => {
    accountService.logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {showProgress && (
        <Progress
          percent={progress}
          strokeWidth={5}
          strokeLinecap="round"
          status="active"
          showInfo={false}
          style={{ width: '100%', position: 'relative', top: '-20px' }}
          strokeColor={progressColor}
        />
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Space direction="vertical">
        <Form
          form={form}
          name="UpdateUserForm"
          initialValues={{
            avatarUrl: userData?.avatarUrl,
            username: userData?.username,
            fullName: userData?.fullName,
            email: userData?.email,
          }}
        >
          <Row>
            <Form.Item name="avatarUrl" label="Avatar url">
              <Input
                placeholder="Enter avatar url"
              />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please enter username' }]}
            >
              <Input
                placeholder="Please enter username"
              />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item name="fullName" label="Full name">
              <Input
                placeholder="Enter full name"
              />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please enter email' }]}
            >
              <Input
                placeholder="Please enter email"
              />
            </Form.Item>
            <Button disabled={userData?.emailConfirmed} type="primary">
              Verify
            </Button>
          </Row>
        </Form>
        <Button htmlType='submit' form='UpdateUserForm' type="primary">
          Update
        </Button>
        <Button danger onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </>
  );
};

export default Account;
