import React, { useEffect, useState } from 'react';
import { tokenService } from '../services/token.service';
import axios from 'axios';
import { Drawer, List, Spin } from 'antd';

interface ShowWordProps {
    collectionId: string;
    wordId: string;
    visible: boolean;
    onClose: () => void;
}

interface WordData {
    id: string;
    text: string;
    translate: string | null;
    description: string;
    examples: { id: string; text: string; translate: string | null }[];
}

const ShowWord: React.FC<ShowWordProps> = ({ collectionId, wordId, visible, onClose }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const accessToken = tokenService.get();
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            const response = await axios.get(
                `http://localhost:5199/api/Library/words-by-id?collectionId=${collectionId}&wordId=${wordId}`,
                { headers }
            );

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

    useEffect(() => {
        if (visible) {
            fetchData();
        }
    }, [visible, collectionId, wordId]);

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <Drawer
            open={visible}
            onClose={onClose}
        >
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {wordData ? (
                <div>
                    <h1>{wordData.text}</h1>
                    <p><strong>Translate:</strong> {wordData.translate}</p>
                    <p><strong>Description:</strong> {wordData.description}</p>
                    <h4>Examples:</h4>
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
                </div>
            ) : (
                <div>No data available.</div>
            )}
        </Drawer>
    );
};

export default ShowWord;
