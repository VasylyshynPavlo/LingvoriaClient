import { Button, Col, Drawer, Form, Input, List, message, Row, Space, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { tokenService } from '../services/token.service';
import { CloseOutlined } from '@ant-design/icons';

interface ShowWordProps {
    collectionId: string;
    wordId: string;
    visible: boolean;
    onClose: () => void;
    onUpdate: () => void; 
}

interface ChangeWordFormValues {
    text: string;
    description: string;
    translate: string;
}

interface WordData {
    id: string;
    text: string;
    translate: string | null;
    description: string;
    examples: { id: string; text: string; translate: string | null }[];
}

const EditWord: React.FC<ShowWordProps> = ({ collectionId, wordId, visible, onClose, onUpdate }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [childrenDrawer, setChildrenDrawer] = useState(false);
    const [exampleForm] = Form.useForm();
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            setLoading(true);
            const accessToken = tokenService.get();
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            const response = await axios.get(`http://localhost:5199/api/Library/words-by-id?collectionId=${collectionId}&wordId=${wordId}`, {
                headers,
            });

            if (response.status === 200) {
                setWordData(response.data);
                setError(null);
            } else {
                setError('Failed to fetch word data.');
            }
        } catch (err) {
            setError('An error occurred while fetching word data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        exampleForm.resetFields();
    };

    useEffect(() => {
        if (childrenDrawer) {
            exampleForm.setFieldsValue({
                examples: wordData?.examples.map(({ text, translate }) => ({ text, translate })) || [],
            });
        } else {
            resetForm();
        }
    }, [childrenDrawer, wordData, exampleForm]);

    useEffect(() => {
        if (visible) {
            fetchData();
        }
    }, [visible, collectionId, wordId]);

    if (loading) {
        return <Spin size="large" />;
    }

    const onExampleFromFinish = async () => {
        try {
            const accessToken = tokenService.get();
            const response = await axios.put(
                `http://localhost:5199/api/Library/examples/many?collectionId=${collectionId}&wordId=${wordId}`,
                exampleForm.getFieldsValue().examples,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                message.success('Successfully updated examples!');
                setChildrenDrawer(false);
                await fetchData();
            } else {
                setError('Failed to update examples.');
                message.error('Update failed.');
            }
        } catch (err: any) {
            setError('An error occurred.');
            message.error('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const onWordFromFinish = async (values: ChangeWordFormValues) => {
        try {
            const accessToken = tokenService.get();
            const response = await axios.put(
                `http://localhost:5199/api/Library/words?collectionId=${collectionId}&wordId=${wordId}&text=${values.text}&translate=${values.translate}&description=${values.description}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                message.success('Successfully updated examples!');
                setChildrenDrawer(false);
                onUpdate();
                onClose();
                await fetchData();
            } else {
                setError('Failed to update examples.');
                message.error('Update failed.');
                
            }
        } catch (err: any) {
            setError('An error occurred.');
            message.error('An error occurred.');
            const accessToken = tokenService.get();
            console.log(accessToken);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Drawer
            open={visible}
            onClose={() => {
                resetForm();
                onClose();
            }}
            extra={
                <Button
                    type='primary'
                    htmlType='submit'
                    form='changeWordForm'
                    loading={loading}
                    disabled={loading}>
                    Submit
                </Button>
            }
        >
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {wordData ? (
                <div>
                    <Form
                        form={form}
                        name="changeWordForm"
                        initialValues={{
                            text: wordData?.text,
                            translate: wordData?.translate,
                            description: wordData?.description,
                        }}
                        onFinish={onWordFromFinish}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="text"
                                    label="Text"
                                    rules={[{ required: true, message: 'Please enter text' }]}
                                >
                                    <Input placeholder="Please enter text" variant="borderless" size="large" style={{ fontWeight: 'bold' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="translate"
                                    label="Translate"
                                    rules={[{ required: true, message: 'Please enter text' }]}
                                >
                                    <Input placeholder="Please enter text" variant="borderless" />
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
                                    <Input placeholder="Please enter description" variant="borderless" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Space>
                        <Button type="primary" onClick={() => setChildrenDrawer(true)}>
                            Change
                        </Button>
                        <strong>Examples:</strong>
                    </Space>
                    <br />
                    <br />
                    <List
                        size="large"
                        bordered
                        dataSource={wordData.examples}
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.text}</div>
                                    <div style={{ color: 'gray', fontSize: '14px' }}>
                                        {item.translate || 'No translation available'}
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                    <Drawer
                        onClose={() => setChildrenDrawer(false)}
                        open={childrenDrawer}
                        extra={
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    form="changeExamplesForm"
                                    loading={loading}
                                    disabled={loading}>
                                    Submit
                                </Button>
                            </Space>
                        }
                    >
                        <Form
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            form={exampleForm}
                            name="changeExamplesForm"
                            style={{ maxWidth: 600 }}
                            autoComplete="off"
                            onFinish={onExampleFromFinish}
                        >
                            <Form.List name="examples">
                                {(fields, { add, remove }) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div
                                                key={key}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px',
                                                    border: '1px solid #d9d9d9',
                                                    borderRadius: '4px',
                                                    padding: '16px',
                                                    position: 'relative',
                                                }}
                                            >
                                                <CloseOutlined
                                                    style={{
                                                        position: 'absolute',
                                                        top: '8px',
                                                        right: '8px',
                                                        color: 'red',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => remove(name)}
                                                />

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'text']}
                                                    rules={[{ required: true, message: 'Text is required' }]}
                                                >
                                                    <Input
                                                        placeholder="Text"
                                                    />
                                                </Form.Item>

                                                <Form.Item {...restField} name={[name, 'translate']}>
                                                    <Input
                                                        placeholder="Translation"
                                                    />
                                                </Form.Item>
                                            </div>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block>
                                            + Add Example
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                            {/* <Form.Item noStyle shouldUpdate>
                                {() => (
                                    <Typography>
                                        <pre>{JSON.stringify(form.getFieldsValue().examples, null, 2)}</pre>
                                    </Typography>
                                )}
                            </Form.Item> */}
                        </Form>
                    </Drawer>
                </div>
            ) : (
                <div>No data available.</div>
            )}
        </Drawer>
    );
};

export default EditWord;
