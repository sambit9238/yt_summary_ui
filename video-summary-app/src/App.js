import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, FormGroup, Label, Input, Button, Card, CardBody, Spinner } from 'reactstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import { API_URL } from './components/Macro';
import './App.css';

function App() {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const startTime = new Date();

    try {
      const result = await axios.post(`${API_URL}`, {
        openai_api_key: openaiApiKey,
        video_url: videoUrl,
      });
      setResponse(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    const endTime = new Date();
    setTimeTaken(((endTime - startTime) / 1000).toFixed(2));
    setLoading(false);
  };

  return (
    <>
      <Header />
      <Container className="container">
        <Form className="input-form" onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="openaiApiKey">OpenAI API Key:</Label>
            <Input
              id="openaiApiKey"
              type="text"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="videoUrl">YouTube Video URL:</Label>
            <Input
              id="videoUrl"
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </FormGroup>
          <Button className="custom-button" color="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Get Summary'}
          </Button>
        </Form>
        {response && (
          <Card className="mt-4">
            <CardBody>
              <div className="result-section">
                <div className="title">Video URL:</div>
                <div className="content">{response.video_url}</div>
              </div>
  
              <div className="result-section">
                <div className="title">Summary:</div>
                <div className="content"><div dangerouslySetInnerHTML={{ __html: response.summary }} /></div>
              </div>

              <div className="result-section">
                <div className="title">Approximate Cost:</div>
                <div className="content">{response.approximate_cost}</div>
              </div>

              {timeTaken && <div className="result-section">
                <div className="title">Time Taken:</div>
                <div className="content">{timeTaken} seconds</div>
              </div>}

              <div className="result-section">
                <div className="title">Transcription:</div>
                <div className="content" style={{ maxHeight: '200px', overflowY: 'scroll', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '0.25rem', padding: '0.375rem 0.75rem' }}><p>{response.transcription}</p></div>
              </div>

            </CardBody>
          </Card>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default App;
