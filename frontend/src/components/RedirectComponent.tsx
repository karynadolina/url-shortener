import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

const InfoMessage = styled.p`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const OriginalUrlLink = styled.a`
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
  word-break: break-all;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
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

const RedirectComponent: React.FC = () => {
    const { shortId } = useParams<{ shortId: string }>();
    const [originalUrl, setOriginalUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const getOriginalUrl = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/${shortId}`);
                setOriginalUrl(response.data.original_url);
            } catch (err: any) {
                setError('Failed to retrieve the original URL. Short URL not found.');
            }
        };

        getOriginalUrl();
    }, [shortId]);

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <Container>
            <Title>Original URL Found</Title>
            {originalUrl ? (
                <InfoMessage>
                    Your original URL is: <OriginalUrlLink href={originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</OriginalUrlLink>
                </InfoMessage>
            ) : (
                <InfoMessage>Retrieving original URL...</InfoMessage>
            )}
        </Container>
    );
};

export default RedirectComponent;
