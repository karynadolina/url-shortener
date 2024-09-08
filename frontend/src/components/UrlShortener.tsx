import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 12px 15px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const Result = styled.div`
  margin-top: 25px;
  padding: 15px;
  background-color: #e7f9e7;
  border: 1px solid #c3e6c3;
  border-radius: 5px;
`;

const ShortUrlLink = styled.a`
  color: #28a745;
  font-weight: bold;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.3s ease;

  &:hover {
    color: #218838;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
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
            <Title>URL Shortener</Title>
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
                    <ShortUrlLink href={shortUrl} target="_blank" rel="noopener noreferrer">
                        {shortUrl}
                    </ShortUrlLink>
                </Result>
            )}
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
    );
};

export default UrlShortener;
