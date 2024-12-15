import { Avatar, Button, Input, Space } from 'antd';
import { accountService } from '../services/accounts.service';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';


const Account = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    accountService.logout();
    navigate("/login");
  };

  return (
    <Space direction='vertical'>
      <Space>
        <Avatar shape="square" size={128} icon={<UserOutlined />} />
        <Input placeholder='avatar url' variant='borderless'/>
      </Space>
      <Space>
        <label>Username:</label>
        <Input disabled placeholder='User name' variant='borderless'/>
      </Space>
      <Space>
        <label>Full name:</label>
        <Input placeholder='Full name' variant='borderless'/>
      </Space>
      <Space>
        <label>Email:</label>
        <Input disabled placeholder='Email' variant='borderless'/>
      </Space>
      <Button type="primary" danger onClick={handleLogout}>
        Logout
      </Button>
    </Space>
  );
};

export default Account;