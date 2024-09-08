import React, { useState } from 'react';
import axios from 'axios';

const UrlShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
        console.log(process.env, 'process.env.REACT_APP_API_URL')
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/shorten`, { url: originalUrl });
      setShortUrl(response.data.shortUrl);
      console.log(response, 'response')
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter your URL"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Shorten</button>
      </form>
      {shortUrl && (
        <div style={styles.result}>
          <p>Short URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </div>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '10px'
  },
  input: {
    padding: '10px',
    fontSize: '16px'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  result: {
    marginTop: '20px'
  },
  error: {
    color: 'red',
    marginTop: '20px'
  }
};

export default UrlShortener;
