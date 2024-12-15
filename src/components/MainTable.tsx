import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Row, Col, Select, Tooltip, Empty, Space, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '../services/token.service';
import CreateCollection from './CreateCollection';
import AddWord from './AddWord';
import ShowWord from './ShowWord';
import EditWord from './EditWord'

const LOCAL_STORAGE_KEY = 'selectedCollectionId';

interface DataType {
  key: React.Key;
  word: string;
  translate: string;
  description: string;
  examples: { id: string, text: string; translate: string }[];
}

const MainTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [collections, setCollections] = useState<{ value: string; label: string }[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [createCollectionDrawerVisible, setCreateCollectionDrawerVisible] = useState(false);
  const [addWordDrawerVisible, setAddWordDrawerVisible] = useState(false);
  const [showWordDrawerVisible, setShowWordDrawerVisible] = useState(false);
  const [editWordDrawerVisible, setEditWordDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const navigate = useNavigate();

  const locale = {
    emptyText: (
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{ height: 60 }}
      >
        <Button type="primary" onClick={() => setAddWordDrawerVisible(true)}>Create Now</Button>
      </Empty>
    ),
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const accessToken = tokenService.get();
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.get('http://localhost:5199/api/Library/collections', {
        headers,
      });
      if (response.data.code === 200) {
        const transformedData: DataType[] = response.data.data.flatMap((collection: any) =>
          collection.words.map((word: any) => ({
            key: word.id,
            word: word.text,
            translate: word.translate,
            tag: collection.title || collection.language,
            description: word.description || '',
            examples: word.examples || [],
          }))
        );
        setData(transformedData);

        const allCollections = response.data.data.map((collection: any) => ({
          value: collection.id,
          label: collection.title || collection.language,
        }));
        setCollections(allCollections);

        const storedCollectionId = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (
          storedCollectionId &&
          allCollections.some((c: { value: string; label: string }) => c.value === storedCollectionId)
        ) {
          setSelectedCollection(storedCollectionId);
        } else if (allCollections.length > 0) {
          setSelectedCollection(allCollections[0].value);
        } else {
          navigate('/create-collection');
          setCreateCollectionDrawerVisible(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (createCollectionDrawerVisible) {
      navigate(`/?create-collection`);
    } else if (addWordDrawerVisible && collections.length != 0) {
      navigate(`/?collection=${selectedCollection}&add-word`)
    } else if (selectedCollection && collections.length != 0) {
      navigate(`/?collection=${selectedCollection}`);
    } else {
      navigate('/');
    }
  }, [createCollectionDrawerVisible, addWordDrawerVisible, selectedCollection, navigate]);

  const handleSearch = (value: string) => {
    setSearchValue(value.toLowerCase());
  };

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
    localStorage.setItem(LOCAL_STORAGE_KEY, collectionId);
  };

  const handleViewWordDetails = (wordId: string, collectionId: string) => {
    setSelectedWordId(wordId);
    setSelectedCollectionId(collectionId);
    setShowWordDrawerVisible(true);
  };

  const handleEditWord = (wordId: string, collectionId: string) => {
    setSelectedWordId(wordId);
    setSelectedCollectionId(collectionId);
    setEditWordDrawerVisible(true);
  };

  const filteredData = data.filter((record) => {
    const matchesCollection = selectedCollection
      ? collections.some((collection) => collection.value === selectedCollection)
      : true;
    return (
      matchesCollection &&
      (record.word.toLowerCase().includes(searchValue) ||
        record.translate.toLowerCase().includes(searchValue)
      ));
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Word',
      dataIndex: 'word',
      sorter: (a, b) => a.word.localeCompare(b.word),
      showSorterTooltip: { target: 'full-header' },
    },
    {
      title: 'Translate',
      dataIndex: 'translate',
      sorter: (a, b) => a.translate.localeCompare(b.translate),
      showSorterTooltip: { target: 'full-header' },
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{text}</span>
          <div>
            <Button
              icon={<EditOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => handleEditWord(String(record.key), selectedCollection || '')}
            />
            <Button
              icon={<EyeOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => handleViewWordDetails(String(record.key), selectedCollection || '')}
            />
            <Button
              icon={<DeleteOutlined />}
              style={{ marginRight: 8 }}
              danger
              onClick={async () => {
                try {
                  const collectionId = selectedCollection;
                  const wordId = record.key;
                  const accessToken = tokenService.get();
                  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    
                  const response = await axios.delete(
                    `http://localhost:5199/api/Library/words?collectionId=${collectionId}&wordId=${wordId}`,
                    { headers }
                  );
    
                  if (response.data.code === 200) {
                    setData(prevData => prevData.filter(item => item.key !== wordId));
                    message.success('Word deleted');
                  }
                } catch (error) {
                  console.error('Failed to delete word:', error);
                }
              }}
            />
          </div>
        </div>
      ),
    }    
  ];

  const refreshData = () => {
    fetchData();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={16} align="middle" style={{ marginBottom: '16px' }}>
        <Col span={12}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateCollectionDrawerVisible(true)}
            >
              Create
            </Button>
            <Button
              type="primary"
              icon={loading ? <Spin indicator={<LoadingOutlined />} /> : null}
              onClick={refreshData}
              loading={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Select
              showSearch
              placeholder="Select a collection"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={collections}
              onChange={handleCollectionChange}
              value={selectedCollection}
              style={{ marginRight: '5px' }}
            />
            <Input
              placeholder="Search"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: '300px', width: '100%' }}
            />
          </Space>
        </Col>
        <Col span={6} offset={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddWordDrawerVisible(true)}
          >
            Add word
          </Button>
        </Col>
      </Row>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table<DataType>
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={false}
          style={{ marginTop: 20, height: '90%' }}
          locale={locale}
        />
      </div>
      <CreateCollection visible={createCollectionDrawerVisible} onClose={() => setCreateCollectionDrawerVisible(false)} />
      {collections.length != 0 && (<AddWord collectionId={selectedCollection || ''} visible={addWordDrawerVisible} onClose={() => setAddWordDrawerVisible(false)} />)}
      {selectedWordId && selectedCollectionId && (
        <ShowWord
          collectionId={selectedCollectionId}
          wordId={selectedWordId}
          visible={showWordDrawerVisible}
          onClose={() => setShowWordDrawerVisible(false)}
        />

      )}

      {selectedWordId && selectedCollectionId && (
        <EditWord
          collectionId={selectedCollectionId}
          wordId={selectedWordId}
          visible={editWordDrawerVisible}
          onClose={() => setEditWordDrawerVisible(false)}
          onUpdate={refreshData}
        />
      )}
    </div>
  );
};

export default MainTable;
