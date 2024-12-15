import { Button, Col, Drawer, Form, Input, message, Row, Select, Space } from 'antd';
import axios from 'axios';
import React from 'react';
import { tokenService } from '../services/token.service';

const { Option } = Select;

interface CreateCollectionProps {
  visible: boolean;
  onClose: () => void;
}

interface CreateFormValues {
  title: string;
  language: string;
}

const CreateCollection: React.FC<CreateCollectionProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const onFinish = async (values: CreateFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = tokenService.get();
      const formData = new FormData();
      formData.append('Title', values.title);
      formData.append('Language', values.language);

      const response = await axios.post(
        'http://localhost:5199/api/Library/collections',
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
      title="Create a new collection"
      width={720}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            form="createCollectionForm"
            loading={loading}
            disabled={loading}>
            Submit
          </Button>
        </Space>
      }
    >
      <Form
        id="createCollectionForm"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input placeholder="Please enter title" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="language"
              label="Language"
              rules={[{ required: true, message: 'Please select language' }]}
            >
              <Select
                showSearch
                placeholder="Please select a language">
                <Option value="Afrikaans">Afrikaans</Option>
                <Option value="Albanian">Albanian</Option>
                <Option value="Amharic">Amharic</Option>
                <Option value="Arabic">Arabic</Option>
                <Option value="Armenian(Eastern)">Armenian(Eastern)</Option>
                <Option value="Armenian(Western)">Armenian(Western)</Option>
                <Option value="Azerbaijani(Azeri)">Azerbaijani(Azeri)</Option>
                <Option value="Bassa">Bassa</Option>
                <Option value="Belarusian">Belarusian</Option>
                <Option value="Bengali">Bengali</Option>
                <Option value="Bosnian">Bosnian</Option>
                <Option value="Braille">Braille</Option>
                <Option value="Bulgarian">Bulgarian</Option>
                <Option value="Burmese">Burmese</Option>
                <Option value="Cambodian(Khmer)">Cambodian(Khmer)</Option>
                <Option value="Cape">Cape</Option>
                <Option value="Verde">Verde</Option>
                <Option value="Creole">Creole</Option>
                <Option value="Cebuano">Cebuano</Option>
                <Option value="Chinese(Simplified)">Chinese(Simplified)</Option>
                <Option value="Chinese(Traditional)">Chinese(Traditional)</Option>
                <Option value="Chuukese">Chuukese</Option>
                <Option value="Croatian">Croatian</Option>
                <Option value="Czech">Czech</Option>
                <Option value="Danish">Danish</Option>
                <Option value="Dari">Dari</Option>
                <Option value="Dutch">Dutch</Option>
                <Option value="English">English</Option>
                <Option value="Estonian">Estonian</Option>
                <Option value="Farsi(Persian)">Farsi(Persian)</Option>
                <Option value="Finnish">Finnish</Option>
                <Option value="Flemmish">Flemmish</Option>
                <Option value="French(Canada)">French(Canada)</Option>
                <Option value="French(France)">French(France)</Option>
                <Option value="Fulani">Fulani</Option>
                <Option value="Georgian">Georgian</Option>
                <Option value="German">German</Option>
                <Option value="Greek">Greek</Option>
                <Option value="Gujarati">Gujarati</Option>
                <Option value="Haitian">Haitian</Option>
                <Option value="Creole">Creole</Option>
                <Option value="Hakha">Hakha</Option>
                <Option value="Chin">Chin</Option>
                <Option value="Hakka(Chinese)">Hakka(Chinese)</Option>
                <Option value="Hebrew">Hebrew</Option>
                <Option value="Hindi">Hindi</Option>
                <Option value="Hmong">Hmong</Option>
                <Option value="Hungarian">Hungarian</Option>
                <Option value="Icelandic">Icelandic</Option>
                <Option value="Igbo/Ibo">Igbo/Ibo</Option>
                <Option value="Ilocano">Ilocano</Option>
                <Option value="Ilonggo(Hiligaynon)">Ilonggo(Hiligaynon)</Option>
                <Option value="Indonesian">Indonesian</Option>
                <Option value="Italian">Italian</Option>
                <Option value="Japanese">Japanese</Option>
                <Option value="Javanese">Javanese</Option>
                <Option value="Kannada">Kannada</Option>
                <Option value="Karen">Karen</Option>
                <Option value="Kazakh">Kazakh</Option>
                <Option value="Kinyarwanda">Kinyarwanda</Option>
                <Option value="Kirundi">Kirundi</Option>
                <Option value="Korean">Korean</Option>
                <Option value="Kurdish(Kurmanji dialect)">Kurdish(Kurmanji dialect)</Option>
                <Option value="Kurdish(Sorani dialect)">Kurdish(Sorani dialect)</Option>
                <Option value="Kyrgyz/Kirgiz">Kyrgyz/Kirgiz</Option>
                <Option value="Lao(Laotian)">Lao(Laotian)</Option>
                <Option value="Latvian">Latvian</Option>
                <Option value="Lithuanian">Lithuanian</Option>
                <Option value="Macedonian">Macedonian</Option>
                <Option value="Malay(Malaysian)">Malay(Malaysian)</Option>
                <Option value="Mandinka">Mandinka</Option>
                <Option value="Marathi">Marathi</Option>
                <Option value="Marshallese">Marshallese</Option>
                <Option value="Mien">Mien</Option>
                <Option value="Mongolian">Mongolian</Option>
                <Option value="Montenegrin">Montenegrin</Option>
                <Option value="Navajo">Navajo</Option>
                <Option value="Nepali">Nepali</Option>
                <Option value="Norwegian">Norwegian</Option>
                <Option value="Oromo">Oromo</Option>
                <Option value="Pashto">Pashto</Option>
                <Option value="Polish">Polish</Option>
                <Option value="Portuguese(Brazil)">Portuguese(Brazil)</Option>
                <Option value="Portuguese(Portugal)">Portuguese(Portugal)</Option>
                <Option value="Punjabi">Punjabi</Option>
                <Option value="Rohingya">Rohingya</Option>
                <Option value="Romanian(Moldavan)">Romanian(Moldavan)</Option>
                <Option value="Russian">Russian</Option>
                <Option value="Serbian">Serbian</Option>
                <Option value="Slovak">Slovak</Option>
                <Option value="Slovenian">Slovenian</Option>
                <Option value="Somali">Somali</Option>
                <Option value="Spanish(Castilian)">Spanish(Castilian)</Option>
                <Option value="Spanish(Latin American)">Spanish(Latin American)</Option>
                <Option value="Spanish(other varieties)">Spanish(other varieties)</Option>
                <Option value="Swahili">Swahili</Option>
                <Option value="Swedish">Swedish</Option>
                <Option value="Tagalog">Tagalog</Option>
                <Option value="Tamil">Tamil</Option>
                <Option value="Telugu">Telugu</Option>
                <Option value="Thai">Thai</Option>
                <Option value="Tibetan">Tibetan</Option>
                <Option value="Tigrinya">Tigrinya</Option>
                <Option value="Turkish">Turkish</Option>
                <Option value="Ukrainian">Ukrainian</Option>
                <Option value="Urdu">Urdu</Option>
                <Option value="Uzbek">Uzbek</Option>
                <Option value="Vietnamese">Vietnamese</Option>
                <Option value="Wolof">Wolof</Option>
                <Option value="Yoruba">Yoruba</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Form>
    </Drawer>
  );
};

export default CreateCollection;