import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const Result = styled.div`
  margin-top: 20px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 20px;
`;

const UrlShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/shorten`, { url: originalUrl });
      setShortUrl(response.data.shortUrl);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || 'An error occurred';
      setError(errorMsg);
    }
  };

  return (
    <Container>
      <h1>URL Shortener</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter your URL"
          required
        />
        <Button type="submit">Shorten</Button>
      </Form>
      {shortUrl && (
        <Result>
          <p>Short URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </Result>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default UrlShortener;
