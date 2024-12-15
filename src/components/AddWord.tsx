import { Button, Col, Drawer, Form, Input, message, Row, Space } from 'antd';
import React from 'react'
import { tokenService } from '../services/token.service';
import axios from 'axios';


interface AddWorldProps {
  collectionId: string,
  visible: boolean;
  onClose: () => void;
}

interface AddFormValues {
  text: string;
  description: string;
  translate: string;
}

const AddWord: React.FC<AddWorldProps> = ({ collectionId, visible, onClose }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const onFinish = async (values: AddFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = tokenService.get();
      const formData = new FormData();
      formData.append('Text', values.text);
      formData.append('Description', values.description);
      formData.append('Translate', values.translate)

      const response = await axios.post(
        `http://localhost:5199/api/Library/words?collectionId=${collectionId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      if (response.status === 200 && response.data.code === 200) {
        message.success('Successful');
        onClose();
      } else {
        setError('An error occurred during the operation');
        message.error('Failed');
      }
    } catch (err: any) {
      setError('An error occurred');
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    message.error('Please fill out all required fields correctly.');
  };

  return (
    <Drawer
      title="Add a new word"
      width={720}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            form="addWordForm"
            loading={loading}
            disabled={loading}>
            Submit
          </Button>
        </Space>
      }
    >
      <Form
        id="addWordForm"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="text"
              label="Text"
              rules={[{ required: true, message: 'Please enter text' }]}
            >
              <Input placeholder="Please enter text" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: false }]}
            >
              <Input placeholder="Please enter description" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="translate"
              label="Translate"
              rules={[{ required: false }]}
            >
              <Input placeholder="Please enter translate" />
            </Form.Item>
          </Col>
        </Row>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Form>
    </Drawer>
  )
}

export default AddWord;